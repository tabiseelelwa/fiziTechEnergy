/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";
import { getConnection } from "@/app/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Extraction des filtres depuis l'URL
    const dateDebut = searchParams.get("dateDebut");
    const dateFin = searchParams.get("dateFin");
    const userEmail = searchParams.get("userEmail");
    const ville = searchParams.get("ville");
    const site = searchParams.get("site");

    const pool = getConnection();

    // 1. Construction dynamique des clauses WHERE et des paramètres SQL
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

    // Jointures de base nécessaires pour appliquer tous les filtres
    const baseJoins = `
      FROM paiement p
      LEFT JOIN typeforfait tf ON p.codeTypeForfait = tf.codeTypeForfait
      LEFT JOIN client c ON p.idClient = c.idClient
      LEFT JOIN user u ON p.idUser = u.idUser
      LEFT JOIN site s ON u.idSite = s.idSite
      LEFT JOIN ville v ON s.idSite = v.idVille
    `;

    // 2. Requête Statistiques Globales (Total & Nombre de tickets)
    const [statsRows] = await pool.execute<RowDataPacket[]>(
      `
      SELECT 
        COALESCE(SUM(p.montantPaye), 0) AS totalEncaisse,
        COUNT(p.idPaiement) AS ticketsGeneres
      ${baseJoins}
      WHERE ${whereClause}
      `,
      queryParams,
    );

    // 3. Mode de paiement le plus utilisé sur la période / filtres
    const [modeRows] = await pool.execute<RowDataPacket[]>(
      `
      SELECT p.operateur, COUNT(*) as count
      ${baseJoins}
      WHERE ${whereClause}
      GROUP BY p.operateur
      ORDER BY count DESC
      LIMIT 1
      `,
      queryParams,
    );

    // 4. Évolution des ventes (groupée par jour ou par heure selon si un filtre de date est présent)
    const dateFormat = dateDebut || dateFin ? "%Y-%m-%d" : "%d/%m %H:00";
    const groupByFormat =
      dateDebut || dateFin
        ? "DATE(p.datePaiement)"
        : "DATE(p.datePaiement), HOUR(p.datePaiement)";

    const [evolutionRows] = await pool.execute<RowDataPacket[]>(
      `
      SELECT 
        DATE_FORMAT(p.datePaiement, '${dateFormat}') AS heure,
        SUM(p.montantPaye) AS ventes
      ${baseJoins}
      WHERE ${whereClause}
      GROUP BY ${groupByFormat}
      ORDER BY p.datePaiement ASC
      `,
      queryParams,
    );

    // 5. Répartition des ventes par type de forfait
    const [repartitionRows] = await pool.execute<RowDataPacket[]>(
      `
      SELECT 
        tf.designation,
        COUNT(p.idPaiement) AS total
      ${baseJoins}
      WHERE ${whereClause}
      GROUP BY tf.codeTypeForfait, tf.designation
      ORDER BY total DESC
      `,
      queryParams,
    );

    // 6. Historique complet de toutes les transactions filtrées
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

    // 7. Récupération des villes et sites uniques et non nuls
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
        villesOptions: villesRows.map((r) => r.ville).filter(Boolean),
        sitesOptions: sitesRows.map((r) => r.site).filter(Boolean),
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Erreur Backend Dashboard:", error);
    return NextResponse.json(
      { message: "Erreur lors du chargement des données filtrées", error },
      { status: 500 },
    );
  }
}
