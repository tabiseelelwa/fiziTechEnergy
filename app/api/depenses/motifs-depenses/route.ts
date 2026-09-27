import { NextResponse } from "next/server";
import { getConnection } from "@/app/lib/db";
import { RowDataPacket } from "mysql2/promise";

export async function GET() {
  try {
    const connection = getConnection();
    const [rows] = await connection.query<RowDataPacket[]>(
      "SELECT idMotifDepense, descriptMotif FROM motifdepense ORDER BY idMotifDepense ASC"
    );

    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Erreur lors de la récupération des motifs", error },
      { status: 500 }
    );
  }
}