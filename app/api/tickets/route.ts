/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import {getConnection} from "@/app/lib/db";

export async function GET() {
  try {
    const [rows]: any = await getConnection().query(`
      SELECT 
        COUNT(CASE WHEN DATE(datePaiement) = CURDATE() THEN 1 END) AS jour,
        COUNT(CASE WHEN YEARWEEK(datePaiement, 1) = YEARWEEK(CURDATE(), 1) THEN 1 END) AS semaine,
        COUNT(CASE WHEN YEAR(datePaiement) = YEAR(CURDATE()) AND MONTH(datePaiement) = MONTH(CURDATE()) THEN 1 END) AS mois,
        COUNT(CASE WHEN YEAR(datePaiement) = YEAR(CURDATE()) THEN 1 END) AS annee
      FROM paiement
    `);

    const stats = rows[0] || { jour: 0, semaine: 0, mois: 0, annee: 0 };

    return NextResponse.json({
      jour: Number(stats.jour),
      semaine: Number(stats.semaine),
      mois: Number(stats.mois),
      annee: Number(stats.annee),
    });
  } catch (error) {
    console.error("Erreur lors du comptage des tickets:", error);
    return NextResponse.json(
      { message: "Erreur serveur lors de la récupération des statistiques de comptage." },
      { status: 500 }
    );
  }
}