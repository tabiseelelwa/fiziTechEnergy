import { NextResponse } from "next/server";
import { getConnection } from "@/app/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { RowDataPacket } from "mysql2/promise";

const JWT_SECRET = process.env.JWT_SECRET || "cle_secrete_empire_lab";

interface UserRow extends RowDataPacket {
  idUser: number;
  nom: string;
  prenom: string;
  email: string;
  pass: string;
  idSite: number;
  idRole: number;
  designSite: string;
  designRole: string;
}

export async function POST(request: Request) {
  try {
    const { email, pass } = await request.json();

    if (!email || !pass) {
      return NextResponse.json(
        { message: "Veuillez remplir tous les champs." },
        { status: 400 },
      );
    }

    const [rows] = await getConnection().execute<UserRow[]>(
      `SELECT
        u.idUser,
        u.nom,
        u.prenom,
        u.Telephone as telephone,
        u.email,
        u.idSite,
        u.pass,
        u.idRole,
        s.designSite,
        r.designRole
      FROM user u
      LEFT JOIN site s ON u.idSite = s.idSite
      LEFT JOIN role r ON u.idRole = r.idRole
      WHERE u.email = ?`,
      [email],
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { message: "Identifiants incorrects." },
        { status: 401 },
      );
    }

    const user = rows[0];

    const isPasswordValid = await bcrypt.compare(pass, user.pass);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Identifiants incorrects." },
        { status: 401 },
      );
    }

    const payloadUser = {
      idUser: user.idUser,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      idSite: user.idSite,
      idRole: user.idRole,
      designSite: user.designSite,
      designRole: user.designRole,
    };

    const token = jwt.sign(payloadUser, JWT_SECRET, { expiresIn: "8h" });

    const response = NextResponse.json(
      {
        message: "Connexion réussie",
        user: payloadUser,
        token,
      },
      { status: 200 },
    );

    response.cookies.set("Empire-Lab_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    return response;
  } catch (error: unknown) {
    console.error("Erreur API Login:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Erreur inconnue";

    return NextResponse.json(
      {
        message: "Erreur interne du serveur",
        details: errorMessage,
      },
      { status: 500 },
    );
  }
}
