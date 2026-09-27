/* eslint-disable @typescript-eslint/no-explicit-any */
import { getConnection } from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const db = await getConnection();

    // 1. RECETTES JOURNALIÈRES PAR SITE (Aujourd'hui)
    const [recettesRows]: any = await db.query(`
      SELECT 
        LOWER(s.designSite) AS siteKey,
        COALESCE(SUM(pf.montant), 0) AS totalRecette
      FROM site s
      LEFT JOIN user u ON u.idSite = s.idSite
      LEFT JOIN paiement p ON p.idUser = u.idUser AND DATE(p.datePaiement) = CURDATE()
      LEFT JOIN typeForfait tf ON p.codeTypeForfait = tf.codeTypeForfait
      LEFT JOIN prix pf ON tf.idPrix = pf.idPrix
      GROUP BY s.idSite, s.designSite
    `);

    const recettesJourParSite = {
      tshikapa: 0,
      katende: 0,
      durba: 0,
      misisi: 0,
    };

    if (Array.isArray(recettesRows)) {
      recettesRows.forEach((row: { siteKey: string; totalRecette: number }) => {
        const key = row.siteKey ? row.siteKey.trim().toLowerCase() : "";
        if (key in recettesJourParSite) {
          recettesJourParSite[key as keyof typeof recettesJourParSite] = Number(
            row.totalRecette,
          );
        }
      });
    }

    // 2. CLIENTS ACTUELLEMENT CONNECTÉS PAR SITE (Dernier statut de chaque client)
    // 2. CLIENTS ACTUELLEMENT CONNECTÉS PAR SITE
    const [connectesRows]: any = await db.query(`
      SELECT 
        s.designSite AS site,
        COUNT(DISTINCT hp.idClient) AS connectes
      FROM site s
      LEFT JOIN user u ON u.idSite = s.idSite
      LEFT JOIN paiement p ON p.idUser = u.idUser
      INNER JOIN (
        SELECT idClient, MAX(idPaiement) AS max_idPaiement
        FROM paiement
        WHERE idUser IS NOT NULL
        GROUP BY idClient
      ) dernier_p ON p.idPaiement = dernier_p.max_idPaiement
      INNER JOIN historique_presence hp ON hp.idClient = p.idClient
      INNER JOIN (
        SELECT idClient, MAX(id) AS max_id
        FROM historique_presence
        GROUP BY idClient
      ) latest ON hp.idClient = latest.idClient AND hp.id = latest.max_id
      WHERE hp.statut IN ('connecté', 'connecte')
      GROUP BY s.idSite, s.designSite
`);

    const clientsConnectesParSite = Array.isArray(connectesRows)
      ? connectesRows.map((row: any) => ({
          site: row.site,
          connectes: Number(row.connectes),
        }))
      : [];

    // 3. ÉVOLUTION DES CONNEXIONS AU FIL DE LA JOURNÉE (Aujourd'hui)
    const [presenceRows]: any = await db.query(`
     SELECT 
      DATE_FORMAT(hp.horodatage, '%H:00') AS heure,
      COALESCE(SUM(CASE WHEN LOWER(s.designSite) = 'tshikapa' THEN 1 ELSE 0 END), 0) AS tshikapa,
      COALESCE(SUM(CASE WHEN LOWER(s.designSite) = 'katende' THEN 1 ELSE 0 END), 0) AS katende,
      COALESCE(SUM(CASE WHEN LOWER(s.designSite) = 'durba' THEN 1 ELSE 0 END), 0) AS durba,
      COALESCE(SUM(CASE WHEN LOWER(s.designSite) = 'misisi' THEN 1 ELSE 0 END), 0) AS misisi
    FROM historique_presence hp
    JOIN (
      SELECT p1.idClient, u.idSite
      FROM paiement p1
      JOIN user u ON p1.idUser = u.idUser
      INNER JOIN (
        SELECT idClient, MAX(idPaiement) AS max_idPaiement
        FROM paiement
        GROUP BY idClient
      ) p2 ON p1.idPaiement = p2.max_idPaiement
    ) client_site ON hp.idClient = client_site.idClient
    JOIN site s ON client_site.idSite = s.idSite
    WHERE DATE(hp.horodatage) = CURDATE()
      AND hp.statut IN ('connecté', 'connecte')
    GROUP BY DATE_FORMAT(hp.horodatage, '%H:00')
    ORDER BY heure ASC
    `);

    const evolutionPresence = Array.isArray(presenceRows)
      ? presenceRows.map((row: any) => ({
          heure: row.heure,
          tshikapa: Number(row.tshikapa),
          katende: Number(row.katende),
          durba: Number(row.durba),
          misisi: Number(row.misisi),
        }))
      : [];

    return NextResponse.json({
      recettesJourParSite,
      clientsConnectesParSite,
      evolutionPresence,
    });
  } catch (error: any) {
    console.error("Détail de l'erreur API Audience :", error);

    return NextResponse.json(
      {
        message:
          "Erreur serveur lors de la récupération des données d'audience.",
        errorDetails: error?.message || String(error),
      },
      { status: 500 },
    );
  }
}
