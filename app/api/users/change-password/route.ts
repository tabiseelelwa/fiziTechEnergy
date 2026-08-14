import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getConnection } from "@/app/lib/db";
import { RowDataPacket } from "mysql2";
import { getUserIdFromSession } from "../../login/route";

export async function POST(request: Request) {
  try {
    const idUser = await getUserIdFromSession(request);

    if (!idUser) {
      return NextResponse.json(
        { message: "L'identifiant de l'utilisateur est requis." },
        { status: 400 },
      );
    }

    const { currentPassword, newPassword, confirmPassword } =
      await request.json();

    // Validation basique
    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { message: "Tous les champs sont obligatoires." },
        { status: 400 },
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        {
          message:
            "Le nouveau mot de passe doit contenir au moins 6 caractères.",
        },
        { status: 400 },
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { message: "Les nouveaux mots de passe ne correspondent pas." },
        { status: 400 },
      );
    }

    // Récupérer le mot de passe actuel en base de données
    const [rows] = await getConnection().execute<RowDataPacket[]>(
      `SELECT pass FROM user WHERE idUser = ? LIMIT 1`,
      [idUser],
    );

    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { message: "Utilisateur non trouvé" },
        { status: 404 },
      );
    }

    const userHash = rows[0].pass;

    // Comparaison avec le mot de passe actuel
    const isMatch = await bcrypt.compare(currentPassword, userHash);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Le mot de passe actuel est incorrect." },
        { status: 400 },
      );
    }

    // Hachage du nouveau mot de passe
    const salt = await bcrypt.genSalt(10);
    const newHashedPassword = await bcrypt.hash(newPassword, salt);

    // Enregistrement
    await getConnection().execute(`UPDATE user SET pass = ? WHERE idUser = ?`, [
      newHashedPassword,
      idUser,
    ]);

    return NextResponse.json(
      { message: "Mot de passe mis à jour avec succès." },
      { status: 200 },
    );
  } catch (error) {
    console.error("Erreur POST /api/user/change-password:", error);
    return NextResponse.json(
      { message: "Erreur lors du changement de mot de passe." },
      { status: 500 },
    );
  }
}
