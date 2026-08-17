/* eslint-disable react/no-unescaped-entities */
'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  HiPlus,
  HiPencil,
  HiTrash,
  HiUserGroup,
  HiShieldCheck,
  HiSearch,
  HiFilter,
  HiKey,
} from 'react-icons/hi';
import { BeatLoader } from 'react-spinners';

import { getUsers, UserData } from '@/app/services/utilisateur/userService';

import { ModifierUtilisateur } from '@/app/components/modals/utilisateurs/modifUser';
import { SupprimerUtilisateur } from '@/app/components/modals/utilisateurs/supprUser';
import { AjouterUtilisateur } from '@/app/components/modals/utilisateurs/ajoutUser';
import RoleGuard from '@/app/components/RoleGuard';

export default function UtilisateursPage() {

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('tous');

  // Modals
  const [modalAjoutUser, setModalAjoutUser] = useState<boolean>(false);
  const [modalModifUser, setModalModifUser] = useState<boolean>(false);
  const [userAEditer, setUserAEditer] = useState<UserData | null>(null);

  const [modalSupprUser, setModalSupprUser] = useState<boolean>(false);
  const [userASupprimer, setUserASupprimer] = useState<UserData | null>(null);

  // 1. CHARGEMENT DES DONNÉES VIA REACT-QUERY
  const { data: utilisateurs = [], isLoading, isError, error } = useQuery<UserData[]>({
    queryKey: ['users'],
    queryFn: getUsers,
  });

  // Handlers Modals
  const handleEditClick = (u: UserData) => {
    setUserAEditer(u);
    setModalModifUser(true);
  };

  const handleDeleteClick = (u: UserData) => {
    setUserASupprimer(u);
    setModalSupprUser(true);
  };

  // Filtrage des utilisateurs
  const filteredUtilisateurs = utilisateurs.filter((u) => {
    const matchesSearch =
      u.nom?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.telephone?.includes(search);

    const matchesRole =
      roleFilter === 'tous' ||
      u.designRole?.toLowerCase() === roleFilter.toLowerCase();

    return matchesSearch && matchesRole;
  });

  return (
    <RoleGuard allowedRoles={['Admin', 'Gerant']}>
      <div className="space-y-6">

        {/* MODAL D'AJOUT */}
        {modalAjoutUser && (
          <AjouterUtilisateur
            setModalAjouterUtilisateur={setModalAjoutUser}
          />
        )}

        {/* MODAL DE MODIFICATION */}
        {modalModifUser && userAEditer && (
          <ModifierUtilisateur
            user={userAEditer}
            setModalModifierUtilisateur={setModalModifUser}
          />
        )}

        {/* MODAL DE SUPPRESSION */}
        {modalSupprUser && userASupprimer && (
          <SupprimerUtilisateur
            utilisateur={userASupprimer}
            setModalSupprimerUtilisateur={setModalSupprUser}
          />
        )}

        {/* 1. EN-TÊTE DE LA PAGE */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Utilisateurs</h1>
            <p className="text-sm text-gray-500 mt-1">
              Gérez les accès du personnel, attribuez les rôles et contrôlez les permissions.
            </p>
          </div>

          <button
            className="flex items-center cursor-pointer justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg font-medium text-sm transition-colors shadow-sm"
            onClick={() => setModalAjoutUser(true)}
          >
            <HiPlus className="w-5 h-5" />
            <span>Nouvel Utilisateur</span>
          </button>
        </div>

        {/* 2. STATISTIQUES RAPIDES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Administrateurs</p>
              <p className="text-2xl font-extrabold text-purple-600 mt-1">
                {utilisateurs.filter((u) => u.designRole === 'Admin').length}
              </p>
            </div>
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
              <HiShieldCheck className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* 3. RECHERCHE ET FILTRES */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row gap-3 justify-between items-center">
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

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <HiFilter className="w-4 h-4 text-gray-400 hidden sm:block" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="tous">Tous les rôles</option>
              <option value="admin">Administrateurs</option>
              <option value="gerant">Gérants</option>
              <option value="caissier">Caissiers</option>
            </select>
          </div>
        </div>

        {/* GESTION DES ERREURS D'APPELLATION API */}
        {isError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            Erreur lors du chargement des utilisateurs : {(error as Error).message}
          </div>
        )}

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
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr key={0}>
                    <td colSpan={4} className="py-12 text-center">
                      <BeatLoader color="#059669" size={10} />
                      <p className="text-xs text-gray-400 mt-2">Chargement des données...</p>
                    </td>
                  </tr>
                ) : filteredUtilisateurs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-sm text-gray-400">
                      Aucun utilisateur ne correspond à votre recherche.
                    </td>
                  </tr>
                ) : (
                  filteredUtilisateurs.map((u, i) => (
                    <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 font-bold text-sm flex items-center justify-center shrink-0">
                            {u.nom ? u.nom.charAt(0).toUpperCase() : '?'}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{u.nom} {u.prenom}</div>
                            <div className="text-xs text-gray-400">{u.email} • {u.telephone}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${u.designRole === 'Admin'
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : u.designRole === 'Gérant'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-gray-100 text-gray-700 border border-gray-200'
                          }`}>
                          {u.designRole || 'Non attribué'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-xs font-medium text-gray-700">
                        {u.designSite || 'Non affecté'}
                      </td>

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
                            onClick={() => handleEditClick(u)}
                          >
                            <HiPencil className="w-4 h-4" />
                          </button>
                          <button
                            title="Supprimer"
                            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            onClick={() => handleDeleteClick(u)}
                          >
                            <HiTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}