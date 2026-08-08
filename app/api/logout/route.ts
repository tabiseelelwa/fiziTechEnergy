import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json(
    { message: "Déconnexion réussie" },
    { status: 200 },
  );

  // Suppression du cookie HTTP-Only
  response.cookies.set("Empire-Lab_token", "", {
    httpOnly: true,
    expires: new Date(0), // Expire immédiatement
    path: "/",
  });

  return response;
}
