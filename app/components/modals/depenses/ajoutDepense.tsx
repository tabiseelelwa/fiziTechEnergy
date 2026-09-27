/* eslint-disable react/no-unescaped-entities */
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import {
  HiX,
  HiCurrencyDollar,
  HiTag,
  HiCash,
} from "react-icons/hi";
import {
  createDepense,
  DepensePayload,
  getMotifsDepense,
  MotifDepense,
} from "@/app/services/depenses/depenses";

interface AjouterDepenseProps {
  setModalAjouterDepense: (value: boolean) => void;
}

export const AjouterDepense = ({ setModalAjouterDepense }: AjouterDepenseProps) => {
  const queryClient = useQueryClient();

  const { data: motifs, isLoading: isLoadingMotifs } = useQuery<MotifDepense[]>({
    queryKey: ["motifs-depense"],
    queryFn: getMotifsDepense,
  });

  const [formData, setFormData] = useState<DepensePayload>({
    montantDepense: 0,
    idMotifDepense: 0,
  });

  const selectedMotifId =
    formData.idMotifDepense !== 0
      ? formData.idMotifDepense
      : motifs && motifs.length > 0
        ? motifs[0].idMotifDepense
        : 0;

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: createDepense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["depenses"] });
      queryClient.invalidateQueries({ queryKey: ["benefices"] });
      setModalAjouterDepense(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedMotifId) return;

    mutate({
      ...formData,
      idMotifDepense: selectedMotifId,
    });
  };

  return (
    <div className="fixed inset-0 flex h-full justify-center items-center bg-black/60 z-[1000] backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-[500px] rounded-2xl shadow-xl border border-gray-100 overflow-hidden text-gray-800 animate-[fadeModalIn_250ms_ease-out]">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
              <HiCash className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">
                Nouvelle Dépense
              </h3>
              <p className="text-xs text-gray-500">
                Enregistrez une nouvelle sortie d'argent
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setModalAjouterDepense(false)}
            aria-label="Fermer"
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 rounded-xl transition-colors"
          >
            <HiX className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-left">
          {isError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">
              {error instanceof Error
                ? error.message
                : "Une erreur est survenue lors de l'enregistrement."}
            </div>
          )}

          {/* Montant */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 block">
              Montant (FC) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <HiCurrencyDollar className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="number"
                required
                min="1"
                placeholder="ex: 5000"
                value={formData.montantDepense || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    montantDepense: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all font-medium"
              />
            </div>
          </div>

          {/* Motif de la dépense */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 block">
              Motif de la dépense <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <HiTag className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                value={selectedMotifId}
                disabled={isLoadingMotifs}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    idMotifDepense: parseInt(e.target.value),
                  })
                }
                className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all disabled:opacity-60"
              >
                {isLoadingMotifs ? (
                  <option value={0}>Chargement des motifs...</option>
                ) : (
                  motifs?.map((motif) => (
                    <option key={motif.idMotifDepense} value={motif.idMotifDepense}>
                      {motif.descriptMotif}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          {/* BOUTONS */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100 mt-6">
            <button
              type="button"
              onClick={() => setModalAjouterDepense(false)}
              disabled={isPending}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium text-sm hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isPending || isLoadingMotifs || !selectedMotifId}
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-medium text-sm transition-colors shadow-sm disabled:opacity-50"
            >
              {isPending ? "Enregistrement..." : "Enregistrer la dépense"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};