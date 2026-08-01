import { NextResponse } from "next/server";
import { getConnection } from "@/app/lib/db";
import { RowDataPacket } from "mysql2/promise";

export async function GET(){
    try {
        const [roles]= await getConnection().execute<RowDataPacket[]>(
            'SELECT * FROM role'
        )
        return NextResponse.json({roles, status: 200})
    } catch (error: unknown) {
        console.error('Erreur GET /api/role:', error);
        return NextResponse.json(
      { message: 'Erreur lors de la récupération des roles.' },
      { status: 500 }
    );
    }
}