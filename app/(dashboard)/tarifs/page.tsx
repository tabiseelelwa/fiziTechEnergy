'use client';

import React, { useState } from 'react';
import { 
  HiPlus, 
  HiPencil, 
  HiTrash, 
  HiClock, 
  HiWifi, 
  HiTag,
  HiCheckCircle,
  HiXCircle 
} from 'react-icons/hi';

interface Tarif {
  id: number;
  nom: string;
  duree: string;
  prixFC: number;
  dataLimit: string;
  vitesse: string;
  statut: 'actif' | 'inactif';
  popularite?: string;
}

export default function TarifsPage() {
  // Exemples de données de forfaits HotSpot
  const [tarifs] = useState<Tarif[]>([
    {
      id: 1,
      nom: 'Forfait Flash',
      duree: '1 Heure',
      prixFC: 1000,
      dataLimit: 'Illimité',
      vitesse: '5 Mbps',
      statut: 'actif',
    },
    {
      id: 2,
      nom: 'Forfait Standard',
      duree: '3 Heures',
      prixFC: 2500,
      dataLimit: 'Illimité',
      vitesse: '10 Mbps',
      statut: 'actif',
      popularite: 'Populaire',
    },
    {
      id: 3,
      nom: 'Forfait Journée',
      duree: '8 Heures',
      prixFC: 3500,
      dataLimit: 'Illimité',
      vitesse: '10 Mbps',
      statut: 'actif',
    },
    {
      id: 4,
      nom: 'Pass 24H',
      duree: '24 Heures',
      prixFC: 5000,
      dataLimit: 'Illimité',
      vitesse: '15 Mbps',
      statut: 'actif',
    },
    {
      id: 5,
      nom: 'Pass Hebdo',
      duree: '7 Jours',
      prixFC: 25000,
      dataLimit: '50 GB',
      vitesse: '20 Mbps',
      statut: 'inactif',
    },
  ]);

  return (
    <div className="space-y-6">
      {/* 1. EN-TÊTE DE LA PAGE */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Tarifs</h1>
          <p className="text-sm text-gray-500 mt-4">
            Configurez les forfaits Hotspot, les durées et les tarifs associés.
          </p>
        </div>

        <button className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg font-medium text-sm transition-colors shadow-sm">
          <HiPlus className="w-5 h-5" />
          <span>Nouveau Tarif</span>
        </button>
      </div>

      {/* 2. CARTES DES FORFAITS (Aperçu visuel) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {tarifs.slice(0, 4).map((tarif) => (
          <div 
            key={tarif.id}
            className={`relative bg-white border rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between transition-all hover:shadow-md ${
              tarif.popularite ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-gray-200'
            }`}
          >
            {tarif.popularite && (
              <span className="absolute -top-3 right-4 bg-emerald-600 text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {tarif.popularite}
              </span>
            )}

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                  {tarif.duree}
                </span>
                <span className={`inline-flex items-center gap-1 text-xs font-medium ${
                  tarif.statut === 'actif' ? 'text-emerald-600' : 'text-gray-400'
                }`}>
                  {tarif.statut === 'actif' ? <HiCheckCircle className="w-4 h-4" /> : <HiXCircle className="w-4 h-4" />}
                  {tarif.statut}
                </span>
              </div>

              <h3 className="text-lg font-bold text-gray-900">{tarif.nom}</h3>
              
              <div className="text-2xl font-extrabold text-gray-900">
                {tarif.prixFC.toLocaleString('fr-FR')} <span className="text-sm font-normal text-gray-500">FC</span>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 text-xs text-gray-500 space-y-1.5">
              <div className="flex items-center gap-2">
                <HiWifi className="w-4 h-4 text-gray-400" />
                <span>Vitesse : <strong className="text-gray-700">{tarif.vitesse}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <HiTag className="w-4 h-4 text-gray-400" />
                <span>Quota : <strong className="text-gray-700">{tarif.dataLimit}</strong></span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. TABLEAU DÉTAILLÉ DES TARIFS */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900">Liste complète des forfaits</h2>
          <span className="text-xs text-gray-500">{tarifs.length} forfaits enregistrés</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-500 uppercase text-[11px] font-semibold tracking-wider border-b border-gray-100">
              <tr>
                <th className="py-3.5 px-4">Nom du Forfait</th>
                <th className="py-3.5 px-4">Durée</th>
                <th className="py-3.5 px-4">Prix (FC)</th>
                <th className="py-3.5 px-4">Vitesse</th>
                <th className="py-3.5 px-4">Quota</th>
                <th className="py-3.5 px-4">Statut</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tarifs.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-gray-900">
                    {item.nom}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1">
                      <HiClock className="w-4 h-4 text-gray-400" />
                      {item.duree}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-gray-900">
                    {item.prixFC.toLocaleString('fr-FR')} FC
                  </td>
                  <td className="py-3.5 px-4">{item.vitesse}</td>
                  <td className="py-3.5 px-4">{item.dataLimit}</td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      item.statut === 'actif'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-gray-100 text-gray-600 border border-gray-200'
                    }`}>
                      {item.statut === 'actif' ? 'Actif' : 'Inactif'}
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