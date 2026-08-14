import { getConnection } from "@/app/lib/db";
import { RowDataPacket } from "mysql2";
import { NextResponse } from "next/server";
import { getUserIdFromSession } from "../../login/route";

export async function GET(request: Request) {
  try {
    const idUser = await getUserIdFromSession(request);

    if (!idUser) {
      return NextResponse.json(
        { message: "L'identifiant de l'utilisateur est requis." },
        { status: 400 },
      );
    }

    // Exemple de requête SQL native (à adapter à votre ORM ou DB helper)
    const [rows] = await getConnection().execute<RowDataPacket[]>(
      `SELECT  
        u.nom, 
        u.prenom, 
        u.email, 
        u.telephone, 
        u.idRole, 
        u.idSite, 
        s.designSite, 
        r.designRole
       FROM user u
       LEFT JOIN site s ON u.idSite = s.idSite
       LEFT JOIN role r ON u.idRole = r.idRole
       WHERE idUser = ? LIMIT 1`,
      [idUser],
    );

    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { message: "Utilisateur non trouvé" },
        { status: 404 },
      );
    }

    return NextResponse.json({ user: rows[0] }, { status: 200 });
  } catch (error) {
    console.error("Erreur GET", error);
    return NextResponse.json(
      { message: "Erreur serveur lors de la récupération du profil." },
      { status: 500 },
    );
  }
}

// PUT: Mettre à jour les informations du profil
export async function PUT(request: Request) {
  try {
    const idUser = getUserIdFromSession(request);

    if (!idUser) {
      return NextResponse.json(
        { message: "L'identifiant de l'utilisateur est requis." },
        { status: 400 },
      );
    }

    const body = await request.json();
    const { nom, prenom, email, telephone } = body;

    if (!nom || !prenom || !email) {
      return NextResponse.json(
        { message: "Le nom, le prénom et l'adresse email sont obligatoires." },
        { status: 400 },
      );
    }

    // Vérifier si l'email est déjà utilisé par un autre utilisateur
    const [existing] = await getConnection().execute<RowDataPacket[]>(
      `SELECT idUser FROM user WHERE email = ? AND idUser != ? LIMIT 1`,
      [email, idUser],
    );

    if (existing && existing.length > 0) {
      return NextResponse.json(
        { message: "Cette adresse email est déjà utilisée." },
        { status: 400 },
      );
    }

    // Mise à jour en base de données
    await getConnection().execute(
      `UPDATE user SET nom = ?, prenom = ?, email = ?, Telephone = ? WHERE idUser = ?`,
      [nom, prenom, email, telephone, idUser],
    );

    return NextResponse.json(
      { message: "Profil mis à jour avec succès." },
      { status: 200 },
    );
  } catch (error) {
    console.error("Erreur PUT :", error);
    return NextResponse.json(
      { message: "Erreur serveur lors de la mise à jour du profil." },
      { status: 500 },
    );
  }
}
