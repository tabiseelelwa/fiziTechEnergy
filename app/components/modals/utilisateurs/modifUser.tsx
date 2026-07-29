/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react/no-unescaped-entities */
'use client';

import React, { useState, useEffect } from 'react';
import {
  HiX,
  HiUser,
  HiMail,
  HiPhone,
  HiShieldCheck,
  HiLockClosed,
  HiOfficeBuilding
} from 'react-icons/hi';

export interface UtilisateurData {
  id: number;
  nom: string;
  email: string;
  telephone: string;
  role: 'Admin' | 'Gérant' | 'Caissier';
  siteAttribue: string;
  statut: 'actif' | 'inactif';
  derniereConnexion: string;
}

interface ModifierUtilisateurProps {
  utilisateur: UtilisateurData | null;
  setModalModifierUtilisateur: (value: boolean) => void;
  onUserUpdated?: (updatedUser: UtilisateurData) => void;
}

export const ModifierUtilisateur = ({
  utilisateur,
  setModalModifierUtilisateur,
  onUserUpdated,
}: ModifierUtilisateurProps) => {
  const [formData, setFormData] = useState<UtilisateurData>({
    id: 0,
    nom: '',
    email: '',
    telephone: '',
    role: 'Caissier',
    siteAttribue: '',
    statut: 'actif',
    derniereConnexion: '',
  });

  const [password, setPassword] = useState('');

  useEffect(() => {
    if (utilisateur) {
      setFormData({ ...utilisateur });
      setPassword('');
    }
  }, [utilisateur]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (onUserUpdated) {
      onUserUpdated(formData);
    }

    if (password) {
      console.log(`Nouveau mot de passe défini pour l'utilisateur ${formData.id}`);
    }

    setModalModifierUtilisateur(false);
  };

  if (!utilisateur) return null;

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
          {/* Nom complet */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 block">
              Nom complet <span className="text-red-500">*</span>
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

          {/* Email & Téléphone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 block">
                Adresse Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <HiMail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 block">Téléphone</label>
              <div className="relative">
                <HiPhone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  placeholder="+243..."
                  value={formData.telephone}
                  onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                  className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>

          {/* Rôle & Statut */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 block">Rôle d'accès</label>
              <div className="relative">
                <HiShieldCheck className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value as UtilisateurData['role'] })
                  }
                  className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                >
                  <option value="Admin">Admin</option>
                  <option value="Gérant">Gérant</option>
                  <option value="Caissier">Caissier</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 block">Statut du compte</label>
              <select
                value={formData.statut}
                onChange={(e) =>
                  setFormData({ ...formData, statut: e.target.value as UtilisateurData['statut'] })
                }
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              >
                <option value="actif">Actif</option>
                <option value="inactif">Inactif</option>
              </select>
            </div>
          </div>

          {/* Site Affecté */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 block">Site Affecté</label>
            <div className="relative">
              <HiOfficeBuilding className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={formData.siteAttribue}
                onChange={(e) => setFormData({ ...formData, siteAttribue: e.target.value })}
                className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Nouveau mot de passe (Optionnel) */}
          <div className="space-y-1.5 pt-2 border-t border-gray-100">
            <label className="text-xs font-semibold text-gray-700 block">
              Nouveau mot de passe <span className="text-gray-400 font-normal">(Laisser vide pour garder l'actuel)</span>
            </label>
            <div className="relative">
              <HiLockClosed className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* BOUTONS D'ACTION */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100 mt-6">
            <button
              type="button"
              onClick={() => setModalModifierUtilisateur(false)}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium text-sm hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
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