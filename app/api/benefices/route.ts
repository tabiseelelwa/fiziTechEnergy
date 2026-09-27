import { NextResponse } from "next/server";
import { getConnection } from "@/app/lib/db";
import { RowDataPacket } from "mysql2/promise";

// Interfaces SQL
export interface BeneficesStatsRow extends RowDataPacket {
  beneficesJour: number | string;
  beneficesSemaine: number | string;
  beneficesMois: number | string;
  beneficesAnnee: number | string;
}

export interface EvolutionSeptJoursRow extends RowDataPacket {
  jour: string;
  benefices: number | string;
}

export interface RepartitionSourceRow extends RowDataPacket {
  source: string;
  total: number | string;
}

export interface DashboardBeneficesApiResponse {
  stats: {
    beneficesJour: number;
    beneficesSemaine: number;
    beneficesMois: number;
    beneficesAnnee: number;
  };
  evolutionSeptJours: {
    jour: string;
    benefices: number;
  }[];
  repartitionSources: {
    source: string;
    total: number;
  }[];
}

export async function GET(): Promise<NextResponse> {
  try {
    const connection = getConnection();

    // 1. Calcul des KPI : (Total Paiements 'Reussi') - (Total Dépenses)
    const [statsRows] = await connection.query<BeneficesStatsRow[]>(`
      SELECT 
        /* Aujourd'hui */
        (
          COALESCE((SELECT SUM(montantPaye) FROM paiement WHERE statutPaiement = 'Reussi' AND DATE(datePaiement) = CURDATE()), 0) -
          COALESCE((SELECT SUM(montantDepense) FROM depense WHERE DATE(dateDepense) = CURDATE()), 0)
        ) AS beneficesJour,

        /* Cette Semaine */
        (
          COALESCE((SELECT SUM(montantPaye) FROM paiement WHERE statutPaiement = 'Reussi' AND YEARWEEK(datePaiement, 1) = YEARWEEK(CURDATE(), 1)), 0) -
          COALESCE((SELECT SUM(montantDepense) FROM depense WHERE YEARWEEK(dateDepense, 1) = YEARWEEK(CURDATE(), 1)), 0)
        ) AS beneficesSemaine,

        /* Ce Mois-ci */
        (
          COALESCE((SELECT SUM(montantPaye) FROM paiement WHERE statutPaiement = 'Reussi' AND MONTH(datePaiement) = MONTH(CURDATE()) AND YEAR(datePaiement) = YEAR(CURDATE())), 0) -
          COALESCE((SELECT SUM(montantDepense) FROM depense WHERE MONTH(dateDepense) = MONTH(CURDATE()) AND YEAR(dateDepense) = YEAR(CURDATE())), 0)
        ) AS beneficesMois,

        /* Cette Année */
        (
          COALESCE((SELECT SUM(montantPaye) FROM paiement WHERE statutPaiement = 'Reussi' AND YEAR(datePaiement) = YEAR(CURDATE())), 0) -
          COALESCE((SELECT SUM(montantDepense) FROM depense WHERE YEAR(dateDepense) = YEAR(CURDATE())), 0)
        ) AS beneficesAnnee
    `);

    // 2. Évolution du bénéfice net sur les 7 derniers jours (Paiements - Dépenses)
    const [evolutionRows] = await connection.query<EvolutionSeptJoursRow[]>(`
      SELECT 
        DATE_FORMAT(dates.jour_date, '%d/%m') AS jour,
        (
          COALESCE((SELECT SUM(p.montantPaye) FROM paiement p WHERE p.statutPaiement = 'Reussi' AND DATE(p.datePaiement) = dates.jour_date), 0) - 
          COALESCE((SELECT SUM(d.montantDepense) FROM depense d WHERE DATE(d.dateDepense) = dates.jour_date), 0)
        ) AS benefices
      FROM (
        SELECT CURDATE() - INTERVAL (a.a + b.a * 10) DAY AS jour_date
        FROM (SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6) AS a
        CROSS JOIN (SELECT 0 AS a) AS b
        WHERE (CURDATE() - INTERVAL (a.a + b.a * 10) DAY) >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
      ) dates
      ORDER BY dates.jour_date ASC
    `);

    // 3. Répartition des entrées par Opérateur (ex: M-Pesa, Cash...) ou par forfait
    const [repartitionRows] = await connection.query<RepartitionSourceRow[]>(`
      SELECT 
        COALESCE(p.operateur, 'Autre') AS source,
        SUM(p.montantPaye) AS total
      FROM paiement p
      WHERE p.statutPaiement = 'Reussi'
      GROUP BY p.operateur
    `);

    const statsData = statsRows[0];

    const responseData: DashboardBeneficesApiResponse = {
      stats: {
        beneficesJour: Number(statsData?.beneficesJour || 0),
        beneficesSemaine: Number(statsData?.beneficesSemaine || 0),
        beneficesMois: Number(statsData?.beneficesMois || 0),
        beneficesAnnee: Number(statsData?.beneficesAnnee || 0),
      },
      evolutionSeptJours: evolutionRows.map((row) => ({
        jour: row.jour,
        benefices: Number(row.benefices || 0),
      })),
      repartitionSources: repartitionRows.map((row) => ({
        source: row.source || "Autre",
        total: Number(row.total || 0),
      })),
    };

    return NextResponse.json(responseData, { status: 200 });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Erreur inconnue";

    return NextResponse.json(
      {
        message: "Erreur lors du calcul des bénéfices",
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}