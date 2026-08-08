/* eslint-disable react/no-unescaped-entities */
'use client';

import { modifUser } from '@/app/services/utilisateur/userService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import React, { useState } from 'react';
import {
  HiX,
  HiUser,
  HiShieldCheck,
  HiOfficeBuilding
} from 'react-icons/hi';

export interface UtilisateurData {
  idUser: number;
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  designRole: string;
  designSite: string;
  idRole: number;
  idSite: number;
}

interface ModifierUtilisateurProps {
  user: UtilisateurData;
  setModalModifierUtilisateur: (value: boolean) => void;
}

export const ModifierUtilisateur = ({
  setModalModifierUtilisateur,
  user
}: ModifierUtilisateurProps) => {
  const [formData, setFormData] = useState<UtilisateurData>({
    idUser: user.idUser,
    nom: user.nom,
    prenom: user.prenom,
    telephone: user.telephone,
    email: user.email,
    designRole: user.designRole,
    designSite: user.designSite,
    idRole: user.idRole,
    idSite: user.idSite,
  });

  const queryClient = useQueryClient()

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: (data: UtilisateurData) => modifUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setModalModifierUtilisateur(false);
    }
  })
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(formData);
  };

  if (!user) return null;

  return (
    <div className="fixed inset-0 flex h-full justify-center items-center bg-black/60 z-[1000] backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-[520px] rounded-2xl shadow-xl border border-gray-100 overflow-hidden text-gray-800 animate-[fadeModalIn_250ms_ease-out]">

        {/* EN-TÊTE DU MODAL */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <HiUser className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Modifier l'Utilisateur</h3>
              <p className="text-xs text-gray-500">Mettre à jour le profil et les autorisations</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setModalModifierUtilisateur(false)}
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
          {/* Nom complet */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 block">
              Nom <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <HiUser className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                required
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 block">
              Prénom <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <HiUser className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                required
                value={formData.prenom}
                onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 block">Rôle d'accès</label>
            <div className="relative">
              <HiShieldCheck className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                value={formData.idRole}
                onChange={(e) =>
                  setFormData({ ...formData, idRole: Number(e.target.value) })
                }
                className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              >
                <option value={1}>Admin</option>
                <option value={2}>Gérant</option>
                <option value={3}>Caissier</option>
              </select>
            </div>
          </div>

          {/* Site Affecté */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 block">Site Affecté</label>
            <div className="relative">
              <HiOfficeBuilding className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                value={formData.idSite}
                onChange={(e) =>
                  setFormData({ ...formData, idSite: Number(e.target.value) })
                }
                className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              >
                <option value={1}>Durba</option>
                <option value={2}>Tshikapa</option>
                <option value={3}>Misisi</option>
              </select>
            </div>
          </div>

          {/* BOUTONS D'ACTION */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100 mt-6">
            <button
              type="button"
              disabled={isPending}
              onClick={() => setModalModifierUtilisateur(false)}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium text-sm hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm transition-colors shadow-sm"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};