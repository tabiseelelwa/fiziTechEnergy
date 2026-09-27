/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import RoleGuard from "@/app/components/RoleGuard";
import {
  BsCalendarDay,
  BsWifi,
  BsPeople,
} from "react-icons/bs";

import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";

interface SiteRecette {
  tshikapa: number;
  katende: number;
  durba: number;
  misisi: number;
}

interface EvolutionPresencePoint {
  heure: string;
  tshikapa: number;
  katende: number;
  durba: number;
  misisi: number;
}

interface SiteClientsConnectes {
  name: string;
  value: number;
  color: string;
}

interface DashboardAudienceApiResponse {
  recettesJourParSite: SiteRecette;
  evolutionPresence: EvolutionPresencePoint[];
  clientsConnectesParSite: SiteClientsConnectes[];
}

// Map avec les clés en minuscules pour éviter tout conflit de casse
const SITE_COLORS: Record<string, string> = {
  tshikapa: "#10b981", // Emerald
  katende: "#3b82f6",  // Blue
  durba: "#8b5cf6",    // Purple
  misisi: "#f59e0b",   // Amber
};

const fetchDashboardData = async (): Promise<DashboardAudienceApiResponse> => {
  const { data } = await axios.get("/api/audience");

  return {
    recettesJourParSite: {
      tshikapa: Number(data.recettesJourParSite?.tshikapa) || 0,
      katende: Number(data.recettesJourParSite?.katende) || 0,
      durba: Number(data.recettesJourParSite?.durba) || 0,
      misisi: Number(data.recettesJourParSite?.misisi) || 0,
    },
    evolutionPresence: (data.evolutionPresence || []).map(
      (item: { heure: string; tshikapa: number; katende: number; durba: number; misisi: number }) => ({
        heure: item.heure || "",
        tshikapa: Number(item.tshikapa) || 0,
        katende: Number(item.katende) || 0,
        durba: Number(item.durba) || 0,
        misisi: Number(item.misisi) || 0,
      })
    ),
    clientsConnectesParSite: (data.clientsConnectesParSite || []).map(
      (item: { site: string; connectes: number }) => {
        const rawSite = item.site ? item.site.trim() : "Inconnu";
        const key = rawSite.toLowerCase();
        // Capitalise la première lettre pour l'affichage (ex: "tshikapa" -> "Tshikapa")
        const formattedName = rawSite.charAt(0).toUpperCase() + rawSite.slice(1).toLowerCase();

        return {
          name: formattedName,
          value: Number(item.connectes) || 0,
          color: SITE_COLORS[key] || "#06b6d4",
        };
      }
    ),
  };
};

export default function AudienceDashboard() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboard-audience-realtime"],
    queryFn: fetchDashboardData,
    refetchInterval: 30000,
    staleTime: 5000,
  });

  return (
    <RoleGuard allowedRoles={["Admin", "Gerant"]}>
      <div className="w-full bg-slate-50 px-2 text-slate-800">
        <div className="w-full mb-6">
          <h1 className="text-2xl font-bold text-slate-900">
            Tableau de bord audience
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Aperçu en temps réel de la présence des clients et recettes journalières sur les 4 sites
          </p>
        </div>

        {isError && (
          <div className="p-4 mb-6 text-sm text-red-600 bg-red-50 rounded-xl border border-red-200">
            Impossible de charger les données d'audience du tableau de bord.
          </div>
        )}

        {/* 4 CARTES KPI : RECETTES JOURNALIÈRES PAR SITE */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {/* TSHIKAPA */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                TSHIKAPA
              </p>
              <h3 className="text-2xl font-extrabold text-slate-900">
                {isLoading
                  ? "..."
                  : `${(data?.recettesJourParSite.tshikapa || 0).toLocaleString()} FC`}
              </h3>
              <span className="inline-block mt-2 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                KASAÏ • AUJOURD'HUI
              </span>
            </div>
            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl">
              <BsCalendarDay size={26} />
            </div>
          </div>

          {/* KATENDE */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                KATENDE
              </p>
              <h3 className="text-2xl font-extrabold text-slate-900">
                {isLoading
                  ? "..."
                  : `${(data?.recettesJourParSite.katende || 0).toLocaleString()} FC`}
              </h3>
              <span className="inline-block mt-2 text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                KASAÏ-ORIENTAL • AUJOURD'HUI
              </span>
            </div>
            <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
              <BsCalendarDay size={26} />
            </div>
          </div>

          {/* DURBA */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                DURBA
              </p>
              <h3 className="text-2xl font-extrabold text-slate-900">
                {isLoading
                  ? "..."
                  : `${(data?.recettesJourParSite.durba || 0).toLocaleString()} FC`}
              </h3>
              <span className="inline-block mt-2 text-xs font-medium text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">
                HAUT-UELE • AUJOURD'HUI
              </span>
            </div>
            <div className="p-4 bg-purple-50 text-purple-600 rounded-2xl">
              <BsCalendarDay size={26} />
            </div>
          </div>

          {/* MISISI */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                MISISI
              </p>
              <h3 className="text-2xl font-extrabold text-slate-900">
                {isLoading
                  ? "..."
                  : `${(data?.recettesJourParSite.misisi || 0).toLocaleString()} FC`}
              </h3>
              <span className="inline-block mt-2 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                SUD-KIVU • AUJOURD'HUI
              </span>
            </div>
            <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl">
              <BsCalendarDay size={26} />
            </div>
          </div>
        </div>

        {/* GRAPHIQUES */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LINECHART : ÉVOLUTION DE LA PRÉSENCE DES CLIENTS SUR CHAQUE SITE */}
          <div className="lg:col-span-2 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Évolution des présences en temps réel
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Les utilisateurs connectés par site
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                Direct
              </div>
            </div>
            <div className="h-64 w-full">
              {isLoading ? (
                <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                  Chargement du graphique des présences...
                </div>
              ) : !data?.evolutionPresence.length ? (
                <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                  Aucune donnée de présence disponible.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.evolutionPresence}>
                    <XAxis
                      dataKey="heure"
                      stroke="#94a3b8"
                      fontSize={12}
                      tickLine={false}
                    />
                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                    <Tooltip
                      formatter={(value: any, name: any) => [
                        `${Number(value)} client(s)`,
                        name.charAt(0).toUpperCase() + name.slice(1),
                      ]}
                      contentStyle={{
                        backgroundColor: "#fff",
                        borderRadius: "12px",
                        borderColor: "#e2e8f0",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                    <Line
                      type="monotone"
                      dataKey="tshikapa"
                      name="Tshikapa"
                      stroke={SITE_COLORS.tshikapa}
                      strokeWidth={2.5}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="katende"
                      name="Katende"
                      stroke={SITE_COLORS.katende}
                      strokeWidth={2.5}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="durba"
                      name="Durba"
                      stroke={SITE_COLORS.durba}
                      strokeWidth={2.5}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="misisi"
                      name="Misisi"
                      stroke={SITE_COLORS.misisi}
                      strokeWidth={2.5}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* PIECHART : CLIENTS CONNECTÉS ACTUELLEMENT SUR CHAQUE SITE */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-base font-bold text-slate-900">
                  Clients connectés
                </h2>
                <BsPeople className="text-slate-400 size-4" />
              </div>
              <p className="text-xs text-slate-400">
                Répartition des sessions actives par site
              </p>
            </div>

            <div className="h-48 w-full relative">
              {isLoading ? (
                <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                  Chargement...
                </div>
              ) : !data?.clientsConnectesParSite.length ? (
                <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                  Aucun client connecté
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.clientsConnectesParSite}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={80}
                      paddingAngle={4}
                      cornerRadius={4}
                      dataKey="value"
                    >
                      {data.clientsConnectesParSite.map((entry) => (
                        <Cell key={`cell-${entry.name}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(val: any) => [`${val} connecté(s)`, "Clients"]} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="space-y-2 mt-4 max-h-36 overflow-y-auto">
              {data?.clientsConnectesParSite.map((site) => (
                <div
                  key={site.name}
                  className="flex justify-between items-center text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: site.color }}
                    />
                    <span className="text-slate-600 font-medium truncate max-w-[120px]">
                      {site.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 font-bold text-slate-800">
                    <BsWifi className="text-slate-400 size-3" />
                    <span>{site.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}