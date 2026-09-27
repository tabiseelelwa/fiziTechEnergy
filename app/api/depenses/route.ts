/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse, NextRequest } from "next/server";
import mysql from "mysql2/promise";
import { getConnection } from "@/app/lib/db";
import { getSessionUser } from "@/app/lib/auth";

const ALLOWED_ROLES = ["Admin", "Gerant"];

export async function GET() {
  // Vérification de la session et du rôle : cette route expose des
  // données financières, elle ne doit jamais être accessible sans
  // authentification ni à un rôle non autorisé, même si le frontend
  // masque déjà la page via RoleGuard.
  const session = await getSessionUser();

  if (!session) {
    return NextResponse.json({ message: "Non authentifié." }, { status: 401 });
  }

  if (!ALLOWED_ROLES.includes(session.designRole)) {
    return NextResponse.json({ message: "Accès refusé." }, { status: 403 });
  }

  try {
    // Requetes SQL pour les 4 KPIs principaux
    const statsQuery = `
      SELECT 
        COALESCE(SUM(CASE WHEN DATE(dateDepense) = CURDATE() THEN montantDepense ELSE 0 END), 0) AS depensesJour,
        COALESCE(SUM(CASE WHEN YEARWEEK(dateDepense, 1) = YEARWEEK(CURDATE(), 1) THEN montantDepense ELSE 0 END), 0) AS depensesSemaine,
        COALESCE(SUM(CASE WHEN YEAR(dateDepense) = YEAR(CURDATE()) AND MONTH(dateDepense) = MONTH(CURDATE()) THEN montantDepense ELSE 0 END), 0) AS depensesMois,
        COALESCE(SUM(CASE WHEN YEAR(dateDepense) = YEAR(CURDATE()) THEN montantDepense ELSE 0 END), 0) AS depensesAnnee
      FROM depense;
    `;

    // Évolution sur les 7 derniers jours
    const evolutionQuery = `
      SELECT 
        DATE_FORMAT(d.date_jour, '%d/%m') AS jour,
        COALESCE(SUM(dep.montantDepense), 0) AS depenses
      FROM (
        SELECT CURDATE() - INTERVAL (a.a + (10 * b.a)) DAY AS date_jour
        FROM (SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6) AS a
        CROSS JOIN (SELECT 0 AS a) AS b
      ) AS d
      LEFT JOIN depense dep ON DATE(dep.dateDepense) = d.date_jour
      GROUP BY d.date_jour
      ORDER BY d.date_jour ASC;
    `;

    const repartitionQuery = `
      SELECT 
        COALESCE(m.descriptMotif, 'Autre / Non spécifié') AS motif,
        SUM(d.montantDepense) AS total
      FROM depense d
      LEFT JOIN motifDepense m ON d.idMotifDepense = m.idMotifDepense
      GROUP BY d.idMotifDepense, m.descriptMotif
      ORDER BY total DESC
      LIMIT 6;
    `;

    // Exécution simultanée des requêtes
    const [statsRows, evolutionRows, repartitionRows] = await Promise.all([
      getConnection().query<mysql.RowDataPacket[]>(statsQuery),
      getConnection().query<mysql.RowDataPacket[]>(evolutionQuery),
      getConnection().query<mysql.RowDataPacket[]>(repartitionQuery),
    ]);

    const stats = statsRows[0][0];
    const evolutionSeptJours = evolutionRows[0];
    const repartitionMotifs = repartitionRows[0];

    return NextResponse.json({
      stats: {
        depensesJour: Number(stats.depensesJour) || 0,
        depensesSemaine: Number(stats.depensesSemaine) || 0,
        depensesMois: Number(stats.depensesMois) || 0,
        depensesAnnee: Number(stats.depensesAnnee) || 0,
      },
      evolutionSeptJours,
      repartitionMotifs,
    });
  } catch (error) {
    console.error("Erreur MySQL dépense:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des statistiques de dépenses" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await getSessionUser();

  if (!session) {
    return NextResponse.json({ message: "Non authentifié." }, { status: 401 });
  }

  if (!ALLOWED_ROLES.includes(session.designRole)) {
    return NextResponse.json({ message: "Accès refusé." }, { status: 403 });
  }

  try {
    const { montantDepense, idMotifDepense } = await request.json();

    const montant = Number(montantDepense);

    if (!Number.isFinite(montant) || montant <= 0 || !idMotifDepense) {
      return NextResponse.json(
        { message: "Montant invalide ou champs manquants." },
        { status: 400 },
      );
    }

    const [result]: any = await getConnection().query(
      "INSERT INTO depense (montantDepense, idMotifDepense, idUser) VALUES (?, ?, ?)",
      [montant, idMotifDepense, session.idUser],
    );

    return NextResponse.json(
      {
        id: result.insertId,
        montantDepense: montant,
        idMotifDepense,
        idUser: session.idUser,
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Erreur MySQL ajout dépense:", error);

    return NextResponse.json(
      {
        message: "Erreur lors de l'ajout de la dépense",
        ...(process.env.NODE_ENV !== "production" && { error: error.message }),
      },
      { status: 500 },
    );
  }
}