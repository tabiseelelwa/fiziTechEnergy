
'use client';

import { modifSite } from '@/app/services/sites/sitesService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import React, { useState } from 'react';
import {
  HiX,
  HiServer,
  HiLocationMarker,
  HiDesktopComputer,
} from 'react-icons/hi';

interface SiteData {
  idSite: number;
  designSite: string;
  localisation: string;
  equipement: string;
  statut: string;
  idVille: number;
}

interface ModifierSiteProps {
  setModalModifierSite: (value: boolean) => void;
  site: SiteData;
}

export const ModifierSite = ({
  setModalModifierSite,
  site,
}: ModifierSiteProps) => {
  const [formData, setFormData] = useState<SiteData>({
    idSite: site.idSite,
    designSite: site.designSite,
    localisation: site.localisation,
    equipement: site.equipement,
    statut: site.statut,
    idVille: site.idVille
  });

  const queryClient = useQueryClient()

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: (data: SiteData) => modifSite(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sites'] })
      setModalModifierSite(false);
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(formData)
  };

  if (!site) return null;

  return (
    <div className="fixed inset-0 flex h-full justify-center items-center bg-black/60 z-[1000] backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-[520px] rounded-2xl shadow-xl border border-gray-100 overflow-hidden text-gray-800 animate-[fadeModalIn_250ms_ease-out]">

        {/* EN-TÊTE DU MODAL */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <HiServer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Modifier le Site</h3>
              <p className="text-xs text-gray-500">Mettre à jour les informations de la passerelle</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setModalModifierSite(false)}
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
          {/* Nom du site */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 block">
              Nom du Site <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <HiServer className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                required
                value={formData.designSite}
                onChange={(e) => setFormData({ ...formData, designSite: e.target.value })}
                className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Localisation */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 block">
              Localisation <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <HiLocationMarker className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                required
                value={formData.localisation}
                onChange={(e) => setFormData({ ...formData, localisation: e.target.value })}
                className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Équipements */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 block">
              Équipement(s) Déployé(s)
            </label>
            <div className="relative">
              <HiDesktopComputer className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={formData.equipement}
                onChange={(e) => setFormData({ ...formData, equipement: e.target.value })}
                className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Statut */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 block">Statut</label>
            <select
              value={formData.statut}
              onChange={(e) => setFormData({ ...formData, statut: e.target.value })}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            >
              <option value="en_ligne">En ligne</option>
              <option value="hors_ligne">Hors ligne</option>
            </select>
          </div>

          {/* Ville */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 block">Ville</label>
            <select
              value={formData.idVille}
              onChange={(e) => setFormData({ ...formData, idVille: parseInt(e.target.value) })}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            >
              <option value="1">Durba</option>
              <option value="2">Tshikapa</option>
              <option value="3">Misisi</option>
            </select>
          </div>

          {/* BOUTONS D'ACTION */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100 mt-6">
            <button
              type="button"
              onClick={() => setModalModifierSite(false)}
              disabled={isPending}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium text-sm hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
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