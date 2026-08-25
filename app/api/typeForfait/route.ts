import { NextResponse } from "next/server";
import { getConnection } from "@/app/lib/db";
import { RowDataPacket } from "mysql2/promise";

export async function GET() {
  try {
    const pool = getConnection();
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT tf.codeTypeForfait, tf.designation, tf.dureeMinutes, pr.montant as prix
       FROM typeforfait tf
       LEFT JOIN prix pr ON tf.idPrix = pr.idPrix
       ORDER BY codeTypeForfait DESC
      `,
    );
    return NextResponse.json({ typesForfait: rows }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Erreur serveur", error },
      { status: 500 },
    );
  }
}
