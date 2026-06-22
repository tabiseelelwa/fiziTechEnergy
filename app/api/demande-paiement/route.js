import { getConnection } from "@/app/lib/db";
import { NextResponse } from "next/server";
import { RouterOSClient } from 'routeros-client'; // 🔌 Retour à la bibliothèque native ultra-stable

export async function POST(request) {
    try {
        const { telephone, codeTypeForfait, operateur, nomClient } = await request.json()

        // Validation des données reçues du formulaire
        if (!telephone || !codeTypeForfait || !operateur) {
            return NextResponse.json(
                { message: "Champs obligatoires manquants." },
                { status: 400 }
            )
        }

        const pool = getConnection();

        // Anti-cumul : vérifier si le numéro possède déjà un ticket actif
        const queryCheck = `
            SELECT t.* FROM ticket t
            JOIN Paiement p ON t.codeTicket = p.codeTicket
            JOIN client c ON p.idClient = c.idClient
            WHERE c.Telephone = ? AND t.statut = 'Actif' AND t.dateExpiration > NOW()
            LIMIT 1
        `;

        const [ticketsActifs] = await pool.execute(queryCheck, [telephone]);

        if (ticketsActifs.length > 0) {
            return NextResponse.json(
                { message: "Vous avez déjà un forfait actif sur ce numéro. Veuillez vous connecter." },
                { status: 400 }
            );
        }

        // Récupérer les détails du forfait
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

        // Enregistrer ou mettre à jour le client
        let idClient;
        const [clientsExistants] = await pool.execute(
            'SELECT idClient FROM client WHERE Telephone = ?',
            [telephone]
        );

        if (clientsExistants.length > 0) {
            idClient = clientsExistants[0].idClient;
            if (nomClient) {
                await pool.execute('UPDATE client SET nomClient = ? WHERE idClient = ?', [nomClient, idClient]);
            }
        } else {
            const [insertClient] = await pool.execute(
                'INSERT INTO client (nomClient, Telephone) VALUES (?, ?)',
                [nomClient || 'Client Hotspot', telephone]
            );
            idClient = insertClient.insertId;
        }

        // Simulation de la référence de paiement
        const referenceAbonnementSimulee = `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        // Générer un CODE TICKET unique temporaire (FT-XXXX)
        const codeTicketUnique = `FT-${Math.floor(1000 + Math.random() * 9000)}`;

        const dureeMinutes = parseInt(forfaitChoisi.dureeMinutes) || 60;

        const dateExpirationFrontend = new Date();
        dateExpirationFrontend.setMinutes(dateExpirationFrontend.getMinutes() + dureeMinutes);

        // Insertion du ticket en BDD locale
        const queryInsertTicket = `
            INSERT INTO ticket (codeTicket, dateExpiration, statut) 
            VALUES (?, DATE_ADD(NOW(), INTERVAL ? MINUTE), ?)
        `;
        await pool.execute(queryInsertTicket, [codeTicketUnique, dureeMinutes, 'Actif']);

        // Insertion du Paiement en BDD locale
        await pool.execute(
            `INSERT INTO Paiement (idClient, codeTypeForfait, codeTicket, referenceAbonnement, montantPaye, operateur, statutPaiement) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [idClient, codeTypeForfait, codeTicketUnique, referenceAbonnementSimulee, forfaitChoisi.prixFC, operateur, 'Reussi']
        );

        // =========================================================================
        // ENVOI AU MIKROTIK VIA L'API BINAIRE COMPATIBLE (PORT 8728)
        // =========================================================================
        try {
            // Extraction de l'adresse IP pure sans http:// ni rien d'autre
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

            // Connexion au socket binaire du routeur
            const api = await client.connect();
            console.log(`[MIKROTIK API] 🔌 Connecté avec succès au routeur sur l'IP ${rawHost}`);

            // Ajout de l'utilisateur dans le Hotspot
            await api.menu('/ip/hotspot/user').add({
                name: codeTicketUnique,
                password: codeTicketUnique,
                profile: "default",
                'limit-uptime': `${dureeMinutes}m`,
                comment: `Paye via ${operateur} (${telephone})`
            });

            console.log(`[MIKROTIK API] ✅ Ticket ${codeTicketUnique} créé avec succès.`);

            // Fermeture propre
            await client.close();

        } catch (mikrotikError) {
            // Évite de bloquer le client si la liaison avec la VM échoue temporairement
            console.error("[MIKROTIK API] ⚠️ Erreur lors de l'envoi au routeur :", mikrotikError.message);
        }

        // Renvoyer la réponse au front-end
        return NextResponse.json({
            success: true,
            message: "Paiement validé et ticket généré avec succès.",
            ticket: {
                code: codeTicketUnique,
                expiration: dateExpirationFrontend,
                forfait: forfaitChoisi.designation
            }
        }, { status: 201 });

    } catch (error) {
        console.error("Erreur API demande-paiement :", error);
        return NextResponse.json(
            { message: "Une erreur interne est survenue au niveau du serveur. " + error.message },
            { status: 500 }
        );
    }
}