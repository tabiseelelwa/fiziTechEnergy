import { NextResponse } from "next/server";
import { getConnection } from "@/app/lib/db";
import { ResultSetHeader } from "mysql2/promise";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const idUser = parseInt(id, 10);

    if (isNaN(idUser)) {
      return NextResponse.json({
        message: "Identifiant de l'utilisateur invalide",
        status: 400,
      });
    }

    const body = await request.json();

    const { nom, prenom, telephone, email, idRole, idSite } = body;

    if (!nom || !prenom || !telephone || !email || !idRole || !idSite) {
      return NextResponse.json({
        message: "Tous les chmps obligatoires doivent être remplis",
        status: 400,
      });
    }
    const [user] = await getConnection().execute<ResultSetHeader>(
      "UPDATE user SET nom = ?, prenom = ?, telephone = ?, email = ?, idRole = ?, idSite = ? WHERE idUser = ?",
      [nom, prenom, telephone, email, idRole, idSite, idUser],
    );

    if (user.affectedRows === 0) {
      return NextResponse.json({
        message: "Aucun utilisateur trouvé avec cet identifiant",
        statut: 404,
      });
    }

    return NextResponse.json({
      message: "Utilisateur mis à jour avec succès",
      status: 200,
    });
  } catch (err) {
    console.error("Erreur SQL PUT", err);
    return NextResponse.json(
      { message: "Erreur lors de la modification de l'utilisateur." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const idUser = Number(id);

    await getConnection().execute("DELETE FROM user WHERE idUser = ?", [
      idUser,
    ]);
    return NextResponse.json(
      { message: "Tarif supprimé avec succès." },
      { status: 200 },
    );
  } catch (err) {
    console.error("Erreur SQL DELETE:", err);
    return NextResponse.json(
      { message: "Impossible de supprimer l'utilisateur." },
      { status: 500 },
    );
  }
}
