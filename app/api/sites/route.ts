import { NextResponse } from "next/server";
import { getConnection } from "@/app/lib/db";
import { RowDataPacket } from "mysql2/promise";

export async function POST(request: Request) {
  try {
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

    const [site] = await getConnection().execute(
      " INSERT INTO site(designSite, localisation, equipement, statut, idVille) VALUES(?, ?, ?, ?, ?)",
      [designSite, localisation, equipement, statut, idVille],
    );

    return NextResponse.json({ site }, { status: 201 });
  } catch (error) {
    console.error("Erreur SQL POST", error);
    return NextResponse.json(
      { message: "Erreur lors de la création du site." },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const [sites] = await getConnection().execute<RowDataPacket[]>(
      "SELECT s.designSite, s.localisation, s.equipement, s.statut, s.idSite, v.designVille, v.idVille FROM site s LEFT JOIN ville v ON s.idVille = v.idVille",
    );
    return NextResponse.json({ sites }, { status: 200 });
  } catch (error: unknown) {
    console.error("Erreur GET /api:", error);
    return NextResponse.json(
      { message: "Erreur lors de la récupération des sites." },
      { status: 500 },
    );
  }
}
