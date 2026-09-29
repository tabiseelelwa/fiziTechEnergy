/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { getConnection } from "@/app/lib/db";

export async function GET() {
  try {
    const [[statsResult], evolutionSeptJours, repartitionForfaits]: any =
      await Promise.all([
        // A. Requete pour les 4 cartes KPI (Jour, Semaine, Mois, Année)
        getConnection().query(`
        SELECT 
          COALESCE(SUM(CASE WHEN DATE(datePaiement) = CURDATE() THEN montantPaye ELSE 0 END), 0) AS ventesJour,
          COALESCE(SUM(CASE WHEN YEARWEEK(datePaiement, 1) = YEARWEEK(CURDATE(), 1) THEN montantPaye ELSE 0 END), 0) AS ventesSemaine,
          COALESCE(SUM(CASE WHEN MONTH(datePaiement) = MONTH(CURDATE()) AND YEAR(datePaiement) = YEAR(CURDATE()) THEN montantPaye ELSE 0 END), 0) AS ventesMois,
          COALESCE(SUM(CASE WHEN YEAR(datePaiement) = YEAR(CURDATE()) THEN montantPaye ELSE 0 END), 0) AS ventesAnnee
        FROM paiement
        WHERE statutPaiement = 'Succès' OR statutPaiement = 'Réussi'
      `),

        // B. Requete pour l'évolution des 7 derniers jours (du plus ancien au plus récent)
        getConnection().query(`
          SELECT 
            DATE_FORMAT(d.date_jour, '%d/%m') AS jour,
            COALESCE(SUM(p.montantPaye), 0) AS ventes
          FROM (
            SELECT DATE_SUB(CURDATE(), INTERVAL n.a DAY) AS date_jour
            FROM (
              SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3
              UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6
            ) AS n
          ) AS d
          LEFT JOIN paiement p 
            ON DATE(p.datePaiement) = d.date_jour 
          AND (p.statutPaiement = 'Succès' OR p.statutPaiement = 'Réussi')
          GROUP BY d.date_jour
          ORDER BY d.date_jour ASC;
        `),

        // C. Requete pour la répartition des forfaits (Top forfaits vendus)
        getConnection().query(`
        SELECT 
          f.designation AS designation,
          COUNT(p.idPaiement) AS total
        FROM paiement p
        JOIN typeForfait f ON p.codeTypeForfait = f.codeTypeForfait
        WHERE p.statutPaiement = 'Succès' OR p.statutPaiement = 'Réussi'
        GROUP BY f.codeTypeForfait, f.designation
        ORDER BY total DESC
        LIMIT 6
      `),
      ]);

    // Formatage et retour de la réponse JSON
    return NextResponse.json({
      stats: {
        ventesJour: Number(statsResult[0]?.ventesJour || 0),
        ventesSemaine: Number(statsResult[0]?.ventesSemaine || 0),
        ventesMois: Number(statsResult[0]?.ventesMois || 0),
        ventesAnnee: Number(statsResult[0]?.ventesAnnee || 0),
      },
      evolutionSeptJours: (evolutionSeptJours[0] || []).map((item: any) => ({
        jour: item.jour,
        ventes: Number(item.ventes),
      })),
      repartitionForfaits: (repartitionForfaits[0] || []).map((item: any) => ({
        designation: item.designation,
        total: Number(item.total),
      })),
    });
  } catch (error) {
    console.error("Erreur lors de la récupération du dashboard:", error);
    return NextResponse.json(
      { message: "Erreur serveur lors du chargement des statistiques." },
      { status: 500 },
    );
  }
}
