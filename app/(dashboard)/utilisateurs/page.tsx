/* eslint-disable react/no-unescaped-entities */
'use client';

import React, { useState } from 'react';
import { 
  HiPlus, 
  HiPencil, 
  HiTrash, 
  HiUserGroup, 
  HiShieldCheck, 
  HiSearch,
  HiFilter,
  HiKey,
  HiCheckCircle,
  // HiXCircle
} from 'react-icons/hi';

interface Utilisateur {
  id: number;
  nom: string;
  email: string;
  telephone: string;
  role: 'Admin' | 'Gérant' | 'Caissier';
  siteAttribue: string;
  statut: 'actif' | 'inactif';
  derniereConnexion: string;
}

export default function UtilisateursPage() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('tous');

  // Exemples d'utilisateurs
  const [utilisateurs] = useState<Utilisateur[]>([
    {
      id: 1,
      nom: 'Jean-Marc Ramazani',
      email: 'jm.ramazani@fizitech.com',
      telephone: '+243 810 000 001',
      role: 'Admin',
      siteAttribue: 'Tous les sites',
      statut: 'actif',
      derniereConnexion: 'Aujourd\'hui à 14:32',
    },
    {
      id: 2,
      nom: 'Patrick Kabeya',
      email: 'p.kabeya@fizitech.com',
      telephone: '+243 990 123 456',
      role: 'Gérant',
      siteAttribue: 'Site Central - Gombe',
      statut: 'actif',
      derniereConnexion: 'Aujourd\'hui à 10:15',
    },
    {
      id: 3,
      nom: 'Sarah Ilunga',
      email: 's.ilunga@fizitech.com',
      telephone: '+243 850 987 654',
      role: 'Caissier',
      siteAttribue: 'Agence Victoire',
      statut: 'actif',
      derniereConnexion: 'Hier à 18:00',
    },
    {
      id: 4,
      nom: 'Alain Tshilombo',
      email: 'a.tshilombo@fizitech.com',
      telephone: '+243 820 456 789',
      role: 'Caissier',
      siteAttribue: 'Agence Kintambo',
      statut: 'inactif',
      derniereConnexion: 'Il y a 5 jours',
    },
  ]);

  // Filtrage des utilisateurs
  const filteredUtilisateurs = utilisateurs.filter((u) => {
    const matchesSearch = 
      u.nom.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.telephone.includes(search);
    
    const matchesRole = roleFilter === 'tous' || u.role.toLowerCase() === roleFilter.toLowerCase();

    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* 1. EN-TÊTE DE LA PAGE */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
          <p className="text-sm text-gray-500 mt-4">
            Gérez les accès du personnel, attribuez les rôles et contrôlez les permissions.
          </p>
        </div>

        <button className="flex items-center cursor-pointer justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg font-medium text-sm transition-colors shadow-sm">
          <HiPlus className="w-5 h-5" />
          <span>Nouvel Utilisateur</span>
        </button>
      </div>

      {/* 2. STATISTIQUES RAPIDES */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Comptes</p>
            <p className="text-2xl font-extrabold text-gray-900 mt-1">{utilisateurs.length}</p>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <HiUserGroup className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Comptes Actifs</p>
            <p className="text-2xl font-extrabold text-emerald-600 mt-1">
              {utilisateurs.filter((u) => u.statut === 'actif').length}
            </p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <HiCheckCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Administrateurs</p>
            <p className="text-2xl font-extrabold text-purple-600 mt-1">
              {utilisateurs.filter((u) => u.role === 'Admin').length}
            </p>
          </div>
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <HiShieldCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 3. BARRE DE RECHERCHE ET FILTRES */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row gap-3 justify-between items-center">
        {/* Champ de recherche */}
        <div className="relative w-full sm:w-80">
          <HiSearch className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par nom, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
          />
        </div>

        {/* Filtre de Rôle */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <HiFilter className="w-4 h-4 text-gray-400 hidden sm:block" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="tous">Tous les rôles</option>
            <option value="admin">Administrateurs</option>
            <option value="gérant">Gérants</option>
            <option value="caissier">Caissiers</option>
          </select>
        </div>
      </div>

      {/* 4. TABLEAU DES UTILISATEURS */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900">Membres de l'équipe</h2>
          <span className="text-xs text-gray-500">{filteredUtilisateurs.length} utilisateur(s) trouvé(s)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-500 uppercase text-[11px] font-semibold tracking-wider border-b border-gray-100">
              <tr>
                <th className="py-3.5 px-4">Utilisateur</th>
                <th className="py-3.5 px-4">Rôle</th>
                <th className="py-3.5 px-4">Site Affecté</th>
                <th className="py-3.5 px-4">Dernière Connexion</th>
                <th className="py-3.5 px-4">Statut</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUtilisateurs.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                  {/* Nom & Contact */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 font-bold text-sm flex items-center justify-center shrink-0">
                        {u.nom.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{u.nom}</div>
                        <div className="text-xs text-gray-400">{u.email} • {u.telephone}</div>
                      </div>
                    </div>
                  </td>

                  {/* Rôle Badge */}
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${
                      u.role === 'Admin'
                        ? 'bg-purple-50 text-purple-700 border border-purple-200'
                        : u.role === 'Gérant'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-gray-100 text-gray-700 border border-gray-200'
                    }`}>
                      {u.role}
                    </span>
                  </td>

                  {/* Site */}
                  <td className="py-3.5 px-4 text-xs font-medium text-gray-700">
                    {u.siteAttribue}
                  </td>

                  {/* Dernière connexion */}
                  <td className="py-3.5 px-4 text-xs text-gray-500">
                    {u.derniereConnexion}
                  </td>

                  {/* Statut */}
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      u.statut === 'actif'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-red-50 text-red-600 border border-red-200'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${u.statut === 'actif' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                      {u.statut === 'actif' ? 'Actif' : 'Inactif'}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button 
                        title="Réinitialiser le mot de passe"
                        className="p-1.5 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                      >
                        <HiKey className="w-4 h-4" />
                      </button>
                      <button 
                        title="Modifier"
                        className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <HiPencil className="w-4 h-4" />
                      </button>
                      <button 
                        title="Supprimer"
                        className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <HiTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredUtilisateurs.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-sm text-gray-400">
                    Aucun utilisateur ne correspond à votre recherche.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}