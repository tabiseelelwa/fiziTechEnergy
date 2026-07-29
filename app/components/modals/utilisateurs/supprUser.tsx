/* eslint-disable react/no-unescaped-entities */
'use client';

import { HiExclamation, HiX } from 'react-icons/hi';
import { UtilisateurData } from './modifUser';

interface SupprimerUtilisateurProps {
  utilisateur: UtilisateurData | null;
  setModalSupprimerUtilisateur: (value: boolean) => void;
  onUserDeleted: (userId: number) => void;
}

export const SupprimerUtilisateur = ({
  utilisateur,
  setModalSupprimerUtilisateur,
  onUserDeleted,
}: SupprimerUtilisateurProps) => {
  if (!utilisateur) return null;

  const handleConfirmDelete = () => {
    onUserDeleted(utilisateur.id);
    setModalSupprimerUtilisateur(false);
  };

  return (
    <div className="fixed inset-0 flex h-full justify-center items-center bg-black/60 z-[1000] backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-[440px] rounded-2xl shadow-xl border border-gray-100 overflow-hidden text-gray-800 animate-[fadeModalIn_250ms_ease-out]">

        {/* EN-TÊTE */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-red-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-red-100 text-red-600 rounded-xl">
              <HiExclamation className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Supprimer l'Utilisateur</h3>
              <p className="text-xs text-gray-500">Action irréversible</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setModalSupprimerUtilisateur(false)}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 rounded-xl transition-colors"
          >
            <HiX className="w-5 h-5" />
          </button>
        </div>

        {/* CONTENU */}
        <div className="p-6 text-left space-y-4">
          <p className="text-sm text-gray-600 leading-relaxed">
            Êtes-vous sûr de vouloir supprimer le compte de{' '}
            <span className="font-bold text-gray-900">{utilisateur.nom}</span> ({utilisateur.email}) ?
          </p>

          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
            ⚠️ Cet utilisateur n'aura plus accès à la plateforme et à son site affecté (<span className="font-semibold">{utilisateur.siteAttribue}</span>).
          </div>

          {/* BOUTONS D'ACTION */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-gray-100 mt-4">
            <button
              type="button"
              onClick={() => setModalSupprimerUtilisateur(false)}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium text-sm hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={handleConfirmDelete}
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium text-sm transition-colors shadow-sm"
            >
              Confirmer la suppression
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};