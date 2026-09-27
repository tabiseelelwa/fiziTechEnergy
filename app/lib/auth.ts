import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET: string =
  process.env.JWT_SECRET ??
  (() => {
    throw new Error(
      "JWT_SECRET n'est pas défini dans les variables d'environnement.",
    );
  })();

export interface SessionPayload {
  idUser: number;
  nom: string;
  prenom: string;
  email: string;
  idSite: number;
  idRole: number;
  designSite: string;
  designRole: string;
}

function isSessionPayload(payload: unknown): payload is SessionPayload {
  if (typeof payload !== "object" || payload === null) return false;
  const p = payload as Record<string, unknown>;
  return (
    typeof p.idUser === "number" &&
    typeof p.nom === "string" &&
    typeof p.prenom === "string" &&
    typeof p.email === "string" &&
    typeof p.idSite === "number" &&
    typeof p.idRole === "number" &&
    typeof p.designSite === "string" &&
    typeof p.designRole === "string"
  );
}

function verifySessionToken(token: string): SessionPayload | null {
  try {
    const decoded: string | JwtPayload = jwt.verify(token, JWT_SECRET);
    return isSessionPayload(decoded) ? decoded : null;
  } catch {
    return null;
  }
}

export async function getUserIdFromSession(): Promise<number | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("Empire-Lab_token")?.value;

  if (!token) return null;

  const session = verifySessionToken(token);
  return session?.idUser ?? null;
}

export async function getSessionUser(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("Empire-Lab_token")?.value;

  if (!token) return null;

  return verifySessionToken(token);
}
