import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  // Récupération du token stocké dans le cookie HTTP-Only
  const token = request.cookies.get("Empire-Lab_token")?.value;
  const pathname = request.nextUrl.pathname;

  // Routes protégées du dashboard
  const isProtectedPath =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/sites") ||
    pathname.startsWith("/tarifs") ||
    pathname.startsWith("/utilisateurs") ||
    pathname.startsWith("/profil");

  // Si l'utilisateur non connecté tente d'accéder à une route protégée -> Redirection /login
  if (isProtectedPath && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Si l'utilisateur est déjà connecté et tente d'aller sur /login -> Redirection /dashboard
  if (pathname === "/login" && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/sites/:path*",
    "/tarifs/:path*",
    "/utilisateurs/:path*",
    "/profil/:path*",
    "/login",
  ],
};
