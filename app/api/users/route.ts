import { NextResponse } from "next/server";
import { getConnection } from "@/app/lib/db";
import bcrypt from "bcryptjs";
import { RowDataPacket } from "mysql2";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nom, prenom, telephone, email, idRole, idSite } = body;

    // Validation des champs requis
    if (
      !nom ||
      !prenom ||
      !telephone ||
      !email ||
      idRole === undefined ||
      idRole === null ||
      idSite === undefined ||
      idSite === null
    ) {
      return NextResponse.json(
        { message: "Tous les champs obligatoires doivent être remplis." },
        { status: 400 },
      );
    }

    const rawPassword = "12345";

    // Hachage du mot de passe avec un salt factor de 10
    const hashedPass = await bcrypt.hash(rawPassword, 10);

    // Insertion en base de données avec le mot de passe haché
    const [result] = await getConnection().execute(
      `INSERT INTO user(nom, prenom, telephone, email, pass, idRole, idSite) VALUES(?, ?, ?, ?, ?, ?, ?)`,
      [nom, prenom, telephone, email, hashedPass, idRole, idSite],
    );

    return NextResponse.json(
      { message: "Utilisateur créé avec succès", result },
      { status: 201 },
    );
  } catch (error) {
    console.error("Erreur SQL POST /api/users:", error);
    return NextResponse.json(
      { message: "Erreur lors de la création de l'utilisateur." },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const [users] = await getConnection().execute<RowDataPacket[]>(
      `SELECT 
        u.idUser, 
        u.nom, 
        u.prenom, 
        u.telephone, 
        u.email, 
        u.idRole, 
        u.idSite, 
        r.designRole, 
        s.designSite 
       FROM user u 
       LEFT JOIN site s ON u.idSite = s.idSite 
       LEFT JOIN role r ON u.idRole = r.idRole 
       ORDER BY u.idUser ASC`,
    );

    return NextResponse.json({ users }, { status: 200 });
  } catch (err: unknown) {
    console.error("Erreur GET /api/users:", err);
    return NextResponse.json(
      { message: "Erreur lors de la récupération des utilisateurs." },
      { status: 500 },
    );
  }
}
