/* eslint-disable react/no-unescaped-entities */
'use client';

import React, { useState } from 'react';
import {
    HiX,
    HiUser,
    HiMail,
    HiPhone,
    HiShieldCheck,
    HiOfficeBuilding,
    HiUserAdd,
} from 'react-icons/hi';
import { UtilisateurData } from './modifUser';

interface AjouterUtilisateurProps {
    setModalAjouterUtilisateur: (value: boolean) => void;
    onUserAdded: (newUser: UtilisateurData) => void;
}

export const AjouterUtilisateur = ({
    setModalAjouterUtilisateur,
    onUserAdded,
}: AjouterUtilisateurProps) => {
    const [formData, setFormData] = useState<Omit<UtilisateurData, 'id' | 'derniereConnexion'>>({
        nom: '',
        email: '',
        telephone: '',
        role: 'Caissier',
        siteAttribue: '',
        statut: 'actif',
    });

    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const newUser: UtilisateurData = {
            ...formData,
            id: Date.now(),
            derniereConnexion: 'Jamais connecté',
        };

        onUserAdded(newUser);
        setModalAjouterUtilisateur(false);
    };

    return (
        <div className="fixed inset-0 flex h-full justify-center items-center bg-black/60 z-[1000] backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-white w-full max-w-[540px] rounded-2xl shadow-xl border border-gray-100 overflow-hidden text-gray-800 animate-[fadeModalIn_250ms_ease-out]">

                {/* EN-TÊTE DU MODAL */}
                <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                            <HiUserAdd className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-gray-900">Nouvel Utilisateur</h3>
                            <p className="text-xs text-gray-500">Créez un nouveau compte et configurez ses accès</p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => setModalAjouterUtilisateur(false)}
                        aria-label="Fermer"
                        className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 rounded-xl transition-colors"
                    >
                        <HiX className="w-5 h-5" />
                    </button>
                </div>

                {/* FORMULAIRE */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4 text-left">

                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">
                            {error}
                        </div>
                    )}

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
                                placeholder="ex: Jean-Marc Ramazani"
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
                                    placeholder="nom@domaine.com"
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

                    </div>

                    {/* Site Affecté */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-700 block">
                            Site Affecté <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <HiOfficeBuilding className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                required
                                placeholder="ex: Agence Central / Gombe"
                                value={formData.siteAttribue}
                                onChange={(e) => setFormData({ ...formData, siteAttribue: e.target.value })}
                                className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                            />
                        </div>
                    </div>

                    {/* BOUTONS D'ACTION */}
                    <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100 mt-6">
                        <button
                            type="button"
                            onClick={() => setModalAjouterUtilisateur(false)}
                            className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium text-sm hover:bg-gray-50 transition-colors"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm transition-colors shadow-sm"
                        >
                            Créer l'utilisateur
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};