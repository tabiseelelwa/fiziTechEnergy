/* eslint-disable @typescript-eslint/no-explicit-any */
import { getConnection } from "@/app/lib/db";
import { NextResponse } from "next/server";
import { RouterOSClient } from "routeros-client";
import { RowDataPacket, ResultSetHeader } from "mysql2/promise";
import { getSessionUser } from "@/app/lib/auth";

const normalize = (str: string = "") =>
  str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

export async function POST(request: Request) {
  const session = await getSessionUser();

  if (!session) {
    return NextResponse.json(
      { message: "Session expirée ou invalide. Veuillez vous reconnecter." },
      { status: 401 },
    );
  }

  const idUser = session.idUser;

  try {
    const { codeTypeForfait, operateur, telephone, nomClient } =
      await request.json();

    const pool = getConnection();

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
      `SELECT tf.*, pr.montant as prix
       FROM typeForfait tf 
       LEFT JOIN prix pr ON tf.idPrix = pr.idPrix
       WHERE tf.codeTypeForfait = ?`,
      [codeTypeForfait],
    );

    if (forfaits.length === 0) {
      return NextResponse.json(
        { message: "Type de forfait introuvable." },
        { status: 404 },
      );
    }

    const forfaitChoisi = forfaits[0];
    const montant = forfaitChoisi.prix;

    const phone = telephone.trim();

    const [clientsExistants] = await pool.execute<RowDataPacket[]>(
      "SELECT idClient FROM client WHERE Telephone = ?",
      [phone],
    );

    let idClient: number | null = null;

    if (clientsExistants.length > 0) {
      idClient = clientsExistants[0].idClient;

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

    const referenceVente = `TXN-${Date.now()}-${idUser.toString().padStart(3, "0")}`;
    const codeTicketUnique = `EH-${Math.floor(1000 + Math.random() * 9000)}`;
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
        operateur,
        "Reussi",
      ],
    );

    try {
      const client = new RouterOSClient({
        host: "126.0.1.1",
        user: "admin",
        password: "xxlk",
        timeout: 5000,
      });

      const api = await client.connect();

      await api.menu("/ip/hotspot/user").add({
        name: codeTicketUnique,
        password: codeTicketUnique,
        profile: "default",
        "limit-uptime": `${dureeMinutes}m`,
      });

      await client.close();
    } catch (mikrotikError) {
      console.error(
        "[MIKROTIK API] Erreur d'enregistrement MikroTik :",
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
          prix: montant,
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
        message: "Erreur serveur lors du traitement de la vente.",
        ...(process.env.NODE_ENV !== "production" && {
          details: error?.message,
        }),
      },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  const session = await getSessionUser();

  if (!session) {
    return NextResponse.json({ message: "Non autorisé." }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const codeTypeForfait = searchParams.get("codeTypeForfait");
    const codeTicket = searchParams.get("codeTicket");

    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, parseInt(searchParams.get("limit") || "6", 10));
    const offset = (page - 1) * limit;

    const conditions: string[] = [];
    const params: any[] = [];

    const isCaissier = normalize(session.designRole) === "caissier";
    if (isCaissier) {
      conditions.push(`p.idUser = ?`);
      params.push(session.idUser);
    }

    if (codeTicket && codeTicket.trim() !== "") {
      conditions.push(`p.codeTicket LIKE ?`);
      params.push(`%${codeTicket.trim()}%`);
    }

    if (startDate && startDate.trim() !== "") {
      conditions.push(`DATE(p.datePaiement) >= ?`);
      params.push(startDate.trim());
    }

    if (endDate && endDate.trim() !== "") {
      conditions.push(`DATE(p.datePaiement) <= ?`);
      params.push(endDate.trim());
    }

    if (codeTypeForfait && codeTypeForfait !== "ALL") {
      conditions.push(`p.codeTypeForfait = ?`);
      params.push(Number(codeTypeForfait));
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const [countResult]: any = await getConnection().query(
      `
        SELECT COUNT(*) as total 
        FROM paiement p
        ${whereClause}
      `,
      params,
    );

    const totalTickets = countResult[0]?.total || 0;
    const totalPages = Math.ceil(totalTickets / limit);

    const [rows]: any = await getConnection().query(
      `
      SELECT 
        p.idPaiement,
        p.codeTicket,
        p.montantPaye,
        p.operateur,
        p.datePaiement,
        p.idClient,
        tf.designation,
        c.Telephone,
        t.dateExpiration
      FROM paiement p
      LEFT JOIN typeForfait tf ON p.codeTypeForfait = tf.codeTypeForfait
      LEFT JOIN client c ON p.idClient = c.idClient
      LEFT JOIN ticket t ON p.codeTicket = t.codeTicket
      ${whereClause}
      ORDER BY p.datePaiement DESC
      LIMIT ? OFFSET ?
      `,
      [...params, limit, offset],
    );

    return NextResponse.json(
      {
        ventes: rows,
        totalTickets,
        totalPages,
        currentPage: page,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Erreur API Ventes:", error);
    return NextResponse.json(
      { message: "Erreur lors de la récupération des ventes." },
      { status: 500 },
    );
  }
}