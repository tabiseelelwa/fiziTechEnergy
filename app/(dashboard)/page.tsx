/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
"use client";

import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import RoleGuard from "@/app/components/RoleGuard";
import { useRouter } from "next/navigation";
import {
  BsCalendarDay,
  BsCalendarWeek,
  BsCalendarMonth,
  BsCalendarCheck,
} from "react-icons/bs";

import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  CartesianGrid,
  Bar,
} from "recharts";

interface StatsData {
  ventesJour: number;
  ventesSemaine: number;
  ventesMois: number;
  ventesAnnee: number;
}

interface VenteJourSeptDerniers {
  jour: string; // Ex: "10/09"
  ventes: number;
}

interface ForfaitChart {
  name: string;
  value: number;
  color: string;
}

interface DashboardApiResponse {
  stats: StatsData;
  evolutionSeptJours: VenteJourSeptDerniers[];
  repartitionForfaits: ForfaitChart[];
}

const COLOR_PALETTE = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
];

const fetchDashboardData = async (): Promise<DashboardApiResponse> => {
  const { data } = await axios.get("/api/dashboard");

  return {
    stats: {
      ventesJour: Number(data.stats?.ventesJour) || 0,
      ventesSemaine: Number(data.stats?.ventesSemaine) || 0,
      ventesMois: Number(data.stats?.ventesMois) || 0,
      ventesAnnee: Number(data.stats?.ventesAnnee) || 0,
    },
    evolutionSeptJours: (data.evolutionSeptJours || []).map(
      (item: { jour: string; ventes: number }) => ({
        jour: item.jour || "",
        ventes: Number(item.ventes) || 0,
      })
    ),
    repartitionForfaits: (data.repartitionForfaits || []).map(
      (item: { designation: string; total: number }, idx: number) => ({
        name: item.designation || "Inconnu",
        value: Number(item.total) || 0,
        color: COLOR_PALETTE[idx % COLOR_PALETTE.length],
      })
    ),
  };
};

export default function VentesDashboard() {
  const router = useRouter();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboard-ventes-kpi"],
    queryFn: fetchDashboardData,
    refetchInterval: 30000,
    staleTime: 5000,
  });

  const redirListVentes = () => {
    router.push("/ventes-admin");
  };

  return (
    <RoleGuard allowedRoles={["Admin", "Gerant"]}>
      <div className="w-full flex flex-col gap-4 bg-slate-50 px-2 text-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Tableau de bord des ventes
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Aperçu des performances financières et tendance des 7 derniers jours
          </p>
        </div>

        {isError && (
          <div className="p-4 mb-6 text-sm text-red-600 bg-red-50 rounded-xl border border-red-200">
            Impossible de charger les données du tableau de bord.
          </div>
        )}

        {/* 4 CARTES KPI */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
          {/* Aujourd'hui */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Aujourd'hui
              </p>
              <h3 className="text-2xl font-extrabold text-slate-900">
                {isLoading
                  ? "..."
                  : `${(data?.stats.ventesJour || 0).toLocaleString()} FC`}
              </h3>
              <span className="inline-block mt-2 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                Ventes du jour
              </span>
            </div>
            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl">
              <BsCalendarDay size={26} />
            </div>
          </div>

          {/* Cette Semaine */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Cette Semaine
              </p>
              <h3 className="text-2xl font-extrabold text-slate-900">
                {isLoading
                  ? "..."
                  : `${(data?.stats.ventesSemaine || 0).toLocaleString()} FC`}
              </h3>
              <span className="inline-block mt-2 text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                Semaine en cours
              </span>
            </div>
            <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
              <BsCalendarWeek size={26} />
            </div>
          </div>

          {/* Ce Mois-ci */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Ce Mois-ci
              </p>
              <h3 className="text-2xl font-extrabold text-slate-900">
                {isLoading
                  ? "..."
                  : `${(data?.stats.ventesMois || 0).toLocaleString()} FC`}
              </h3>
              <span className="inline-block mt-2 text-xs font-medium text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">
                Mois en cours
              </span>
            </div>
            <div className="p-4 bg-purple-50 text-purple-600 rounded-2xl">
              <BsCalendarMonth size={26} />
            </div>
          </div>

          {/* Cette Année */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Cette Année
              </p>
              <h3 className="text-2xl font-extrabold text-slate-900">
                {isLoading
                  ? "..."
                  : `${(data?.stats.ventesAnnee || 0).toLocaleString()} FC`}
              </h3>
              <span className="inline-block mt-2 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                Année en cours
              </span>
            </div>
            <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl">
              <BsCalendarCheck size={26} />
            </div>
          </div>
        </div>

        {/* GRAPHIQUES */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* GRAPHIQUE 7 DERNIERS JOURS */}
          <div className="lg:col-span-2 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Aperçu des ventes
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Performance sur les 7 derniers jours
                </p>
              </div>
            </div>
            <div className="h-64 w-full">
              {isLoading ? (
                <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                  Chargement du graphique...
                </div>
              ) : !data?.evolutionSeptJours.length ? (
                <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                  Aucune donnée pour les 7 derniers jours.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.evolutionSeptJours}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                      dataKey="jour"
                      stroke="#94a3b8"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#94a3b8"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      formatter={(value: any) => [`${Number(value).toLocaleString()} FC`, "Ventes"]}
                      contentStyle={{
                        backgroundColor: "#fff",
                        borderRadius: "12px",
                        borderColor: "#e2e8f0",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Bar
                      dataKey="ventes"
                      fill="#3b82f6"
                      radius={[6, 6, 0, 0]}
                      barSize={5}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* RÉPARTITION DES FORFAITS */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <h2 className="text-base font-bold text-slate-900 mb-2">
              Répartition des Forfaits
            </h2>
            <div className="h-48 w-full">
              {isLoading ? (
                <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                  Chargement...
                </div>
              ) : !data?.repartitionForfaits.length ? (
                <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                  Aucune donnée
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.repartitionForfaits}
                      cx="50%"
                      cy="50%"
                      innerRadius={73}
                      outerRadius={80}
                      paddingAngle={5}
                      cornerRadius={5}
                      dataKey="value"
                    >
                      {data.repartitionForfaits.map((entry, idx) => (
                        <Cell key={`cell-${entry.name}-${idx}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(val: any) => [`${val} vente(s)`, "Total"]} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
            <div className="space-y-2 mt-4 max-h-36 overflow-y-auto">
              {data?.repartitionForfaits.map((f, idx) => (
                <div
                  key={`${f.name}-${idx}`}
                  className="flex justify-between items-center text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: f.color }}
                    />
                    <span className="text-slate-600 font-medium truncate max-w-[120px]" title={f.name}>
                      {f.name}
                    </span>
                  </div>
                  <span className="font-bold text-slate-800">{f.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-8 mt-3">
          <button
            onClick={redirListVentes}
            className="bg-blue-700 text-white px-2.5 py-1.5 rounded-[0.5rem] cursor-pointer"
          >
            Voir toutes les ventes
          </button>
        </div>
      </div>
    </RoleGuard>
  );
}