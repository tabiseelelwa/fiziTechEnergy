/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";
import { getConnection } from "@/app/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const dateDebut = searchParams.get("dateDebut");
    const dateFin = searchParams.get("dateFin");
    const userEmail = searchParams.get("userEmail");
    const ville = searchParams.get("ville");
    const site = searchParams.get("site");

    const pool = getConnection();

    const whereConditions: string[] = ["1=1"];
    const queryParams: any[] = [];

    if (dateDebut) {
      whereConditions.push("p.datePaiement >= ?");
      queryParams.push(`${dateDebut} 00:00:00`);
    }

    if (dateFin) {
      whereConditions.push("p.datePaiement <= ?");
      queryParams.push(`${dateFin} 23:59:59`);
    }

    if (userEmail) {
      whereConditions.push("u.email LIKE ?");
      queryParams.push(`%${userEmail}%`);
    }

    if (ville) {
      whereConditions.push("s.idVille = ?");
      queryParams.push(ville);
    }

    if (site) {
      whereConditions.push("s.designSite = ?");
      queryParams.push(site);
    }

    const whereClause = whereConditions.join(" AND ");

    const baseJoins = `
      FROM paiement p
      LEFT JOIN typeforfait tf ON p.codeTypeForfait = tf.codeTypeForfait
      LEFT JOIN client c ON p.idClient = c.idClient
      LEFT JOIN user u ON p.idUser = u.idUser
      LEFT JOIN site s ON u.idSite = s.idSite
    `;

    // 1. Stats Globales
    const [statsRows] = await pool.execute<RowDataPacket[]>(
      `SELECT COALESCE(SUM(p.montantPaye), 0) AS totalEncaisse, COUNT(p.idPaiement) AS ticketsGeneres ${baseJoins} WHERE ${whereClause}`,
      queryParams,
    );

    // 2. Mode de paiement principal
    const [modeRows] = await pool.execute<RowDataPacket[]>(
      `SELECT p.operateur, COUNT(*) as count ${baseJoins} WHERE ${whereClause} GROUP BY p.operateur ORDER BY count DESC LIMIT 1`,
      queryParams,
    );

    // 3. Évolution des recettes
    const [evolutionRows] = await pool.execute<RowDataPacket[]>(
      `
      SELECT 
        DATE_FORMAT(p.datePaiement, '%d/%m %H:00') AS heure,
        SUM(p.montantPaye) AS ventes
      ${baseJoins}
      WHERE ${whereClause}
      GROUP BY DATE_FORMAT(p.datePaiement, '%d/%m %H:00')
      ORDER BY MIN(p.datePaiement) ASC
      `,
      queryParams,
    );

    // 4. Répartition des forfaits
    const [repartitionRows] = await pool.execute<RowDataPacket[]>(
      `
      SELECT 
        COALESCE(tf.designation, 'Inconnu') AS designation,
        COUNT(p.idPaiement) AS total
      ${baseJoins}
      WHERE ${whereClause}
      GROUP BY tf.codeTypeForfait, tf.designation
      ORDER BY total DESC
      `,
      queryParams,
    );

    // 5. Historique des transactions récentes
    const [recentRows] = await pool.execute<RowDataPacket[]>(
      `
      SELECT 
        p.idPaiement,
        p.codeTicket,
        c.Telephone,
        tf.designation,
        p.montantPaye,
        p.operateur,
        p.datePaiement,
        u.email,
        s.idVille,
        s.designSite
      ${baseJoins}
      WHERE ${whereClause}
      ORDER BY p.datePaiement DESC
      `,
      queryParams,
    );

    // 6. Options Villes et Sites
    const [villesRows] = await pool.execute<RowDataPacket[]>(
      "SELECT DISTINCT idVille FROM site WHERE idVille IS NOT NULL AND idVille != '' ORDER BY idVille ASC",
    );
    const [sitesRows] = await pool.execute<RowDataPacket[]>(
      "SELECT DISTINCT designSite AS site FROM site WHERE designSite IS NOT NULL AND designSite != '' ORDER BY designSite ASC",
    );

    return NextResponse.json(
      {
        stats: {
          totalEncaisse: statsRows[0]?.totalEncaisse || 0,
          ticketsGeneres: statsRows[0]?.ticketsGeneres || 0,
          modePrincipal: modeRows[0]?.operateur || "Cash",
        },
        evolutionHeures: evolutionRows,
        repartitionForfaits: repartitionRows,
        recentVentes: recentRows,
        villesOptions: villesRows.map((r) => r.idVille).filter(Boolean),
        sitesOptions: sitesRows.map((r) => r.site).filter(Boolean),
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Erreur Backend Dashboard:", error);
    return NextResponse.json(
      {
        message: "Erreur lors du chargement des données filtrées",
        error: error?.message || String(error),
      },
      { status: 500 },
    );
  }
}