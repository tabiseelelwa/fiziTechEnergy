import { NextResponse } from "next/server";
import { getConnection } from "@/app/lib/db";
import { RowDataPacket } from "mysql2/promise";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nom, prenom, telephone, email, idRole, idSite } = body;

    if (
      nom === "" ||
      prenom === "" ||
      telephone === "" ||
      email === "" ||
      idRole === "" ||
      idSite === ""
    ) {
      return NextResponse.json({
        message: "Tous les champs obligatoires doivent être remplis",
        status: 400,
      });
    }

    const pass = "12345";

    const [result] = await getConnection().execute(
      `INSERT INTO user(nom, prenom, telephone, email, pass, idRole, idSite) VALUES(?, ?, ?, ?, ?, ?, ?)`,
      [nom, prenom, telephone, email, pass, idRole, idSite],
    );

    return NextResponse.json({ result, status: 201 });
  } catch (error) {
    console.error("Erreur SQL POST /api/tarifs:", error);
    return NextResponse.json(
      { message: "Erreur lors de la création du tarif." },
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
        r.designation, 
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
