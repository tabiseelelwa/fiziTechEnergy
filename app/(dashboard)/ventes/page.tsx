/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { VendeurPage } from '@/app/components/modals/VenteTickets';
import {
  FiFilter,
  FiRefreshCw,
  FiCalendar,
  FiTag,
  FiHash,
} from "react-icons/fi";
import { BsPlusCircleFill } from "react-icons/bs";

interface Vente {
  idPaiement: number;
  codeTicket: number | string;
  montantPaye: number;
  Telephone: string;
  datePaiement: string;
  codetypeForfait: number;
  designation: string;
}

interface TypeForfait {
  codeTypeForfait: number;
  designation: string;
}

export default function MesVentesPage() {
  const [modalVenteTicket, setModalVenteTicket] = useState(false);
  const [ventes, setVentes] = useState<Vente[]>([]);
  const [typesForfait, setTypesForfait] = useState<TypeForfait[]>([]);
  const [loading, setLoading] = useState(true);

  // États des filtres
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedForfait, setSelectedForfait] = useState("ALL");
  const [codeTicketFilter, setCodeTicketFilter] = useState(""); // Nouveau filtre Code Ticket

  // Récupération des types de forfaits pour le filtre <select>
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const res = await axios.get("/api/typeForfait");
        setTypesForfait(res.data.typesForfait || []);
      } catch (err) {
        console.error("Erreur chargement types forfaits:", err);
      }
    };
    fetchTypes();
  }, []);

  // Chargement des ventes filtrées
  const fetchVentes = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);
      if (selectedForfait !== "ALL")
        params.append("codeTypeForfait", selectedForfait);
      if (codeTicketFilter.trim() !== "")
        params.append("codeTicket", codeTicketFilter.trim());

      const res = await axios.get(`/api/vente?${params.toString()}`);
      setVentes(res.data.ventes || []);
    } catch (err) {
      console.error("Erreur chargement ventes:", err);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, selectedForfait, codeTicketFilter]);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setLoading(true);
      if (isMounted) {
        await fetchVentes();
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [fetchVentes]);

  // Réinitialiser les filtres
  const resetFilters = () => {
    setStartDate("");
    setEndDate("");
    setSelectedForfait("ALL");
    setCodeTicketFilter("");
  };

  // Calcul du montant total des ventes affichées
  const totalMontant = ventes.reduce(
    (sum, item) => sum + Number(item.montantPaye || 0),
    0
  );

  return (
    <div className="space-y-6">
      {modalVenteTicket && <VendeurPage setModalVenteTicket={setModalVenteTicket} />}
      {/* En-tête de la page */}
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

      {/* Barre de Filtres */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-gray-200 shadow-sm space-y-1">
        <div className="flex justify-between gap-2 text-sm font-semibold text-gray-700 border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <FiFilter size={16} className="text-blue-600" />
            <span>Filtres de recherche</span>
          </div>
          {/* Badge Total */}
          <div className="bg-blue-600 text-white px-3 py-1 rounded-lg shadow-sm flex items-center gap-3">
            <div>
              <p className="text-xs uppercase font-medium opacity-80">
                Total Filtré
              </p>
              <p className="text-lg font-bold">
                {totalMontant.toLocaleString()} FC
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Code Ticket */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Code Ticket
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="FT-..."
                value={codeTicketFilter}
                onChange={(e) => setCodeTicketFilter(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <FiHash
                className="absolute left-3 top-2.5 text-gray-400"
                size={16}
              />
            </div>
          </div>

          {/* Date de début */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Date de début
            </label>
            <div className="relative">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <FiCalendar
                className="absolute left-3 top-2.5 text-gray-400"
                size={16}
              />
            </div>
          </div>

          {/* Date de fin */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Date de fin
            </label>
            <div className="relative">
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <FiCalendar
                className="absolute left-3 top-2.5 text-gray-400"
                size={16}
              />
            </div>
          </div>

          {/* Type de forfait */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Type de forfait
            </label>
            <div className="relative">
              <select
                value={selectedForfait}
                onChange={(e) => setSelectedForfait(e.target.value)}
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

          {/* Bouton Réinitialiser */}
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
                <th className="px-6 py-3.5">#</th>
                <th className="px-6 py-3.5">Code Ticket</th>
                <th className="px-6 py-3.5">Type Forfait</th>
                <th className="px-6 py-3.5">Prix</th>
                <th className="px-6 py-3.5">Date de vente</th>
                <th className="px-6 py-3.5">Téléphone client</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    Chargement des ventes...
                  </td>
                </tr>
              ) : ventes.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
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
                    <td className="px-6 py-4 text-gray-400 text-xs">
                      {idx + 1}
                    </td>
                    <td className="px-6 py-4 font-mono font-medium text-gray-900">
                      {item.codeTicket}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                        {item.designation || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      {Number(item.montantPaye).toLocaleString()} FC
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs">
                      {new Date(item.datePaiement).toLocaleString("fr-FR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      {item.Telephone}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}