/* eslint-disable react/no-unescaped-entities */
'use client';

import { supprSite } from '@/app/services/sites/sitesService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { HiExclamation, HiX, HiTrash } from 'react-icons/hi';

interface SiteData {
  idSite: number;
  designSite: string;
  localisation: string;
  equipement: string;
  statut: string;
  idVille: number
}

interface SupprimerSiteProps {
  site: SiteData;
  setModalSupprimerSite: (value: boolean) => void;
}

export const SupprimerSite = ({
  site,
  setModalSupprimerSite,
}: SupprimerSiteProps) => {

  const queryClient = useQueryClient()

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: () => supprSite(site.idSite),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sites'] });
      setModalSupprimerSite(false);
    }
  })


  return (
    <div className="fixed inset-0 flex h-full justify-center items-center bg-black/60 z-[1000] backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-[440px] rounded-2xl shadow-xl border border-gray-100 overflow-hidden text-gray-800 animate-[fadeModalIn_250ms_ease-out]">

        {/* BOUTON FERMER EN HAUT À DROITE */}
        <div className="flex justify-end p-4 pb-0">
          <button
            type="button"
            onClick={() => setModalSupprimerSite(false)}
            aria-label="Fermer"
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <HiX className="w-5 h-5" />
          </button>
        </div>

        {/* CONTENU DE CONFIRMATION */}
        <div className="px-6 pb-6 text-center space-y-4">
          {/* Icône d'alerte */}
          <div className="mx-auto w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center border border-red-100 shadow-sm">
            <HiExclamation className="w-8 h-8" />
          </div>

          {isError && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-left text-xs font-medium text-red-600">
              {axios.isAxiosError(error)
                ? error.response?.data?.message || 'Erreur lors de la suppression.'
                : 'Une erreur inattendue est survenue.'}
            </div>
          )}

          {/* Titre et message */}
          <div className="space-y-1.5">
            <h3 className="text-lg font-bold text-gray-900">
              Supprimer ce site ?
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Êtes-vous sûr de vouloir supprimer le site{' '}
              <span className="font-semibold text-gray-800">"{site.designSite}"</span> ?
              Cette action est irréversible et retirera la passerelle de votre tableau de bord.
            </p>
          </div>

          {/* Rappel technique du site */}
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 text-left space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-400">Localisation :</span>
              <span className="text-gray-700 truncate max-w-[200px]">{site.localisation}</span>
            </div>
          </div>

          {/* BOUTONS D'ACTION */}
          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setModalSupprimerSite(false)}
              disabled={isPending}
              className="w-1/2 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium text-sm hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={() => mutate()}
              disabled={isPending}
              className="w-1/2 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium text-sm transition-colors shadow-sm"
            >
              <HiTrash className="w-4 h-4" />
              <span>Supprimer</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};