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
  Bar,
  CartesianGrid,
} from "recharts";

interface StatsDepensesData {
  depensesJour: number;
  depensesSemaine: number;
  depensesMois: number;
  depensesAnnee: number;
}

interface DepenseJourSeptDerniers {
  jour: string;
  depenses: number;
}

interface MotifChart {
  name: string;
  value: number;
  color: string;
}

interface DashboardDepensesApiResponse {
  stats: StatsDepensesData;
  evolutionSeptJours: DepenseJourSeptDerniers[];
  repartitionMotifs: MotifChart[];
}

const COLOR_PALETTE = [
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#ad764f",
];

const fetchDashboardDepensesData = async (): Promise<DashboardDepensesApiResponse> => {
  const { data } = await axios.get("/api/depenses");

  return {
    stats: {
      depensesJour: Number(data.stats?.depensesJour) || 0,
      depensesSemaine: Number(data.stats?.depensesSemaine) || 0,
      depensesMois: Number(data.stats?.depensesMois) || 0,
      depensesAnnee: Number(data.stats?.depensesAnnee) || 0,
    },
    evolutionSeptJours: (data.evolutionSeptJours || []).map(
      (item: { jour: string; depenses: number }) => ({
        jour: item.jour || "",
        depenses: Number(item.depenses) || 0,
      })
    ),
    repartitionMotifs: (data.repartitionMotifs || []).map(
      (item: { motif: string; total: number }, idx: number) => ({
        name: item.motif || "Autre",
        value: Number(item.total) || 0,
        color: COLOR_PALETTE[idx % COLOR_PALETTE.length],
      })
    ),
  };
};

export default function DepensesDashboard() {
  const router = useRouter()
  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboard-depenses-kpi"],
    queryFn: fetchDashboardDepensesData,
    refetchInterval: 30000,
    staleTime: 5000,
  });

  const redirListDepenses = () => {
    router.push('/dashboard/finances/list-depenses')
  }

  const redirListBenef = () => {
    router.push('/dashboard/finances/benefs')
  }
  return (
    <RoleGuard allowedRoles={["Admin", "Gerant"]}>
      <div className="w-full flex flex-col gap-4 bg-slate-50 px-2 text-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Tableau de bord des dépenses
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Suivi et aperçu des sorties de caisse
          </p>
        </div>

        {isError && (
          <div className="p-4 mb-6 text-sm text-red-600 bg-red-50 rounded-xl border border-red-200">
            Impossible de charger les données des dépenses depuis la base de données.
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
                  : `${(data?.stats.depensesJour || 0).toLocaleString()} FC`}
              </h3>
              <span className="inline-block mt-2 text-xs font-medium text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                Dépenses du jour
              </span>
            </div>
            <div className="p-4 bg-rose-50 text-rose-600 rounded-2xl">
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
                  : `${(data?.stats.depensesSemaine || 0).toLocaleString()} FC`}
              </h3>
              <span className="inline-block mt-2 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                Semaine en cours
              </span>
            </div>
            <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl">
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
                  : `${(data?.stats.depensesMois || 0).toLocaleString()} FC`}
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
                  : `${(data?.stats.depensesAnnee || 0).toLocaleString()} FC`}
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
                  Évolution des dépenses
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
                      formatter={(value: any) => [`${Number(value).toLocaleString()} FC`, "Dépenses"]}
                      contentStyle={{
                        backgroundColor: "#fff",
                        borderRadius: "12px",
                        borderColor: "#e2e8f0",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Bar
                      dataKey="depenses"
                      fill="#ef4444"
                      radius={[6, 6, 0, 0]}
                      barSize={5}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* RÉPARTITION DES MOTIFS DE DÉPENSES */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <h2 className="text-base font-bold text-slate-900 mb-2">
              Répartition par motif
            </h2>
            <div className="h-48 w-full">
              {isLoading ? (
                <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                  Chargement...
                </div>
              ) : !data?.repartitionMotifs.length ? (
                <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                  Aucune dépense enregistrée
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.repartitionMotifs}
                      cx="50%"
                      cy="50%"
                      innerRadius={73}
                      outerRadius={80}
                      paddingAngle={5}
                      cornerRadius={5}
                      dataKey="value"
                    >
                      {data.repartitionMotifs.map((entry) => (
                        <Cell key={`cell-${entry.name}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(val: any) => [`${Number(val).toLocaleString()} FC`, "Total"]} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
            <div className="space-y-2 mt-4 max-h-36 overflow-y-auto">
              {data?.repartitionMotifs.map((m) => (
                <div
                  key={m.name}
                  className="flex justify-between items-center text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: m.color }}
                    />
                    <span className="text-slate-600 font-medium truncate max-w-[120px]" title={m.name}>
                      {m.name}
                    </span>
                  </div>
                  <span className="font-bold text-slate-800">{m.value.toLocaleString()} FC</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-8 mt-3">
          <button onClick={() => redirListDepenses()} className="bg-emerald-700 text-white px-2.5 py-1.5 rounded-[0.5rem] cursor-pointer">Charges</button>
          <button onClick={() => redirListBenef()} className="bg-blue-700 text-white px-2.5 py-1.5 rounded-[0.5rem] cursor-pointer">Marges</button>
        </div>
      </div>
    </RoleGuard>
  );
}