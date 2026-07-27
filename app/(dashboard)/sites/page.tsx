/* eslint-disable react/no-unescaped-entities */
'use client';

import React, { useState } from 'react';
import { 
  HiPlus, 
  HiPencil, 
  HiTrash, 
//   HiWifi, 
  HiServer, 
  HiUsers, 
  HiLocationMarker,
  HiDotsVertical,
  HiCheckCircle,
  HiExclamationCircle
} from 'react-icons/hi';

interface Site {
  id: number;
  nom: string;
  localisation: string;
  ipAddress: string;
  equipements: string; // Ex: MikroTik + Starlink
  statut: 'en_ligne' | 'hors_ligne';
  clientsActifs: number;
  consommation: string;
}

export default function SitesPage() {
  const [sites] = useState<Site[]>([
    {
      id: 1,
      nom: 'Site Central - Gombe',
      localisation: 'Avenue de la Justice, Kinshasa',
      ipAddress: '192.168.88.1',
      equipements: 'MikroTik RB750Gr3 + Starlink',
      statut: 'en_ligne',
      clientsActifs: 42,
      consommation: '18.4 Mbps',
    },
    {
      id: 2,
      nom: 'Agence Victoire',
      localisation: 'Place Victoire, Kalamu',
      ipAddress: '192.168.89.1',
      equipements: 'MikroTik hAP ac²',
      statut: 'en_ligne',
      clientsActifs: 28,
      consommation: '9.1 Mbps',
    },
    {
      id: 3,
      nom: 'Point HotSpot Unikin',
      localisation: 'Plateau des Professeurs, Lemba',
      ipAddress: '192.168.90.1',
      equipements: 'MikroTik cAP ac + Starlink',
      statut: 'hors_ligne',
      clientsActifs: 0,
      consommation: '0 Mbps',
    },
    {
      id: 4,
      nom: 'Agence Kintambo',
      localisation: 'Magasin, Kintambo',
      ipAddress: '192.168.91.1',
      equipements: 'MikroTik RB3011',
      statut: 'en_ligne',
      clientsActifs: 15,
      consommation: '5.2 Mbps',
    },
  ]);

  const totalClients = sites.reduce((acc, s) => acc + s.clientsActifs, 0);
  const sitesEnLigne = sites.filter(s => s.statut === 'en_ligne').length;

  return (
    <div className="space-y-6">
      {/* 1. EN-TÊTE DE LA PAGE */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Sites</h1>
          <p className="text-sm text-gray-500 mt-4">
            Supervisez vos points d'accès HotSpot, équipements MikroTik et routeurs Starlink.
          </p>
        </div>

        <button className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg font-medium text-sm transition-colors shadow-sm">
          <HiPlus className="w-5 h-5" />
          <span>Ajouter un Site</span>
        </button>
      </div>

      {/* 2. STATISTIQUES RAPIDES */}
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

      {/* 3. CARTES DES SITES (Aperçu temps réel) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sites.map((site) => (
          <div 
            key={site.id}
            className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-gray-900">{site.nom}</h3>
                  <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    site.statut === 'en_ligne'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-red-50 text-red-600 border border-red-200'
                  }`}>
                    {site.statut === 'en_ligne' ? (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        En ligne
                      </>
                    ) : (
                      <>
                        <HiExclamationCircle className="w-3.5 h-3.5" />
                        Hors ligne
                      </>
                    )}
                  </span>
                </div>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <HiLocationMarker className="w-4 h-4 text-gray-400" />
                  {site.localisation}
                </p>
              </div>

              <button className="text-gray-400 hover:text-gray-600 p-1 rounded-lg">
                <HiDotsVertical className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 bg-gray-50 p-3 rounded-xl text-xs">
              <div>
                <span className="text-gray-400 block">Adresse RouterOS</span>
                <span className="font-mono font-semibold text-gray-800">{site.ipAddress}</span>
              </div>
              <div>
                <span className="text-gray-400 block">Bande passante actuelle</span>
                <span className="font-semibold text-gray-800">{site.consommation}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 text-xs text-gray-500 border-t border-gray-100">
              <span className="flex items-center gap-1">
                <HiServer className="w-4 h-4 text-gray-400" />
                {site.equipements}
              </span>
              <span className="flex items-center gap-1 font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                <HiUsers className="w-4 h-4" />
                {site.clientsActifs} clients
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 4. TABLEAU DES SITES */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900">Registre des passerelles</h2>
          <span className="text-xs text-gray-500">{sites.length} sites configurés</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-500 uppercase text-[11px] font-semibold tracking-wider border-b border-gray-100">
              <tr>
                <th className="py-3.5 px-4">Nom du Site</th>
                <th className="py-3.5 px-4">Passerelle IP</th>
                <th className="py-3.5 px-4">Matériel</th>
                <th className="py-3.5 px-4">Connectés</th>
                <th className="py-3.5 px-4">Statut</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sites.map((site) => (
                <tr key={site.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-gray-900">{site.nom}</div>
                    <div className="text-xs text-gray-400">{site.localisation}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-xs text-gray-800">
                    {site.ipAddress}
                  </td>
                  <td className="py-3.5 px-4 text-xs">{site.equipements}</td>
                  <td className="py-3.5 px-4 font-bold text-gray-900">
                    {site.clientsActifs}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      site.statut === 'en_ligne'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-red-50 text-red-600 border border-red-200'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${site.statut === 'en_ligne' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                      {site.statut === 'en_ligne' ? 'En ligne' : 'Hors ligne'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        aria-label="Modifier"
                        className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <HiPencil className="w-4 h-4" />
                      </button>
                      <button 
                        aria-label="Supprimer"
                        className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
  );
}