/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import {
  HiUser,
  HiMail,
  HiPhone,
  HiShieldCheck,
  HiKey,
  HiSave,
  HiCheck,
  HiClock,
  HiLocationMarker,
  HiExclamationCircle,
} from 'react-icons/hi';

interface UserProfile {
  idUser?: number | string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  designRole: string;
  designSite: string;
}

export default function ProfilPage() {
  const queryClient = useQueryClient();

  // Messages de retour UI
  const [profileSuccessMsg, setProfileSuccessMsg] = useState(false);
  const [passwordSuccessMsg, setPasswordSuccessMsg] = useState(false);
  const [passwordErrorMsg, setPasswordErrorMsg] = useState('');

  // États locaux des formulaires
  const [formData, setFormData] = useState<UserProfile>({
    nom: '',
    email: '',
    prenom: '',
    telephone: '',
    designRole: '',
    designSite: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // 1. Récupération du profil utilisateur via React Query
  const { data: userProfile, isLoading: isUserLoading } = useQuery<UserProfile>({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const res = await axios.get('/api/users/profile');
      return res.data.user || res.data;
    },
  });


  // Remplissage initial des champs du formulaire lorsque les données sont chargées
  useEffect(() => {
    if (userProfile) {
      setFormData({
        nom: userProfile.nom || '',
        email: userProfile.email || '',
        prenom: userProfile.prenom || '',
        telephone: userProfile.telephone || '',
        designRole: userProfile.designRole || 'Utilisateur',
        designSite: userProfile.designSite || 'Non spécifié',
      });
    }
  }, [userProfile]);

  // 3. Mutation pour la mise à jour des informations de profil
  const updateProfileMutation = useMutation({
    mutationFn: async (updatedData: Partial<UserProfile>) => {
      const res = await axios.put('/api/users/profile', updatedData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      setProfileSuccessMsg(true);
      setTimeout(() => setProfileSuccessMsg(false), 2000);
    },
  });

  // 4. Mutation pour le changement de mot de passe
  const updatePasswordMutation = useMutation({
    mutationFn: async (payload: typeof passwordData) => {
      const res = await axios.post('/api/users/change-password', payload);
      return res.data;
    },
    onSuccess: () => {
      setPasswordSuccessMsg(true);
      setPasswordErrorMsg('');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setPasswordSuccessMsg(false), 2000);
    },
    onError: (err: any) => {
      setPasswordErrorMsg(
        err.response?.data?.message || 'Une erreur est survenue lors du changement de mot de passe.'
      );
    },
  });

  // Gestion de la soumission du profil
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate({
      nom: formData.nom,
      prenom: formData.prenom,
      email: formData.email,
      telephone: formData.telephone,
    });
  };

  // Gestion de la soumission du mot de passe
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordErrorMsg('');

    if (!passwordData.currentPassword) {
      setPasswordErrorMsg('Veuillez saisir votre mot de passe actuel.');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setPasswordErrorMsg('Le nouveau mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordErrorMsg('Les nouveaux mots de passe ne correspondent pas.');
      return;
    }

    updatePasswordMutation.mutate(passwordData);
  };

  // Génération des initiales pour l'avatar
  const getInitials = (name: string) => {
    if (!name.trim()) return 'U';
    return name
      .trim()
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (isUserLoading) {
    return (
      <div className="flex justify-center items-center py-20 text-gray-500 text-sm">
        Chargement des informations du profil...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* 1. EN-TÊTE DE LA PAGE */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mon Profil</h1>
        <p className="text-sm text-gray-500 mt-1">
          Gérez vos informations personnelles, préférences de compte et paramètres de sécurité.
        </p>
      </div>

      {/* 2. CARTE D'EN-TÊTE PROFIL */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm flex flex-col sm:flex-row items-center gap-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-emerald-600 text-white font-extrabold text-3xl flex items-center justify-center shadow-md">
            {getInitials(formData.nom)}
          </div>
          <span
            className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full"
            title="En ligne"
          />
        </div>

        <div className="space-y-1 text-center sm:text-left flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-center sm:justify-start">
            <h2 className="text-xl font-bold text-gray-900">{formData.nom || 'Utilisateur'}</h2>
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 w-fit mx-auto sm:mx-0">
              <HiShieldCheck className="w-4 h-4" />
              {formData.designRole}
            </span>
          </div>
          <p className="text-sm text-gray-500">{formData.email}</p>
          <div className="flex items-center justify-center sm:justify-start gap-4 text-xs text-gray-400 pt-1">
            <span className="flex items-center gap-1">
              <HiLocationMarker className="w-3.5 h-3.5 text-gray-400" />
              {formData.designSite}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <HiClock className="w-3.5 h-3.5 text-gray-400" />
              Session active
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 3. FORMULAIRES (2/3 de l'écran) */}
        <div className="lg:col-span-2 space-y-6">
          {/* INFORMATIONS GÉNÉRALES */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm space-y-6">
            <div className="border-b border-gray-100 pb-4">
              <h3 className="text-base font-bold text-gray-900">Informations Générales</h3>
              <p className="text-xs text-gray-500">Mettez à jour vos données de contact.</p>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">Nom</label>
                  <div className="relative">
                    <HiUser className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={formData.nom}
                      onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">Prénom</label>
                  <div className="relative">
                    <HiUser className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={formData.prenom}
                      onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">Adresse Email</label>
                  <div className="relative">
                    <HiMail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">Role</label>
                  <div className="relative">
                    <HiMail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      required
                      disabled
                      value={formData.designRole}
                      className="w-full pl-9 pr-3 py-2 bg-gray-100 border border-gray-200 rounded-lg cursor-not-allowed text-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">Téléphone</label>
                  <div className="relative">
                    <HiPhone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={formData.telephone}
                      disabled
                      onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">Site d'attachement</label>
                  <div className="relative">
                    <HiLocationMarker className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      disabled
                      value={formData.designSite}
                      className="w-full pl-9 px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-500 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                {profileSuccessMsg && (
                  <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                    <HiCheck className="w-4 h-4" /> Modifications enregistrées !
                  </span>
                )}
                <button
                  type="submit"
                  disabled={updateProfileMutation.isPending}
                  className="ml-auto flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-colors shadow-sm"
                >
                  <HiSave className="w-4 h-4" />
                  <span>
                    {updateProfileMutation.isPending ? 'Enregistrement...' : 'Enregistrer'}
                  </span>
                </button>
              </div>
            </form>
          </div>

          {/* SÉCURITÉ & MOT DE PASSE */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm space-y-6">
            <div className="border-b border-gray-100 pb-4">
              <h3 className="text-base font-bold text-gray-900">Sécurité du compte</h3>
              <p className="text-xs text-gray-500">
                Changer votre mot de passe d'accès au HotSpot Admin.
              </p>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              {passwordErrorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600 flex items-center gap-2">
                  <HiExclamationCircle className="w-4 h-4 shrink-0" />
                  <span>{passwordErrorMsg}</span>
                </div>
              )}

              {passwordSuccessMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-600 flex items-center gap-2">
                  <HiCheck className="w-4 h-4 shrink-0" />
                  <span>Mot de passe mis à jour avec succès !</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">Mot de passe actuel</label>
                <div className="relative">
                  <HiKey className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, currentPassword: e.target.value })
                    }
                    className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">
                    Nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, newPassword: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">
                    Confirmer le mot de passe
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="pt-2 text-right">
                <button
                  type="submit"
                  disabled={updatePasswordMutation.isPending}
                  className="bg-gray-900 hover:bg-black disabled:bg-gray-600 text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-colors shadow-sm"
                >
                  {updatePasswordMutation.isPending
                    ? 'Mise à jour...'
                    : 'Mettre à jour le mot de passe'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}