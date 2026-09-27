/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
"use client";

import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import RoleGuard from "@/app/components/RoleGuard";
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
  Bar,
  CartesianGrid,
} from "recharts";

interface StatsBeneficesData {
  beneficesJour: number;
  beneficesSemaine: number;
  beneficesMois: number;
  beneficesAnnee: number;
}

interface BeneficeJourSeptDerniers {
  jour: string;
  benefices: number;
}

interface SourceChart {
  name: string;
  value: number;
  color: string;
}

interface DashboardBeneficesApiResponse {
  stats: StatsBeneficesData;
  evolutionSeptJours: BeneficeJourSeptDerniers[];
  repartitionSources: SourceChart[];
}

// Palette de couleurs axée sur les teintes émeraude/vert/bleu (symbole de bénéfices)
const COLOR_PALETTE = [
  "#10b981", // Emerald
  "#3b82f6", // Blue
  "#8b5cf6", // Purple
  "#f59e0b", // Amber
];

const fetchDashboardBeneficesData = async (): Promise<DashboardBeneficesApiResponse> => {
  const { data } = await axios.get("/api/benefices");

  return {
    stats: {
      beneficesJour: Number(data.stats?.beneficesJour) || 0,
      beneficesSemaine: Number(data.stats?.beneficesSemaine) || 0,
      beneficesMois: Number(data.stats?.beneficesMois) || 0,
      beneficesAnnee: Number(data.stats?.beneficesAnnee) || 0,
    },
    evolutionSeptJours: (data.evolutionSeptJours || []).map(
      (item: { jour: string; benefices: number }) => ({
        jour: item.jour || "",
        benefices: Number(item.benefices) || 0,
      })
    ),
    repartitionSources: (data.repartitionSources || []).map(
      (item: { source: string; total: number }, idx: number) => ({
        name: item.source || "Autre",
        value: Number(item.total) || 0,
        color: COLOR_PALETTE[idx % COLOR_PALETTE.length],
      })
    ),
  };
};

export default function BeneficesDashboard() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboard-benefices-kpi"],
    queryFn: fetchDashboardBeneficesData,
    refetchInterval: 30000,
    staleTime: 5000,
  });

  return (
    <RoleGuard allowedRoles={["Admin", "Gerant"]}>
      <div className="w-full flex flex-col gap-4 bg-slate-50 px-2 text-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Tableau de bord des marges
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Suivi et aperçu des marges et revenus nets
          </p>
        </div>

        {isError && (
          <div className="p-4 mb-6 text-sm text-red-600 bg-red-50 rounded-xl border border-red-200">
            Impossible de charger les données des bénéfices depuis la base de données.
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
                  : `${(data?.stats.beneficesJour || 0).toLocaleString("fr-FR")} FC`}
              </h3>
              <span className="inline-block mt-2 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                Bénéfices du jour
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
                  : `${(data?.stats.beneficesSemaine || 0).toLocaleString("fr-FR")} FC`}
              </h3>
              <span className="inline-block mt-2 text-xs font-medium text-teal-600 bg-teal-50 px-2 py-0.5 rounded-md">
                Semaine en cours
              </span>
            </div>
            <div className="p-4 bg-teal-50 text-teal-600 rounded-2xl">
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
                  : `${(data?.stats.beneficesMois || 0).toLocaleString("fr-FR")} FC`}
              </h3>
              <span className="inline-block mt-2 text-xs font-medium text-sky-600 bg-sky-50 px-2 py-0.5 rounded-md">
                Mois en cours
              </span>
            </div>
            <div className="p-4 bg-sky-50 text-sky-600 rounded-2xl">
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
                  : `${(data?.stats.beneficesAnnee || 0).toLocaleString("fr-FR")} FC`}
              </h3>
              <span className="inline-block mt-2 text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                Année en cours
              </span>
            </div>
            <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl">
              <BsCalendarCheck size={26} />
            </div>
          </div>
        </div>

        {/* GRAPHIQUES */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* GRAPHIQUE BARRES 7 DERNIERS JOURS */}
          <div className="lg:col-span-2 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Évolution des marges
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
                      formatter={(value: any) => [
                        `${Number(value).toLocaleString("fr-FR")} FC`,
                        "Bénéfices",
                      ]}
                      contentStyle={{
                        backgroundColor: "#fff",
                        borderRadius: "12px",
                        borderColor: "#e2e8f0",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Bar
                      dataKey="benefices"
                      radius={[6, 6, 0, 0]}
                      barSize={18}
                    >
                      {/* Attribution dynamique de la couleur par barre */}
                      {data.evolutionSeptJours.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.benefices < 0 ? "#ef4444" : "#10b981"} // Rouge si perte (< 0), Vert si gain (>= 0)
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* RÉPARTITION DES BÉNÉFICES PAR SOURCE */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <h2 className="text-base font-bold text-slate-900 mb-2">
              Répartition par source
            </h2>
            <div className="h-48 w-full">
              {isLoading ? (
                <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                  Chargement...
                </div>
              ) : !data?.repartitionSources.length ? (
                <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                  Aucun bénéfice enregistré
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.repartitionSources}
                      cx="50%"
                      cy="50%"
                      innerRadius={73}
                      outerRadius={80}
                      paddingAngle={5}
                      cornerRadius={5}
                      dataKey="value"
                    >
                      {data.repartitionSources.map((entry) => (
                        <Cell key={`cell-${entry.name}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val: any) => [
                        `${Number(val).toLocaleString("fr-FR")} FC`,
                        "Total",
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
            <div className="space-y-2 mt-4 max-h-36 overflow-y-auto">
              {data?.repartitionSources.map((s) => (
                <div
                  key={s.name}
                  className="flex justify-between items-center text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: s.color }}
                    />
                    <span
                      className="text-slate-600 font-medium truncate max-w-[120px]"
                      title={s.name}
                    >
                      {s.name}
                    </span>
                  </div>
                  <span className="font-bold text-slate-800">
                    {s.value.toLocaleString("fr-FR")} FC
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}

