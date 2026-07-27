/* eslint-disable react/no-unescaped-entities */
'use client';

import React, { useState } from 'react';
import { 
  HiUser, 
  HiMail, 
  HiPhone, 
  HiShieldCheck, 
  HiKey, 
  HiSave, 
  HiCheck, 
  HiClock,
  HiLocationMarker
} from 'react-icons/hi';

export default function ProfilPage() {
  const [isSaved, setIsSaved] = useState(false);

  // État du formulaire Profil
  const [formData, setFormData] = useState({
    nom: 'Jean-Marc Ramazani',
    email: 'jm.ramazani@fizitech.com',
    telephone: '+243 810 000 001',
    role: 'Administrateur Principal',
    sitePrincipal: 'Site Central - Gombe',
  });

  // État du formulaire Sécurité
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* 1. EN-TÊTE DE LA PAGE */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mon Profil</h1>
        <p className="text-sm text-gray-500">
          Gérez vos informations personnelles, préférences de compte et paramètres de sécurité.
        </p>
      </div>

      {/* 2. CARTE D'EN-TÊTE PROFIL */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-center gap-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-emerald-600 text-white font-extrabold text-3xl flex items-center justify-center shadow-md">
            {formData.nom.split(' ').map(n => n[0]).join('')}
          </div>
          <span className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full" title="En ligne" />
        </div>

        <div className="space-y-1 text-center sm:text-left flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-center sm:justify-start">
            <h2 className="text-xl font-bold text-gray-900">{formData.nom}</h2>
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 w-fit mx-auto sm:mx-0">
              <HiShieldCheck className="w-4 h-4" />
              {formData.role}
            </span>
          </div>
          <p className="text-sm text-gray-500">{formData.email}</p>
          <div className="flex items-center justify-center sm:justify-start gap-4 text-xs text-gray-400 pt-1">
            <span className="flex items-center gap-1">
              <HiLocationMarker className="w-3.5 h-3.5 text-gray-400" />
              {formData.sitePrincipal}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <HiClock className="w-3.5 h-3.5 text-gray-400" />
              Session active
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 3. FORMULAIRE INFOS PERSONNELLES (2/3 de l'écran) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="border-b border-gray-100 pb-4">
              <h3 className="text-base font-bold text-gray-900">Informations Générales</h3>
              <p className="text-xs text-gray-500">Mettez à jour vos données de contact.</p>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">Nom Complet</label>
                  <div className="relative">
                    <HiUser className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={formData.nom}
                      onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">Adresse Email</label>
                  <div className="relative">
                    <HiMail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
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
                      onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">Site d'attachement</label>
                  <input
                    type="text"
                    disabled
                    value={formData.sitePrincipal}
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-xl text-sm text-gray-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                {isSaved && (
                  <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                    <HiCheck className="w-4 h-4" /> Modifications enregistrées !
                  </span>
                )}
                <button
                  type="submit"
                  className="ml-auto flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-colors shadow-sm"
                >
                  <HiSave className="w-4 h-4" />
                  <span>Enregistrer</span>
                </button>
              </div>
            </form>
          </div>

          {/* SÉCURITÉ & MOT DE PASSE */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="border-b border-gray-100 pb-4">
              <h3 className="text-base font-bold text-gray-900">Sécurité du compte</h3>
              <p className="text-xs text-gray-500">Changer votre mot de passe d'accès au HotSpot Admin.</p>
            </div>

            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">Mot de passe actuel</label>
                <div className="relative">
                  <HiKey className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">Nouveau mot de passe</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">Confirmer le mot de passe</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="pt-2 text-right">
                <button
                  type="button"
                  className="bg-gray-900 hover:bg-black text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-colors shadow-sm"
                >
                  Mettre à jour le mot de passe
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* 4. HISTORIQUE D'ACTIVITÉ (1/3 de l'écran) */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4 h-fit">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="text-base font-bold text-gray-900">Journal d'accès</h3>
            <p className="text-xs text-gray-500">Dernières connexions enregistrées</p>
          </div>

          <div className="space-y-4">
            {[
              { date: 'Aujourd\'hui, 14:32', ip: '192.168.88.105', device: 'Chrome / Windows', status: 'Succès' },
              { date: 'Hier, 09:15', ip: '192.168.88.105', device: 'Chrome / Mobile', status: 'Succès' },
              { date: '25 Juil 2026, 18:40', ip: '10.0.0.12', device: 'Firefox / Linux', status: 'Succès' },
            ].map((log, index) => (
              <div key={index} className="flex items-start gap-3 text-xs border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg shrink-0 mt-0.5">
                  <HiClock className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <p className="font-semibold text-gray-800">{log.date}</p>
                  <p className="text-gray-500">{log.device}</p>
                  <p className="font-mono text-[11px] text-gray-400">IP: {log.ip}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}