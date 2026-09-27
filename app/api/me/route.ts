// app/api/me/route.ts
import { NextResponse } from "next/server";
import { getSessionUser } from "@/app/lib/auth";

export async function GET() {
  const user = await getSessionUser();

  if (!user) {
    const response = NextResponse.json(
      { message: "Non authentifié." },
      { status: 401 },
    );

    response.cookies.set("Empire-Lab_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0, // supprime immédiatement le cookie
    });

    return response;
  }

  return NextResponse.json({ user });
}
