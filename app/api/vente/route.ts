/* eslint-disable @typescript-eslint/no-explicit-any */
import { getConnection } from "@/app/lib/db";
import { NextResponse } from "next/server";
import { RouterOSClient } from "routeros-client";
import { RowDataPacket, ResultSetHeader } from "mysql2/promise";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const { codeTypeForfait, modePaiement, telephone, nomClient } =
      await request.json();
    const cookieStore = await cookies();
    const token = cookieStore.get("Empire-Lab_token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Non autorisé." }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { idUser: number };
    const idUser = decoded.idUser;

    if (!idUser) {
      return NextResponse.json(
        { message: "L'identifiant du vendeur (idUser) est requis." },
        { status: 400 },
      );
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

    const [ticketsActifs] = await pool.execute<RowDataPacket[]>(queryCheck, [
      telephone,
    ]);

    if (ticketsActifs.length > 0) {
      return NextResponse.json(
        {
          message:
            "Vous avez déjà un forfait actif sur ce numéro. Veuillez vous connecter.",
        },
        { status: 400 },
      );
    }

    const [forfaits] = await pool.execute<RowDataPacket[]>(
      "SELECT * FROM typeForfait WHERE codeTypeForfait = ?",
      [codeTypeForfait],
    );

    if (forfaits.length === 0) {
      return NextResponse.json(
        { message: "Type de forfait introuvable." },
        { status: 404 },
      );
    }

    const forfaitChoisi = forfaits[0];
    const montant = forfaitChoisi.prixFC;

    const phone = telephone.trim();

    const [clientsExistants] = await pool.execute<RowDataPacket[]>(
      "SELECT idClient FROM client WHERE Telephone = ?",
      [phone],
    );

    let idClient: number | null = null;

    if (clientsExistants.length > 0) {
      idClient = clientsExistants[0].idClient;
      console.log("Client existant trouvé, ID : " + idClient);

      if (nomClient) {
        await pool.execute(
          "UPDATE client SET nomClient = ? WHERE idClient = ?",
          [nomClient, idClient],
        );
      }
    } else {
      const [resultatInsert] = await pool.execute<ResultSetHeader>(
        "INSERT INTO client (nomClient, Telephone) VALUES (?, ?)",
        [nomClient || "Client Comptoir", phone],
      );

      idClient = resultatInsert.insertId;
      console.log("Nouveau client créé avec succès, ID : " + idClient);
    }

    if (!idClient) {
      return NextResponse.json(
        {
          message:
            "Impossible d'identifier ou de créer le client avec ce numéro de téléphone.",
        },
        { status: 400 },
      );
    }

    const referenceVente = `VEN-${Date.now()}`;
    const codeTicketUnique = `FT-${Math.floor(1000 + Math.random() * 9000)}`;
    const dureeMinutes = parseInt(forfaitChoisi.dureeMinutes) || 60;

    const dateExpirationFrontend = new Date();
    dateExpirationFrontend.setMinutes(
      dateExpirationFrontend.getMinutes() + dureeMinutes,
    );

    const queryInsertTicket = `
      INSERT INTO ticket (codeTicket, dateExpiration, statut) 
      VALUES (?, DATE_ADD(NOW(), INTERVAL ? MINUTE), ?)
    `;
    await pool.execute(queryInsertTicket, [
      codeTicketUnique,
      dureeMinutes,
      "Actif",
    ]);

    await pool.execute(
      `INSERT INTO Paiement (idClient, codeTypeForfait, codeTicket, idUser, referenceAbonnement, montantPaye, operateur, statutPaiement) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        idClient,
        codeTypeForfait,
        codeTicketUnique,
        idUser,
        referenceVente,
        montant,
        modePaiement,
        "Reussi",
      ],
    );

    // =========================================================================
    // ENVOI AU MIKROTIK VIA L'API BINAIRE COMPATIBLE
    // =========================================================================
    try {
      const rawHost = (process.env.ROUTER_HOST || "10.5.5.1")
        .replace("http://", "")
        .replace("https://", "")
        .split("/")[0]
        .split(":")[0];

      const client = new RouterOSClient({
        host: rawHost,
        user: process.env.ROUTER_USER || "admin",
        password: process.env.ROUTER_PASS || "192.168.175.96",
        timeout: 5000,
      });

      const api = await client.connect();
      console.log(
        `[MIKROTIK API] 🔌 Connecté avec succès pour la vente Vendeur #${idUser}`,
      );

      await api.menu("/ip/hotspot/user").add({
        name: codeTicketUnique,
        password: codeTicketUnique,
        profile: "default",
        "limit-uptime": `${dureeMinutes}m`,
      });

      console.log(
        `[MIKROTIK API] ✅ Ticket ${codeTicketUnique} créé sur le routeur.`,
      );
      await client.close();
    } catch (mikrotikError) {
      console.error(
        "[MIKROTIK API] ⚠️ Erreur d'enregistrement MikroTik :",
        mikrotikError,
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Vente effectuée et ticket généré avec succès.",
        ticket: {
          code: codeTicketUnique,
          forfait: forfaitChoisi.designation,
          prixFC: montant,
          dureeMinutes: dureeMinutes,
          expiration: dateExpirationFrontend,
          dateVente: new Date().toISOString(),
        },
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Erreur API vente-vendeur :", error);
    return NextResponse.json(
      {
        message:
          "Erreur serveur lors du traitement de la vente : " +
          (error?.message || error),
      },
      { status: 500 },
    );
  }
}


const JWT_SECRET = process.env.JWT_SECRET || "cle_secrete_empire_lab";

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("Empire-Lab_token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Non autorisé." }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { idUser: number };
    const idUser = Number(decoded.idUser);

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const codeTypeForfait = searchParams.get("codeTypeForfait");
    const codeTicket = searchParams.get("codeTicket");

    let query = `
      SELECT 
        p.idPaiement,
        p.codeTicket,
        p.montantPaye,
        p.operateur,
        p.datePaiement,
        p.idClient,
        tf.designation,
        c.Telephone
      FROM paiement p
      LEFT JOIN typeForfait tf ON p.codeTypeForfait = tf.codeTypeForfait
      LEFT JOIN client c ON p.idClient = c.idClient
      WHERE p.idUser = ?
    `;

    const queryParams: (string | number)[] = [idUser];

    // Filtre par Code Ticket (Recherche partielle avec LIKE)
    if (codeTicket && codeTicket.trim() !== "") {
      query += ` AND p.codeTicket LIKE ?`;
      queryParams.push(`%${codeTicket.trim()}%`);
    }

    // Filtre par Date de début
    if (startDate && startDate.trim() !== "") {
      query += ` AND DATE(p.datePaiement) >= ?`;
      queryParams.push(startDate);
    }

    // Filtre par Date de fin
    if (endDate && endDate.trim() !== "") {
      query += ` AND DATE(p.datePaiement) <= ?`;
      queryParams.push(endDate);
    }

    // Filtre par Type de forfait
    if (codeTypeForfait && codeTypeForfait !== "ALL") {
      query += ` AND p.codeTypeForfait = ?`;
      queryParams.push(Number(codeTypeForfait));
    }

    query += ` ORDER BY p.datePaiement DESC`;

    const pool = getConnection();
    const [rows] = await pool.execute<RowDataPacket[]>(query, queryParams);

    return NextResponse.json({ ventes: rows }, { status: 200 });
  } catch (error) {
    console.error("Erreur API Ventes:", error);
    return NextResponse.json(
      { message: "Erreur lors de la récupération des ventes." },
      { status: 500 }
    );
  }
}
