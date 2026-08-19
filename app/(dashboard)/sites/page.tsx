/* eslint-disable react/no-unescaped-entities */
'use client';

import { AjoutSite } from '@/app/components/modals/sites/ajoutSite';
import { ModifierSite } from '@/app/components/modals/sites/modifSite';
import { SupprimerSite } from '@/app/components/modals/sites/supprSite';
import RoleGuard from '@/app/components/RoleGuard';
import { getSites, SiteData } from '@/app/services/sites/sitesService';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import {
  HiPlus,
  HiPencil,
  HiTrash,
  HiServer,
  HiUsers,
  HiCheckCircle,
  HiRefresh
} from 'react-icons/hi';

export default function SitesPage() {
  const [modalAjoutSite, setModalAjoutSite] = useState<boolean>(false);
  const [modalModifSite, setModalModifSite] = useState<boolean>(false);
  const [modalSupprSite, setModalSupprSite] = useState<boolean>(false);

  const [siteAEditer, setSiteAEditer] = useState<SiteData | null>(null);
  const [siteASupprimer, setSiteASupprimer] = useState<SiteData | null>(null);

  const { data: sites = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['sites'],
    queryFn: getSites
  })

  // Fonction déclenchée lors du clic sur l'icône Corbeille
  const handleDeleteClick = (site: SiteData) => {
    setSiteASupprimer(site);
    setModalSupprSite(true);
  };

  // Fonction pour déclencher la modification au clic
  const handleEditClick = (site: SiteData) => {
    setSiteAEditer(site);
    setModalModifSite(true);
  };

  // const totalClients = sites.reduce((acc, s) => acc + s.clientsActifs, 0);
  const totalClients = 6
  const sitesEnLigne = sites.filter(s => s.statut === 'en_ligne').length;

  return (
    <RoleGuard allowedRoles={['Admin']}>
      <div className="space-y-6">
        {/* MODAL D'AJOUT */}
        {modalAjoutSite && (
          <AjoutSite
            setModalAjoutSite={setModalAjoutSite}
          />
        )}

        {/* MODAL DE MODIFICATION */}
        {modalModifSite && siteAEditer && (
          <ModifierSite
            site={siteAEditer}
            setModalModifierSite={setModalModifSite}
          />
        )}

        {/* MODAL DE SUPPRESSION */}
        {modalSupprSite && siteASupprimer && (
          <SupprimerSite
            site={siteASupprimer}
            setModalSupprimerSite={setModalSupprSite}
          />
        )}

        {/* EN-TÊTE DE LA PAGE */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Sites</h1>
            <p className="text-sm text-gray-500 mt-4">
              Supervisez vos points d'accès HotSpot, équipements MikroTik et routeurs Starlink.
            </p>
          </div>

          <button
            className="flex items-center cursor-pointer justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg font-medium text-sm transition-colors shadow-sm"
            onClick={() => setModalAjoutSite(true)}
          >
            <HiPlus className="w-5 h-5" />
            <span>Ajouter un Site</span>
          </button>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center p-12 bg-white rounded-2xl border border-gray-100">
            <div className="flex items-center gap-3 text-emerald-600 font-medium text-sm">
              <span className="w-5 h-5 border-2 border-emerald-600/30 border-t-emerald-600 rounded-full animate-spin" />
              <span>Chargement des sites depuis la base de données...</span>
            </div>
          </div>
        )}


        {isError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center justify-between text-xs text-red-600 font-medium">
            <span>Impossible de charger la liste des sites.</span>
            <button
              onClick={() => refetch()}
              className="flex items-center gap-1 text-red-700 hover:underline font-bold"
            >
              <HiRefresh className="w-4 h-4" /> Réessayer
            </button>
          </div>
        )}

        {/* STATISTIQUES RAPIDES */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Sites</p>
              <p className="text-2xl font-extrabold text-gray-900 mt-1">{sites.length}</p>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <HiServer className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Sites Opérationnels</p>
              <p className="text-2xl font-extrabold text-emerald-600 mt-1">{sitesEnLigne} / {sites.length}</p>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <HiCheckCircle className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Utilisateurs Connectés</p>
              <p className="text-2xl font-extrabold text-gray-900 mt-1">{totalClients} utilisateurs</p>
            </div>
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
              <HiUsers className="w-6 h-6" />
            </div>
          </div>
        </div>


        {/* TABLEAU DES SITES */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-900">Registre des passerelles</h2>
            <span className="text-xs text-gray-500">{sites.length} sites configurés</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-gray-500 uppercase text-[11px] font-semibold tracking-wider border-b border-gray-100">
                <tr>
                  <th className="py-2 px-4">Nom du Site</th>
                  <th className="py-2 px-4">Passerelle IP</th>
                  <th className="py-2 px-4">Matériel</th>
                  <th className="py-2 px-4">Connectés</th>
                  <th className="py-2 px-4">Statut</th>
                  <th className="py-2 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sites.map((site) => (
                  <tr key={site.idSite} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-2 px-4">
                      <div className="font-semibold text-gray-900">{site.designSite}</div>
                      <div className="text-xs text-gray-400">{site.localisation}</div>
                    </td>
                    <td className="py-2 px-4 font-mono text-xs text-gray-800">
                      {site.equipement}
                    </td>
                    <td className="py-2 px-4 text-xs">{'198.162.1.2/26'}</td>
                    {/* <td className="py-2 px-4 text-xs">{site.equipements}</td> */}
                    <td className="py-2 px-4 font-bold text-gray-900">
                      {58}
                    </td>
                    <td className="py-2 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${site.statut === 'en_ligne'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-red-50 text-red-600 border border-red-200'
                        }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${site.statut === 'en_ligne' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        {site.statut === 'en_ligne' ? 'En ligne' : 'Hors ligne'}
                      </span>
                    </td>
                    <td className="py-2 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          aria-label="Modifier"
                          className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          onClick={() => handleEditClick(site)}
                        >
                          <HiPencil className="w-4 h-4" />
                        </button>
                        <button
                          aria-label="Supprimer"
                          className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          onClick={() => handleDeleteClick(site)}
                        >
                          <HiTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}