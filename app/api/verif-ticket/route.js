import { getConnection } from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { telephone } = await request.json();

        if (!telephone) {
            return NextResponse.json(
                { message: "Le numéro de téléphone est obligatoire." },
                { status: 400 }
            );
        }

        const pool = getConnection();

        // Requête SQL pour récupérer le ticket actif correspondant au numéro de téléphone
        const query = `
            SELECT t.codeTicket, t.dateExpiration, t.statut, tf.designation as forfait
            FROM ticket t
            JOIN Paiement p ON t.codeTicket = p.codeTicket
            JOIN client c ON p.idClient = c.idClient
            JOIN typeForfait tf ON p.codeTypeForfait = tf.codeTypeForfait
            WHERE c.Telephone = ? AND t.statut = 'Actif' AND t.dateExpiration > NOW()
            ORDER BY t.dateCreation DESC
            LIMIT 1
        `;

        const [rows] = await pool.execute(query, [telephone.trim()]);

        if (rows.length === 0) {
            return NextResponse.json(
                { message: "Aucun forfait actif trouvé pour ce numéro." },
                { status: 404 }
            );
        }

        // Renvoie les données du ticket trouvé
        return NextResponse.json({
            success: true,
            ticket: rows[0]
        }, { status: 200 });

    } catch (error) {
        console.error("Erreur API verif-ticket :", error);
        return NextResponse.json(
            { message: "Une erreur interne est survenue." },
            { status: 500 }
        );
    }
}