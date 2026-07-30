/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import { updateTarif } from '@/app/services/tarif/tarifService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import React, { useState } from 'react';
import {
    HiX,
    HiTag,
    HiCurrencyDollar,
} from 'react-icons/hi';


export interface TarifData {
    codeTypeForfait: number;
    designation: string;
    dureeMinutes: number;
    prixFC: number;
}

interface ModifierTarifProps {
    setModalModifierTarif: (value: boolean) => void;
    tarif: TarifData;
    onTarifUpdated?: (updatedTarif: TarifData) => void;
}

export const ModifierTarif = ({
    setModalModifierTarif,
    tarif,
}: ModifierTarifProps) => {
    const [formData, setFormData] = useState({
        codeTypeForfait: tarif.codeTypeForfait,
        designation: tarif.designation,
        dureeMinutes: tarif.dureeMinutes,
        prixFC: tarif.prixFC,
    });
    const queryClient = useQueryClient();

    // Mutation React Query pour la suppression
    const { mutate, isPending, isError, error } = useMutation({
        mutationFn: (data: TarifData) => updateTarif(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tarifs'] });
            setModalModifierTarif(false);
        },
    });
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutate(formData)
    };

    return (
        <div className="fixed inset-0 flex h-full justify-center items-center bg-black/60 z-[1000] backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-white w-full max-w-[520px] rounded-2xl shadow-xl border border-gray-100 overflow-hidden text-gray-800 animate-[fadeModalIn_250ms_ease-out]">

                {/* EN-TÊTE DU MODAL */}
                <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                            <HiTag className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-gray-900">Modifier le Tarif</h3>
                            <p className="text-xs text-gray-500">Ajuster le prix, la durée ou le profil réseau</p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => setModalModifierTarif(false)}
                        aria-label="Fermer"
                        className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 rounded-xl transition-colors"
                    >
                        <HiX className="w-5 h-5" />
                    </button>
                </div>

                {/* FORMULAIRE */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4 text-left">
                    {isError && (
                        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-600">
                            {axios.isAxiosError(error)
                                ? error.response?.data?.message || 'Erreur lors de la modification.'
                                : 'Une erreur inattendue est survenue.'}
                        </div>
                    )}
                    {/* Nom du forfait */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-700 block">
                            Nom du Forfait <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <HiTag className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                required
                                value={formData.designation}
                                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                                className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                            />
                        </div>
                    </div>

                    {/* Durée de validité */}

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-700 block">Durée (minutes)</label>
                        <input
                            type='number'
                            min="1"
                            value={formData.dureeMinutes}
                            required
                            onChange={(e) => setFormData({ ...formData, dureeMinutes: Math.max(1, parseInt(e.target.value as any) || 1) })}
                            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                        />
                    </div>

                    {/* Prix en FC */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-700 block">
                            Prix (en FC) <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <HiCurrencyDollar className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="number"
                                required
                                step="50"
                                value={formData.prixFC}
                                onChange={(e) => setFormData({ ...formData, prixFC: parseInt(e.target.value) })}
                                className="w-full pl-10 pr-12 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-mono"
                            />
                            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400">
                                FC
                            </span>
                        </div>
                    </div>

                    {/* BOUTONS D'ACTION */}
                    <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100 mt-6">
                        <button
                            type="button"
                            disabled={isPending}
                            onClick={() => setModalModifierTarif(false)}
                            className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium text-sm hover:bg-gray-50 transition-colors"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors shadow-sm"
                        >
                            Mettre à jour
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};