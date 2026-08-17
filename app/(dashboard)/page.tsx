/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import {
  BsCashCoin,
  BsTicketPerforated,
  BsCheckCircle,
  BsSearch,
  BsBarChartLine,
  BsFilter,
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
} from "recharts";
import RoleGuard from "../components/RoleGuard";

interface StatsData {
  totalEncaisse: number;
  ticketsGeneres: number;
  modePrincipal: string;
}

interface VenteHeure {
  heure: string;
  ventes: number;
}

interface ForfaitChart {
  name: string;
  value: number;
  color: string;
}

interface VenteRecent {
  id: string | number;
  client: string;
  forfait: string;
  montant: string;
  mode: string;
  date: string;
  utilisateur: string;
  ville: string;
  site: string;
  statut: string;
}

interface DashboardApiResponse {
  stats: StatsData;
  evolutionHeures: VenteHeure[];
  repartitionForfaits: ForfaitChart[];
  recentVentes: VenteRecent[];
  villesOptions?: string[];
  sitesOptions?: string[];
}

interface FilterParams {
  dateDebut: string;
  dateFin: string;
  userEmail: string;
  ville: string;
  site: string;
}

const COLOR_PALETTE = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
];

const formatDateTime = (dateIsoString: string) => {
  if (!dateIsoString) return "--/--/---- --:--";
  try {
    const d = new Date(dateIsoString);
    if (isNaN(d.getTime())) return "--/--/---- --:--";
    return d.toLocaleString("fr-FR", {
      dateStyle: "short",
      timeStyle: "short",
    });
  } catch {
    return "--/--/---- --:--";
  }
};

const fetchDashboardData = async (
  filters: FilterParams
): Promise<DashboardApiResponse> => {
  const { data } = await axios.get("/api/dashboard", { params: filters });

  return {
    stats: {
      totalEncaisse: Number(data.stats?.totalEncaisse) || 0,
      ticketsGeneres: Number(data.stats?.ticketsGeneres) || 0,
      modePrincipal: data.stats?.modePrincipal || "N/A",
    },
    evolutionHeures: (data.evolutionHeures || []).map(
      (item: { heure: string; ventes: number }) => ({
        heure: item.heure || "",
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
    recentVentes: (data.recentVentes || []).map(
      (item: {
        idPaiement: number;
        codeTicket: string | number;
        Telephone: string;
        designation: string;
        montantPaye: number;
        operateur: string;
        datePaiement: string;
        email?: string;
        designVille?: string;
        designSite?: string;
      }) => ({
        id: item.codeTicket || item.idPaiement || "N/A",
        client: item.Telephone || "Client passage",
        forfait: item.designation || "Inconnu",
        montant: `${(Number(item.montantPaye) || 0).toLocaleString()} FC`,
        mode: item.operateur || "Cash",
        date: formatDateTime(item.datePaiement),
        utilisateur: item.email || "N/A",
        ville: item.designVille || "N/A",
        site: item.designSite || "Non défini",
        statut: "Réussi",
      })
    ),
    villesOptions: data.villesOptions || [],
    sitesOptions: data.sitesOptions || [],
  };
};

export default function VendeurDashboard() {
  const [searchTerm, setSearchTerm] = useState("");

  const [filters, setFilters] = useState<FilterParams>({
    dateDebut: "",
    dateFin: "",
    userEmail: "",
    ville: "",
    site: "",
  });

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({
      dateDebut: "",
      dateFin: "",
      userEmail: "",
      ville: "",
      site: "",
    });
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["ventes"],
    queryFn: () => fetchDashboardData(filters),
    refetchInterval: 30000,
    staleTime: 5000,
  });

  const filteredTransactions = (data?.recentVentes || []).filter(
    (t) =>
      (t.client ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(t.id ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.utilisateur ?? "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <RoleGuard allowedRoles={['Admin']}>
      <div className="w-full bg-slate-50 text-slate-800 sm:p-6">
        <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Tableau de bord</h1>
            <p className="text-sm text-slate-500 mt-1">
              Historique global des ventes et suivi des performances
            </p>
          </div>
        </div>

        {/* FILTRES */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm mb-8">
          <div className="flex items-center gap-2 mb-4 text-slate-700 font-bold text-sm">
            <BsFilter size={18} />
            <span>Filtres de recherche avancés</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                Date début
              </label>
              <input
                type="date"
                name="dateDebut"
                value={filters.dateDebut}
                onChange={handleFilterChange}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                Date fin
              </label>
              <input
                type="date"
                name="dateFin"
                value={filters.dateFin}
                onChange={handleFilterChange}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                Utilisateur (Email)
              </label>
              <input
                type="text"
                name="userEmail"
                placeholder="ex: user@domaine.com"
                value={filters.userEmail}
                onChange={handleFilterChange}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                Site
              </label>
              <select
                name="site"
                value={filters.site}
                onChange={handleFilterChange}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">Tous les sites</option>
                {data?.sitesOptions?.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={resetFilters}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 underline transition cursor-pointer"
            >
              Réinitialiser tous les filtres
            </button>
          </div>
        </div>

        {isError && (
          <div className="p-4 mb-6 text-sm text-red-600 bg-red-50 rounded-xl border border-red-200">
            Impossible de charger les données. Vérifiez vos filtres ou votre connexion.
          </div>
        )}

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Total Encaissé
              </p>
              <h3 className="text-2xl font-extrabold text-slate-900">
                {isLoading
                  ? "..."
                  : `${(data?.stats.totalEncaisse || 0).toLocaleString()} FC`}
              </h3>
              <span className="inline-block mt-2 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                Période sélectionnée
              </span>
            </div>
            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl">
              <BsCashCoin size={28} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Tickets Générés
              </p>
              <h3 className="text-2xl font-extrabold text-slate-900">
                {isLoading
                  ? "..."
                  : `${data?.stats.ticketsGeneres || 0} Tickets`}
              </h3>
              <span className="inline-block mt-2 text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                Période sélectionnée
              </span>
            </div>
            <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
              <BsTicketPerforated size={28} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between sm:col-span-2 lg:col-span-1">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Mode Principal
              </p>
              <h3 className="text-2xl font-extrabold text-slate-900">
                {isLoading ? "..." : data?.stats.modePrincipal}
              </h3>
              <span className="inline-block mt-2 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                Plus sollicité
              </span>
            </div>
            <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl">
              <BsBarChartLine size={28} />
            </div>
          </div>
        </div>

        {/* GRAPHIQUES */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-base font-bold text-slate-900">
                Évolution des Recettes (FC)
              </h2>
            </div>
            <div className="h-64 w-full">
              {isLoading ? (
                <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                  Chargement du graphique...
                </div>
              ) : !data?.evolutionHeures.length ? (
                <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                  Aucune vente pour ces critères.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.evolutionHeures}>
                    <XAxis
                      dataKey="heure"
                      stroke="#94a3b8"
                      fontSize={12}
                      tickLine={false}
                    />
                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                    <Tooltip
                      formatter={(value) => [`${value} FC`, "Ventes"]}
                      contentStyle={{
                        backgroundColor: "#fff",
                        borderRadius: "12px",
                        borderColor: "#e2e8f0",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="ventes"
                      stroke="#10b981"
                      strokeWidth={3}
                      dot={{ fill: "#10b981", r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
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
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {data.repartitionForfaits.map((entry) => (
                        <Cell key={`cell-${entry.name}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
            <div className="space-y-2 mt-4 max-h-36 overflow-y-auto">
              {data?.repartitionForfaits.map((f) => (
                <div
                  key={f.name}
                  className="flex justify-between items-center text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: f.color }}
                    />
                    <span className="text-slate-600 font-medium truncate max-w-[120px]">
                      {f.name}
                    </span>
                  </div>
                  <span className="font-bold text-slate-800">{f.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* TABLEAU */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden mb-8">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Historique Complet des Ventes
              </h2>
              <p className="text-xs text-slate-500">
                Visualisation de toutes les transactions filtrées
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <BsSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Chercher par code, tél, vdr..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
                  <th className="py-3.5 px-6">Code Ticket</th>
                  <th className="py-3.5 px-6">Client</th>
                  <th className="py-3.5 px-6">Forfait</th>
                  <th className="py-3.5 px-6">Montant</th>
                  <th className="py-3.5 px-6">Utilisateur</th>
                  <th className="py-3.5 px-6">Site</th>
                  <th className="py-3.5 px-6">Date & Heure</th>
                  <th className="py-3.5 px-6 text-center">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-slate-400">
                      Chargement de l'historique des ventes...
                    </td>
                  </tr>
                ) : filteredTransactions.length > 0 ? (
                  filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50/50 transition">
                      <td className="py-4 px-6 font-bold text-blue-600">
                        {tx.id}
                      </td>
                      <td className="py-4 px-6 font-medium text-slate-800">
                        {tx.client}
                      </td>
                      <td className="py-4 px-6">{tx.forfait}</td>
                      <td className="py-4 px-6 font-bold text-slate-900">
                        {tx.montant}
                      </td>
                      <td className="py-4 px-6 text-slate-500">
                        {tx.utilisateur}
                      </td>
                      <td className="py-4 px-6 text-slate-500">
                        <div className="text-[10px] text-slate-400">{tx.site}</div>
                      </td>
                      <td className="py-4 px-6 text-slate-400">{tx.date}</td>
                      <td className="py-4 px-6 text-center">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-[11px]">
                          <BsCheckCircle className="text-emerald-500" />
                          {tx.statut}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-slate-400">
                      Aucune vente ne correspond à ces critères
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}