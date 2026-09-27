"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  BsPlusCircleFill,
  BsArrowClockwise,
  BsChevronLeft,
  BsChevronRight,
} from "react-icons/bs";
import { FiRefreshCw, FiCalendar, FiSearch } from "react-icons/fi";
import { fetchDepenses, Depense } from "@/app/services/depenses/depenses";
import { AjouterDepense } from "@/app/components/modals/depenses/ajoutDepense";


// Type attendu de la réponse paginée du backend
interface PaginatedDepensesResponse {
  data: Depense[];
  total: number;
  totalPages: number;
  page: number;
}

export default function PageDepenses() {

  const [modalAjouterDepense, setModalAjouterDepense] = useState<boolean>(false)

  // États pour les filtres et la pagination
  const [page, setPage] = useState(1);
  const limit = 10;
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Récupération des données filtrées et paginées depuis le backend
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<PaginatedDepensesResponse, Error>({
    queryKey: ["depenses", { page, limit, searchTerm, startDate, endDate }],
    queryFn: () =>
      fetchDepenses({
        page,
        limit,
        search: searchTerm,
        startDate,
        endDate,
      }),
  });

  const depenses = data?.data || [];
  const totalPages = data?.totalPages || 1;
  const totalDepensesCount = data?.total || 0;

  const resetFilters = () => {
    setSearchTerm("");
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  return (
    <div className="space-y-6 px-2 bg-slate-50 text-slate-800">
      {modalAjouterDepense ? <AjouterDepense setModalAjouterDepense={setModalAjouterDepense} /> : ""}
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Gestion des dépenses
          </h1>
          <p className="text-sm text-gray-500">
            Suivi et aperçu des sorties de caisse.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button onClick={() => setModalAjouterDepense(true)} className="flex-1 sm:flex-none flex items-center cursor-pointer justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2.5 rounded-lg shadow-sm transition">
            <BsPlusCircleFill size={18} />
            Nouvelle dépense
          </button>
        </div>
      </div>

      {/* Barre de Filtres */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-gray-200 shadow-sm space-y-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Recherche (Description)
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Achat fourniture..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <FiSearch
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

      {/* Tableau des dépenses */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold text-xs uppercase">
              <tr>
                <th className="px-4 py-3.5">#</th>
                <th className="px-4 py-3.5">Description</th>
                <th className="px-4 py-3.5">Date depense</th>
                <th className="px-4 py-3.5 text-right">Montant depense</th>
                <th className="px-4 py-3.5 text-right">Enregistré par</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <BsArrowClockwise className="animate-spin" size={18} />
                      Chargement des dépenses...
                    </div>
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-red-600"
                  >
                    Une erreur est survenue : {error.message}
                    <button
                      onClick={() => refetch()}
                      className="ml-4 underline font-semibold text-slate-700 hover:text-slate-900"
                    >
                      Réessayer
                    </button>
                  </td>
                </tr>
              ) : depenses.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    Aucune dépense ne correspond aux critères sélectionnés.
                  </td>
                </tr>
              ) : (
                depenses.map((depense: Depense, idx: number) => (
                  <tr
                    key={depense.idDepense}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-4 py-2 text-gray-400 text-xs">
                      {(page - 1) * limit + idx + 1}
                    </td>
                    <td className="px-4 py-2 font-medium text-gray-900">
                      {depense.descriptMotif}
                    </td>
                    <td className="px-4 py-2 text-gray-500 text-xs">
                      {depense.dateDepense
                        ? new Date(depense.dateDepense).toLocaleDateString(
                          "fr-FR"
                        )
                        : "-"}
                    </td>
                    <td className="px-4 py-2 text-right font-semibold text-gray-900">
                      {Number(depense.montantDepense).toLocaleString("fr-FR")} FC
                    </td>
                    <td className="px-4 py-2 text-right font-semibold text-gray-900">
                      {depense.nom}
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
              Page <strong className="text-slate-800">{page}</strong> sur{" "}
              <strong className="text-slate-800">{totalPages}</strong> (
              {totalDepensesCount} dépenses au total)
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
  );
}