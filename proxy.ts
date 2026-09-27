import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET;

async function isTokenValid(token: string | undefined): Promise<boolean> {
  if (!token || !JWT_SECRET) return false;

  try {
    await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    return true;
  } catch {
    // Signature invalide OU expiré (jose lève dans les deux cas)
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("Empire-Lab_token")?.value;
  const { pathname } = request.nextUrl;

  const protectedPaths = [
    "/ventes",
    "/sites",
    "/tarifs",
    "/utilisateurs",
    "/profil",
  ];

  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );

  const tokenValid = await isTokenValid(token);

  // Redirection vers /login si non connecté (ou token expiré/invalide)
  // sur une route protégée.
  if (isProtectedPath && !tokenValid) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Redirection vers l'accueil seulement si le token est réellement
  // valide — un cookie expiré ne doit jamais empêcher l'accès à /login,
  // sous peine de boucle avec la détection d'expiration côté client.
  if (pathname === "/login" && tokenValid) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};