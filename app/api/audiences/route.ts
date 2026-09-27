import { RouterOSAPI } from "node-routeros"; // ou votre librairie habituelle
import { NextResponse } from "next/server";
// import { getConnection } from "@/app/lib/db";


// Configuration des accès MikroTik par site
const ROUTEURS = [
  { site: "Durba", ip: "192.168.10.1", user: "admin", pass: "password" },
  { site: "Tshikapa", ip: "192.168.20.1", user: "admin", pass: "password" },
  { site: "Katende", ip: "192.168.30.1", user: "admin", pass: "password" },
  { site: "Misisi", ip: "192.168.40.1", user: "admin", pass: "password" },
];

async function getConnectedCount(routerConfig: typeof ROUTEURS[0]) {
  try {
    const client = new RouterOSAPI({
      host: routerConfig.ip,
      user: routerConfig.user,
      password: routerConfig.pass,
      keepalive: false,
    });

    await client.connect();
    // Récupère uniquement les utilisateurs hotspot actifs
    const activeUsers = await client.write("/ip/hotspot/active/print");
    client.close();

    return activeUsers.length;
  } catch (err) {
    console.error(`Erreur connexion MikroTik ${routerConfig.site}:`, err);
    return 0; // Hors ligne ou erreur réseau
  }
}

export async function GET() {
  try {
    // Interrogation simultanée des routeurs MikroTik
    const connectesPromesses = ROUTEURS.map(async (r) => ({
      site: r.site,
      connectes: await getConnectedCount(r),
    }));

    const clientsConnectesParSite = await Promise.all(connectesPromesses);

    return NextResponse.json({
      clientsConnectesParSite,
    });
  } catch (error) {
    return NextResponse.json({ error: "Erreur API"}, { status: 500 });
  }
}