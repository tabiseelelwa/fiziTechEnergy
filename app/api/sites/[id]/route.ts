import { NextResponse } from "next/server";
import { getConnection } from "@/app/lib/db";
import { ResultSetHeader } from "mysql2/promise";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const idSite = parseInt(id, 10);

    if (isNaN(idSite)) {
      return NextResponse.json({
        message: "Identifiant invalide",
        status: 400,
      });
    }

    const body = await request.json();

    const { designSite, localisation, equipement, statut, idVille } = body;

    if (
      designSite === "" ||
      localisation === "" ||
      equipement === "" ||
      statut === "" ||
      idVille === ""
    ) {
      return NextResponse.json({
        message: "Tous les champs obligatoires doivent être remplis",
        status: 400,
      });
    }

    const [result] = await getConnection().execute<ResultSetHeader>(
      `UPDATE site SET designSite = ?, localisation = ?, equipement = ?, statut = ?, idVille = ? WHERE idSite = ?`,
      [designSite, localisation, equipement, statut, idVille, idSite],
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({
        message: "Aucun utilisateur trouvé avec cet identifiant",
        status: 404,
      });
    }

    return NextResponse.json({
      message: "Modification effectuée avec succès",
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      message: "Erreur lors de la modification du site",
      status: 500,
    });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const idUser = parseInt(id, 10);

    await getConnection().execute("DELETE FROM site WHERE idSite = ?", [
      idUser,
    ]);

    return NextResponse.json({
      message: "Site supprimé avec succès",
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      message: "Erreur lors de la suppression du site",
      status: 500,
    });
  }
}
