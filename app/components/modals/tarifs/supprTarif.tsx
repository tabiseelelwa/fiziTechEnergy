/* eslint-disable react/no-unescaped-entities */
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { HiExclamation, HiTrash, HiX } from 'react-icons/hi';
import { deleteTarif, TarifData } from '@/app/services/tarif/tarifService';

interface SupprimerTarifProps {
  setModalSupprimerTarif: (value: boolean) => void;
  tarif: TarifData;
}

export const SupprimerTarif = ({
  setModalSupprimerTarif,
  tarif,
}: SupprimerTarifProps) => {
  const queryClient = useQueryClient();

  // Mutation React Query pour la suppression
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: () => deleteTarif(tarif.codeTypeForfait),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tarifs'] });
      setModalSupprimerTarif(false);
    },
  });

  return (
    <div className="fixed inset-0 z-[1000] flex h-full items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-[440px] overflow-hidden rounded-2xl border border-gray-100 bg-white text-gray-800 shadow-xl">
        
        {/* BOUTON FERMER EN HAUT À DROITE */}
        <div className="flex justify-end p-4 pb-0">
          <button
            type="button"
            onClick={() => setModalSupprimerTarif(false)}
            aria-label="Fermer"
            className="rounded-xl p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
          >
            <HiX className="h-5 w-5" />
          </button>
        </div>

        {/* CONTENU DE CONFIRMATION */}
        <div className="space-y-4 px-6 pb-6 text-center">
          {/* Icône d'alerte */}
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-red-100 bg-red-50 text-red-600 shadow-sm">
            <HiExclamation className="h-8 w-8" />
          </div>

          {/* Affichage d'erreur en cas d'échec API */}
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
              Supprimer ce tarif ?
            </h3>
            <p className="text-xs leading-relaxed text-gray-500">
              Êtes-vous sûr de vouloir supprimer le forfait{' '}
              <span className="font-semibold text-gray-800">
                "{tarif.designation}"
              </span>{' '}
              ? Ce tarif ne sera plus disponible pour la génération de nouveaux tickets HotSpot.
            </p>
          </div>

          {/* Récapitulatif dynamique des données du tarif */}
          <div className="space-y-1.5 rounded-xl border border-gray-100 bg-gray-50 p-3 text-left text-xs">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Forfait :</span>
              <span className="font-semibold text-gray-800">
                {tarif.designation}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Durée :</span>
              <span className="text-gray-700">
                {tarif.dureeMinutes} min
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Prix :</span>
              <span className="font-mono font-bold text-red-600">
                {tarif.prixFC.toLocaleString('fr-FR')} FC
              </span>
            </div>
          </div>

          {/* BOUTONS D'ACTION */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              disabled={isPending}
              onClick={() => setModalSupprimerTarif(false)}
              className="w-1/2 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="button"
              disabled={isPending}
              onClick={() => mutate()}
              className="flex w-1/2 items-center justify-center gap-2 rounded-xl bg-red-600 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-red-700 disabled:opacity-50"
            >
              <HiTrash className="h-4 w-4" />
              <span>{isPending ? 'Suppression...' : 'Supprimer'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};