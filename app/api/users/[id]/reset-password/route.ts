/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { getConnection } from "@/app/lib/db";
import bcrypt from "bcryptjs";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const defaultPassword = "12345";
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    const [result]: any = await getConnection().execute(
      "UPDATE user SET pass = ? WHERE idUser = ?",
      [hashedPassword ?? null, id ?? null],
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "Utilisateur non trouvé" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Mot de passe réinitialisé à 12345 avec succès" },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Erreur reset-password:", error);
    return NextResponse.json(
      {
        message: error.message || "Erreur serveur lors de la réinitialisation",
      },
      { status: 500 },
    );
  }
}
