import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
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

  // Redirection vers /login si non connecté sur une route protégée
  if (isProtectedPath && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname); // Optionnel : enregistre la page voulue
    return NextResponse.redirect(loginUrl);
  }

  // Redirection vers l'accueil si déjà connecté et tente d'accéder à /login
  if (pathname === "/login" && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Intercepte toutes les routes sauf les fichiers statiques (_next, images, favicon, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};