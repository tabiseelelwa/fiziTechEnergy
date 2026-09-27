/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { VendeurPage } from "@/app/components/modals/VenteTickets";
import { FiRefreshCw, FiCalendar, FiTag, FiHash } from "react-icons/fi";

import {
  BsCalendar3,
  BsCalendarCheck,
  BsCalendarMonth,
  BsCalendarWeek,
  BsChevronLeft,
  BsChevronRight,
  BsPlusCircleFill,
} from "react-icons/bs";
import RoleGuard from "@/app/components/RoleGuard";

interface Vente {
  idPaiement: number;
  codeTicket: string;
  montantPaye: number;
  Telephone: string;
  datePaiement: string;
  dateExpiration: string;
  designation: string;
}

interface TypeForfait {
  codeTypeForfait: number;
  designation: string;
}

interface StatsApiResponse {
  jour: number;
  semaine: number;
  mois: number;
  annee: number;
}

interface VentesApiResponse {
  ventes: Vente[];
  totalTickets: number;
  totalPages: number;
  currentPage: number;
}

const fetchTicketStats = async (): Promise<StatsApiResponse> => {
  const { data } = await axios.get("/api/tickets");
  return data;
};

export default function MesVentesPage() {
  const [modalVenteTicket, setModalVenteTicket] = useState(false);
  const [page, setPage] = useState(1);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedForfait, setSelectedForfait] = useState("ALL");
  const [codeTicketFilter, setCodeTicketFilter] = useState("");

  const { data: typesForfait = [] } = useQuery<TypeForfait[]>({
    queryKey: ["typeForfaits-list"],
    queryFn: async () => {
      const res = await axios.get("/api/typeForfait");
      return res.data.typesForfait || [];
    },
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["tickets"],
    queryFn: fetchTicketStats,
  });

  const { data: ventesData, isLoading: loading } = useQuery<VentesApiResponse>({
    queryKey: [
      "tickets",
      page,
      startDate,
      endDate,
      selectedForfait,
      codeTicketFilter,
    ],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", "6");

      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);
      if (selectedForfait !== "ALL")
        params.append("codeTypeForfait", selectedForfait);
      if (codeTicketFilter.trim() !== "")
        params.append("codeTicket", codeTicketFilter.trim());

      const res = await axios.get(`/api/vente?${params.toString()}`);
      return res.data;
    },
  });

  const resetFilters = () => {
    setStartDate("");
    setEndDate("");
    setSelectedForfait("ALL");
    setCodeTicketFilter("");
    setPage(1);
  };

  const ventes = ventesData?.ventes || [];
  const totalPages = ventesData?.totalPages || 1;
  const totalTickets = ventesData?.totalTickets || 0;
  const currentPage = ventesData?.currentPage || 1;

  return (
    <RoleGuard allowedRoles={["Caissier"]}>
      <div className="space-y-6 px-4">
        {modalVenteTicket && (
          <VendeurPage setModalVenteTicket={setModalVenteTicket} />
        )}

        {/* En-tête */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Ventes</h1>
            <p className="text-sm text-gray-500">
              Consultez et filtrez l'historique de vos tickets vendus.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => setModalVenteTicket(true)}
              className="flex-1 sm:flex-none flex items-center cursor-pointer justify-center gap-2 bg-emerald-600 
                       hover:bg-emerald-700 text-white font-semibold px-4 py-2.5 rounded-lg shadow-sm transition"
            >
              <BsPlusCircleFill size={18} />
              Nouvelle Vente
            </button>
          </div>
        </div>

        {/* Cartes de Statistiques */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <BsCalendarCheck className="size-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400">AUJOURD'HUI</p>
              {statsLoading ? (
                <div className="h-6 w-12 bg-slate-200 animate-pulse rounded mt-1"></div>
              ) : (
                <p className="text-xl font-bold text-slate-900">
                  {stats?.jour ?? 0}{" "}
                  {(stats?.jour ?? 0) > 1 ? "TICKETS" : "TICKET"}
                </p>
              )}
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <BsCalendarWeek className="size-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400">
                CETTE SEMAINE
              </p>
              {statsLoading ? (
                <div className="h-6 w-12 bg-slate-200 animate-pulse rounded mt-1"></div>
              ) : (
                <p className="text-xl font-bold text-slate-900">
                  {stats?.semaine ?? 0}{" "}
                  {(stats?.semaine ?? 0) > 1 ? "TICKETS" : "TICKET"}
                </p>
              )}
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
              <BsCalendarMonth className="size-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400">CE MOIS-CI</p>
              {statsLoading ? (
                <div className="h-6 w-12 bg-slate-200 animate-pulse rounded mt-1"></div>
              ) : (
                <p className="text-xl font-bold text-slate-900">
                  {stats?.mois ?? 0}{" "}
                  {(stats?.mois ?? 0) > 1 ? "TICKETS" : "TICKET"}
                </p>
              )}
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <BsCalendar3 className="size-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400">CETTE ANNEE</p>
              {statsLoading ? (
                <div className="h-6 w-12 bg-slate-200 animate-pulse rounded mt-1"></div>
              ) : (
                <p className="text-xl font-bold text-slate-900">
                  {stats?.annee ?? 0}{" "}
                  {(stats?.annee ?? 0) > 1 ? "TICKETS" : "TICKET"}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Barre de Filtres */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-gray-200 shadow-sm space-y-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Code Ticket
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="FT-..."
                  value={codeTicketFilter}
                  onChange={(e) => {
                    setCodeTicketFilter(e.target.value);
                    setPage(1);
                  }}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <FiHash
                  className="absolute left-3 top-2.5 text-gray-400"
                  size={16}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Date de début
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setPage(1);
                  }}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <FiCalendar
                  className="absolute left-3 top-2.5 text-gray-400"
                  size={16}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Date de fin
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setPage(1);
                  }}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <FiCalendar
                  className="absolute left-3 top-2.5 text-gray-400"
                  size={16}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Type de forfait
              </label>
              <div className="relative">
                <select
                  value={selectedForfait}
                  onChange={(e) => {
                    setSelectedForfait(e.target.value);
                    setPage(1);
                  }}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none"
                >
                  <option value="ALL">Tous les forfaits</option>
                  {typesForfait.map((tf) => (
                    <option key={tf.codeTypeForfait} value={tf.codeTypeForfait}>
                      {tf.designation}
                    </option>
                  ))}
                </select>
                <FiTag
                  className="absolute left-3 top-2.5 text-gray-400"
                  size={16}
                />
              </div>
            </div>

            <div className="flex items-end">
              <button
                onClick={resetFilters}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <FiRefreshCw size={14} />
                Réinitialiser
              </button>
            </div>
          </div>
        </div>

        {/* Tableau des ventes */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold text-xs uppercase">
                <tr>
                  <th className="px-4 py-3.5">#</th>
                  <th className="px-4 py-3.5">Code Ticket</th>
                  <th className="px-4 py-3.5">Type Forfait</th>
                  <th className="px-4 py-3.5">Prix</th>
                  <th className="px-4 py-3.5">Date de vente</th>
                  <th className="px-4 py-3.5">Date d'expiration</th>
                  <th className="px-4 py-3.5">Téléphone client</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      Chargement des ventes...
                    </td>
                  </tr>
                ) : ventes.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      Aucune vente ne correspond aux critères sélectionnés.
                    </td>
                  </tr>
                ) : (
                  ventes.map((item, idx) => (
                    <tr
                      key={item.idPaiement}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-4 py-2 text-gray-400 text-xs">
                        {(currentPage - 1) * 8 + idx + 1}
                      </td>
                      <td className="px-4 py-2 font-mono font-medium text-gray-900">
                        {item.codeTicket}
                      </td>
                      <td className="px-4 py-2">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                          {item.designation || "N/A"}
                        </span>
                      </td>
                      <td className="px-4 py-2 font-semibold text-gray-900">
                        {Number(item.montantPaye).toLocaleString()} FC
                      </td>
                      <td className="px-4 py-2 text-gray-500 text-xs">
                        {item.datePaiement
                          ? new Date(item.datePaiement).toLocaleString(
                              "fr-FR",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )
                          : "-"}
                      </td>
                      <td className="px-4 py-2 text-gray-500 text-xs">
                        {item.dateExpiration
                          ? new Date(item.dateExpiration).toLocaleString(
                              "fr-FR",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )
                          : "-"}
                      </td>
                      <td className="px-4 py-2 font-semibold text-gray-900">
                        {item.Telephone || "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-2.5 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
              <span>
                Page <strong className="text-slate-800">{currentPage}</strong>{" "}
                sur <strong className="text-slate-800">{totalPages}</strong> (
                {totalTickets} tickets)
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  <BsChevronLeft className="size-4" />
                </button>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((prev) => prev + 1)}
                  className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  <BsChevronRight className="size-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </RoleGuard>
  );
}