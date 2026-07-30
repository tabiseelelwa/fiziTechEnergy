/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { getConnection } from '@/app/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nom, prix, duree } = body;

    // 1. Validation de base
    if (!nom || prix === undefined || !duree) {
      return NextResponse.json(
        { message: 'Tous les champs obligatoires doivent être remplis.' },
        { status: 400 }
      );
    }

    const parsedPrix = parseInt(prix, 10);
    // On convertit la durée (ex: si reçue en heures, ajustez avec * 60 si nécessaire)
    const parsedDureeMinutes = parseInt(duree, 10); 

    if (isNaN(parsedPrix) || isNaN(parsedDureeMinutes)) {
      return NextResponse.json(
        { message: 'Le prix et la durée doivent être des nombres valides.' },
        { status: 400 }
      );
    }

    // 2. Insertion en base de données (codeTypeForfait est auto-incrémenté)
    const [result]: any = await getConnection().execute(
      `INSERT INTO typeforfait (designation, dureeMinutes, prixFC) 
       VALUES (?, ?, ?)`,
      [nom, parsedDureeMinutes, parsedPrix]
    );

    // 3. Réponse avec l'ID généré par MySQL (insertId)
    const createdTarif = {
      codeTypeForfait: result.insertId,
      designation: nom,
      dureeMinutes: parsedDureeMinutes,
      prixFC: parsedPrix,
    };

    return NextResponse.json(createdTarif, { status: 201 });
  } catch (err: unknown) {
    console.error('Erreur SQL POST /api/tarifs:', err);
    return NextResponse.json(
      { message: 'Erreur lors de la création du tarif.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const [rows]: any = await getConnection().execute(
      `SELECT codeTypeForfait, designation, dureeMinutes, prixFC FROM typeforfait ORDER BY codeTypeForfait DESC`
    );
    return NextResponse.json(rows, { status: 200 });
  } catch (err: unknown) {
    console.error('Erreur GET /api/tarifs:', err);
    return NextResponse.json(
      { message: 'Erreur lors de la récupération des tarifs.' },
      { status: 500 }
    );
  }
}
