import { getConnection } from "@/app/lib/db";
import { NextResponse } from "next/server";
import { RouterOSClient } from 'routeros-client';

export async function POST(request) {
    try {
        const { idVendeur, codeTypeForfait, modePaiement, telephone, nomClient } = await request.json();

        const pool = getConnection();

        // 3. Récupérer les détails du forfait
        const [forfaits] = await pool.execute(
            'SELECT * FROM typeForfait WHERE codeTypeForfait = ?',
            [codeTypeForfait]
        );

        if (forfaits.length === 0) {
            return NextResponse.json(
                { message: "Type de forfait introuvable." },
                { status: 404 }
            );
        }

        const forfaitChoisi = forfaits[0];
        const montant = forfaitChoisi.prixFC;

        // 5. Gestion du Client (Recherche ou Création automatique)

        const phone = telephone.trim();

        // Recherche du client par numéro
        const [clientsExistants] = await pool.execute(
            'SELECT idClient FROM client WHERE Telephone = ?',
            [phone]
        );
        let idClient = null
        if (clientsExistants.length > 0) {
            // 1. Client trouvé -> Récupération de l'idClient
            idClient = clientsExistants[0].idClient;
            console.log("Client existant trouvé, ID : " + idClient);

            if (nomClient) {
                await pool.execute('UPDATE client SET nomClient = ? WHERE idClient = ?', [nomClient, idClient]);
            }
        } else {
            // 2. Client non trouvé -> Création du client
            const [resultatInsert] = await pool.execute(
                'INSERT INTO client (nomClient, Telephone) VALUES (?, ?)',
                [nomClient || 'Client Comptoir', phone]
            );

            // Récupération directe du nouvel ID généré
            idClient = resultatInsert.insertId;
            console.log("Nouveau client créé avec succès, ID : " + idClient);
        }


        // Vérification de sécurité : S'assurer qu'un idClient valide a été récupéré
        if (!idClient) {
            return NextResponse.json(
                { message: "Impossible d'identifier ou de créer le client avec ce numéro de téléphone." },
                { status: 400 }
            );
        }



        // 6. Génération des références uniques
        const referenceVente = `VEN-${Date.now()}`;
        const codeTicketUnique = `FT-${Math.floor(1000 + Math.random() * 9000)}`;
        const dureeMinutes = parseInt(forfaitChoisi.dureeMinutes) || 60;

        const dateExpirationFrontend = new Date();
        dateExpirationFrontend.setMinutes(dateExpirationFrontend.getMinutes() + dureeMinutes);

        // 7. Insertion du ticket en BDD
        const queryInsertTicket = `
            INSERT INTO ticket (codeTicket, dateExpiration, statut) 
            VALUES (?, DATE_ADD(NOW(), INTERVAL ? MINUTE), ?)
        `;
        await pool.execute(queryInsertTicket, [codeTicketUnique, dureeMinutes, 'Actif']);

        // 8. Enregistrement du Paiement avec traçabilité du Vendeur
        await pool.execute(
            `INSERT INTO Paiement (idClient, codeTypeForfait, codeTicket, referenceAbonnement, montantPaye, operateur, statutPaiement) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                idClient,
                codeTypeForfait,
                codeTicketUnique,
                referenceVente,
                montant,
                modePaiement,
                'Reussi'
            ]
        );

        // =========================================================================
        // ENVOI AU MIKROTIK VIA L'API BINAIRE COMPATIBLE (PORT 8728)
        // =========================================================================
        try {
            const rawHost = (process.env.ROUTER_HOST || '10.5.5.1')
                .replace('http://', '')
                .replace('https://', '')
                .split('/')[0]
                .split(':')[0];

            const client = new RouterOSClient({
                host: rawHost,
                user: process.env.ROUTER_USER || 'admin',
                password: process.env.ROUTER_PASS || '192.168.175.96',
                timeout: 5000
            });

            const api = await client.connect();
            console.log(`[MIKROTIK API] 🔌 Connecté avec succès pour la vente Vendeur #${idVendeur}`);

            await api.menu('/ip/hotspot/user').add({
                name: codeTicketUnique,
                password: codeTicketUnique,
                profile: "default",
                'limit-uptime': `${dureeMinutes}m`,
            });

            console.log(`[MIKROTIK API] ✅ Ticket ${codeTicketUnique} créé sur le routeur.`);
            await client.close();

        } catch (mikrotikError) {
            console.error("[MIKROTIK API] ⚠️ Erreur d'enregistrement MikroTik :", mikrotikError.message);
        }

        // 10. Réponse structurée pour impression immédiate ou affichage au vendeur
        return NextResponse.json({
            success: true,
            message: "Vente effectuée et ticket généré avec succès.",
            ticket: {
                code: codeTicketUnique,
                forfait: forfaitChoisi.designation,
                prixFC: montant,
                dureeMinutes: dureeMinutes,
                expiration: dateExpirationFrontend,
                dateVente: new Date().toISOString()
            }
        }, { status: 201 });

    } catch (error) {
        console.error("Erreur API vente-vendeur :", error);
        return NextResponse.json(
            { message: "Erreur serveur lors du traitement de la vente : " + error.message },
            { status: 500 }
        );
    }
}