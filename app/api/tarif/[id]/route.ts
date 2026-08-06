import { NextResponse } from "next/server";
import { getConnection } from "@/app/lib/db";
import { ResultSetHeader } from "mysql2/promise";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const codeTypeForfait = parseInt(id, 10);

    if (isNaN(codeTypeForfait)) {
      return NextResponse.json({ message: "ID invalide." }, { status: 400 });
    }

    await getConnection().execute(
      `DELETE FROM typeforfait WHERE codeTypeForfait = ?`,
      [codeTypeForfait],
    );

    return NextResponse.json(
      { message: "Tarif supprimé avec succès." },
      { status: 200 },
    );
  } catch (err: unknown) {
    console.error("Erreur SQL DELETE /api/tarif:", err);
    return NextResponse.json(
      { message: "Impossible de supprimer le tarif." },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const codeTypeForfait = parseInt(id, 10);

    if (isNaN(codeTypeForfait)) {
      return NextResponse.json(
        { message: "Identifiant du tarif invalide." },
        { status: 400 },
      );
    }

    const body = await request.json();
    const { designation, dureeMinutes, prixFC } = body;

    if (!designation || !dureeMinutes || !prixFC) {
      return NextResponse.json(
        { message: "Veuillez remplir tous les champs obligatoires." },
        { status: 400 },
      );
    }

    const [result] = await getConnection().execute<ResultSetHeader>(
      `UPDATE typeforfait SET designation = ?, dureeMinutes = ?, prixFC = ? WHERE codeTypeForfait = ?`,
      [designation, dureeMinutes, prixFC, codeTypeForfait],
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "Aucun tarif trouvé avec cet identifiant." },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Tarif mis à jour avec succès." },
      { status: 200 },
    );
  } catch (err: unknown) {
    console.error("Erreur SQL PUT :", err);
    return NextResponse.json(
      { message: "Erreur lors de la modification du tarif." },
      { status: 500 },
    );
  }
}
