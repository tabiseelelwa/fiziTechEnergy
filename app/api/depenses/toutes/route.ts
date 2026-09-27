import { NextRequest, NextResponse } from "next/server";
import { getConnection } from "@/app/lib/db";
import { RowDataPacket } from "mysql2/promise";

export interface Depense {
  idDepense: number;
  montantDepense: number | string;
  dateDepense: string;
  descriptMotif: string;
  nom: string;
}

export interface DepenseRow extends RowDataPacket, Depense {}
export interface CountRow extends RowDataPacket {
  total: number;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);

    // Extraction et validation des paramètres
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, parseInt(searchParams.get("limit") || "8", 10));
    const search = searchParams.get("search") || "";
    const startDate = searchParams.get("startDate") || "";
    const endDate = searchParams.get("endDate") || "";

    const offset = (page - 1) * limit;

    // Construction dynamique de la clause WHERE
    const conditions: string[] = [];
    const queryParams: (string | number)[] = [];

    if (search) {
      conditions.push("m.descriptMotif LIKE ?");
      queryParams.push(`%${search}%`);
    }

    if (startDate) {
      conditions.push("DATE(d.dateDepense) >= DATE(?)");
      queryParams.push(startDate);
    }

    if (endDate) {
      conditions.push("DATE(d.dateDepense) <= DATE(?)");
      queryParams.push(endDate);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const connection = getConnection();

    // 1. Récupération du nombre total d'éléments correspondant aux filtres
    const countQuery = `
      SELECT COUNT(*) AS total 
      FROM depense d
      LEFT JOIN motifdepense m ON d.idMotifDepense = m.idMotifDepense
      ${whereClause}
    `;
    const [countRows] = await connection.query<CountRow[]>(
      countQuery,
      queryParams
    );
    const total = countRows[0]?.total || 0;
    const totalPages = Math.ceil(total / limit) || 1;

    // 2. Récupération des enregistrements paginés
    const dataQuery = `
      SELECT d.idDepense, d.montantDepense, d.dateDepense, u.nom, m.descriptMotif 
      FROM depense d
      LEFT JOIN user u ON d.idUser = u.idUser
      LEFT JOIN motifdepense m ON d.idMotifDepense = m.idMotifDepense
      ${whereClause}
      ORDER BY d.dateDepense DESC
      LIMIT ? OFFSET ?
    `;

    // Passer limit et offset sous forme de nombres entiers pour MySQL
    const [rows] = await connection.query<DepenseRow[]>(dataQuery, [
      ...queryParams,
      limit,
      offset,
    ]);

    return NextResponse.json({
      data: rows,
      total,
      page,
      limit,
      totalPages,
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Erreur inconnue";

    return NextResponse.json(
      {
        message: "Erreur lors de la récupération des dépenses",
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}