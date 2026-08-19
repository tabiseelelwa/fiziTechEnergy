/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  HiPlus,
  HiPencil,
  HiTrash,
  HiUserGroup,
  HiShieldCheck,
  HiSearch,
  HiFilter,
  HiKey,
  HiBriefcase,
  HiCurrencyDollar,
  HiExclamationCircle,
} from 'react-icons/hi';
import { BeatLoader } from 'react-spinners';

import { getUsers, resetUserPassword, UserData } from '@/app/services/utilisateur/userService';

import { ModifierUtilisateur } from '@/app/components/modals/utilisateurs/modifUser';
import { SupprimerUtilisateur } from '@/app/components/modals/utilisateurs/supprUser';
import { AjouterUtilisateur } from '@/app/components/modals/utilisateurs/ajoutUser';
import RoleGuard from '@/app/components/RoleGuard';

export default function UtilisateursPage() {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('tous');

  // Modals
  const [modalAjoutUser, setModalAjoutUser] = useState<boolean>(false);
  const [modalModifUser, setModalModifUser] = useState<boolean>(false);
  const [userAEditer, setUserAEditer] = useState<UserData | null>(null);

  const [modalSupprUser, setModalSupprUser] = useState<boolean>(false);
  const [userASupprimer, setUserASupprimer] = useState<UserData | null>(null);

  // Modal de réinitialisation du mot de passe
  const [userAReset, setUserAReset] = useState<UserData | null>(null);
  const [modalResetPass, setModalResetPass] = useState<boolean>(false);

  // 1. CHARGEMENT DES DONNÉES
  const { data: utilisateurs = [], isLoading, isError, error } = useQuery<UserData[]>({
    queryKey: ['users'],
    queryFn: getUsers,
  });

  // 2. MUTATION AXIOS POUR RÉINITIALISER LE MOT DE PASSE
  const resetPasswordMutation = useMutation({
    mutationFn: (idUser: number | string) => resetUserPassword(idUser),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setModalResetPass(false);
      setUserAReset(null);
      alert('Le mot de passe a été réinitialisé à "12345" avec succès.');
    },
    onError: (err: any) => {
      const errorMessage = err.response?.data?.message || err.message || 'Erreur lors de la réinitialisation';
      alert(`Erreur : ${errorMessage}`);
    },
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

  const handleResetClick = (u: UserData) => {
    setUserAReset(u);
    setModalResetPass(true);
  };

  const handleConfirmReset = () => {
    if (userAReset && userAReset.idUser) {
      resetPasswordMutation.mutate(userAReset.idUser);
    }
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
      <div className="space-y-4">

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

        {/* MODAL DE CONFIRMATION : RÉINITIALISATION DU MOT DE PASSE */}
        {modalResetPass && userAReset && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl border border-gray-100 animate-in fade-in zoom-in duration-200">
              <div className="flex items-center gap-3 text-amber-600 mb-3">
                <HiExclamationCircle className="w-7 h-7" />
                <h3 className="text-lg font-bold text-gray-900">Réinitialiser le mot de passe</h3>
              </div>
              <p className="text-sm text-gray-600 mb-6">
                Voulez-vous vraiment réinitialiser le mot de passe de{' '}
                <span className="font-semibold text-gray-900">{userAReset.nom} {userAReset.prenom}</span> ?
                <br />
                Le nouveau mot de passe par défaut sera : <code className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-200 font-mono font-bold">12345</code>
              </p>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalResetPass(false)}
                  disabled={resetPasswordMutation.isPending}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleConfirmReset}
                  disabled={resetPasswordMutation.isPending}
                  className="px-4 py-2 text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                >
                  {resetPasswordMutation.isPending ? (
                    <>
                      <BeatLoader color="#ffffff" size={6} />
                      <span>Réinitialisation...</span>
                    </>
                  ) : (
                    <span>Réinitialiser à '12345'</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* EN-TÊTE DE LA PAGE */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
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

        {/* STATISTIQUES RAPIDES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Comptes</p>
              <p className="text-2xl font-extrabold text-gray-900 mt-1">{utilisateurs.length}</p>
            </div>
            <div className="p-3 bg-gray-100 text-gray-600 rounded-xl">
              <HiUserGroup className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Administrateurs</p>
              <p className="text-2xl font-extrabold text-purple-600 mt-1">
                {utilisateurs.filter((u) => u.designRole?.toLowerCase() === 'admin').length}
              </p>
            </div>
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
              <HiShieldCheck className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Gérants</p>
              <p className="text-2xl font-extrabold text-blue-600 mt-1">
                {utilisateurs.filter((u) => u.designRole?.toLowerCase() === 'gerant').length}
              </p>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <HiBriefcase className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Caissiers</p>
              <p className="text-2xl font-extrabold text-emerald-600 mt-1">
                {utilisateurs.filter((u) => u.designRole?.toLowerCase() === 'caissier').length}
              </p>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <HiCurrencyDollar className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* RECHERCHE ET FILTRES */}
        <div className="bg-white border border-gray-200 rounded-2xl p-1.5 shadow-sm flex flex-col sm:flex-row gap-3 justify-between items-center">
          <div className="relative w-full sm:w-80">
            <HiSearch className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par nom, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-1 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <HiFilter className="w-4 h-4 text-gray-400 hidden sm:block" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full sm:w-auto px-3 py-1 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="tous">Tous les rôles</option>
              <option value="admin">Administrateurs</option>
              <option value="gerant">Gérants</option>
              <option value="caissier">Caissiers</option>
            </select>
          </div>
        </div>

        {/* ERREURS API */}
        {isError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            Erreur lors du chargement des utilisateurs : {(error as Error).message}
          </div>
        )}

        {/* TABLEAU DES UTILISATEURS AVEC SCROLLBAR RÉDUITE */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-900">Membres de l'équipe</h2>
            <span className="text-xs text-gray-500">{filteredUtilisateurs.length} utilisateur(s) trouvé(s)</span>
          </div>

          <div className="overflow-x-auto max-h-[280px] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full">
            <table className="w-full text-left text-sm text-gray-600 border-collapse">
              <thead className="bg-gray-50 text-gray-500 uppercase text-[11px] font-semibold tracking-wider border-b border-gray-100 sticky top-0 z-10">
                <tr>
                  <th className="py-2.5 px-4 bg-gray-50">Utilisateur</th>
                  <th className="py-2.5 px-4 bg-gray-50">Rôle</th>
                  <th className="py-2.5 px-4 bg-gray-50">Site Affecté</th>
                  <th className="py-2.5 px-4 text-right bg-gray-50">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr>
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
                  filteredUtilisateurs.map((u) => {
                    const roleLower = u.designRole?.toLowerCase() || '';
                    return (
                      <tr key={u.idUser} className="hover:bg-gray-50/50 transition-colors h-[52px]">
                        <td className="py-2 px-4">
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

                        <td className="py-2 px-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${
                            roleLower === 'admin'
                              ? 'bg-purple-50 text-purple-700 border border-purple-200'
                              : roleLower === 'gerant'
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : 'bg-gray-100 text-gray-700 border border-gray-200'
                          }`}>
                            {u.designRole || 'Non attribué'}
                          </span>
                        </td>

                        <td className="py-2 px-4 text-xs font-medium text-gray-700">
                          {u.designSite || 'Non affecté'}
                        </td>

                        <td className="py-2 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              title="Réinitialiser le mot de passe"
                              className="p-1.5 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                              onClick={() => handleResetClick(u)}
                            >
                              <HiKey className="w-4 h-4" />
                            </button>
                            <button
                              title="Modifier"
                              className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                              onClick={() => handleEditClick(u)}
                            >
                              <HiPencil className="w-4 h-4" />
                            </button>
                            <button
                              title="Supprimer"
                              className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              onClick={() => handleDeleteClick(u)}
                            >
                              <HiTrash className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}