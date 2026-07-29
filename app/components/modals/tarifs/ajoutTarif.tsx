/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import { 
  HiX, 
  HiTag, 
  HiClock, 
  HiCurrencyDollar, 
  HiStatusOnline,
//   HiBan
} from 'react-icons/hi';

interface AjoutTarifProps {
  setModalAjoutTarif: (value: boolean) => void;
  onTarifAdded?: (newTarif: any) => void;
}

export const AjoutTarif = ({ setModalAjoutTarif, onTarifAdded }: AjoutTarifProps) => {
  const [formData, setFormData] = useState({
    nom: '',
    dureeValeur: 1,
    dureeUnite: 'Heures' as 'Minutes' | 'Heures' | 'Jours' | 'Mois',
    prixCDF: '',
    limiteVitesse: '5 Mbps / 2 Mbps',
    statut: 'actif' as 'actif' | 'inactif',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const dureeFormatee = `${formData.dureeValeur} ${formData.dureeUnite}`;

    if (onTarifAdded) {
      onTarifAdded({
        id: Date.now(),
        nom: formData.nom,
        duree: dureeFormatee,
        prix: `${Number(formData.prixCDF).toLocaleString('fr-FR')} FC`,
        limiteVitesse: formData.limiteVitesse || 'Illimitée',
        statut: formData.statut,
      });
    }

    setModalAjoutTarif(false);
  };

  return (
    <div className="fixed inset-0 flex h-full justify-center items-center bg-black/60 z-[1000] backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-[520px] rounded-2xl shadow-xl border border-gray-100 overflow-hidden text-gray-800 animate-[fadeModalIn_250ms_ease-out]">
        
        {/* EN-TÊTE DU MODAL */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <HiTag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Nouveau Forfait HotSpot</h3>
              <p className="text-xs text-gray-500">Créer un tarif pour la génération de tickets</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setModalAjoutTarif(false)}
            aria-label="Fermer"
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 rounded-xl transition-colors"
          >
            <HiX className="w-5 h-5" />
          </button>
        </div>

        {/* FORMULAIRE */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-left">
          {/* Nom du forfait */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 block">
              Nom du Forfait <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <HiTag className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                required
                placeholder="ex: Pass Express 2H, Pass Journée..."
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Durée de validité (Valeur + Unité) */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 block">
                Durée <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <HiClock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  min="1"
                  required
                  value={formData.dureeValeur}
                  onChange={(e) => setFormData({ ...formData, dureeValeur: Math.max(1, parseInt(e.target.value) || 1) })}
                  className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 block">Unité</label>
              <select
                value={formData.dureeUnite}
                onChange={(e) => setFormData({ ...formData, dureeUnite: e.target.value as any })}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              >
                <option value="Minutes">Minutes</option>
                <option value="Heures">Heures</option>
                <option value="Jours">Jours</option>
                <option value="Mois">Mois</option>
              </select>
            </div>
          </div>

          {/* Prix en FC */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 block">
              Prix (en FC) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <HiCurrencyDollar className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="number"
                required
                step="50"
                placeholder="ex: 1500"
                value={formData.prixCDF}
                onChange={(e) => setFormData({ ...formData, prixCDF: e.target.value })}
                className="w-full pl-10 pr-12 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-mono"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400">
                FC
              </span>
            </div>
          </div>

          {/* Limite de bande passante (RouterOS Queue) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 block">
              Limite de Vitesse (Rx / Tx)
            </label>
            <div className="relative">
              <HiStatusOnline className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="ex: 5 Mbps / 2 Mbps"
                value={formData.limiteVitesse}
                onChange={(e) => setFormData({ ...formData, limiteVitesse: e.target.value })}
                className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Statut */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 block">Statut du Forfait</label>
            <select
              value={formData.statut}
              onChange={(e) => setFormData({ ...formData, statut: e.target.value as any })}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
            >
              <option value="actif">Actif (Disponible à la vente)</option>
              <option value="inactif">Inactif (Masqué)</option>
            </select>
          </div>

          {/* APERÇU DU TICKET */}
          {formData.nom && formData.prixCDF && (
            <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-xl text-xs space-y-1">
              <span className="font-semibold text-emerald-800 block">Aperçu du tarif créé :</span>
              <div className="flex justify-between text-emerald-700">
                <span>{formData.nom} ({formData.dureeValeur} {formData.dureeUnite})</span>
                <span className="font-bold font-mono">{Number(formData.prixCDF).toLocaleString('fr-FR')} FC</span>
              </div>
            </div>
          )}

          {/* BOUTONS D'ACTION */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100 mt-6">
            <button
              type="button"
              onClick={() => setModalAjoutTarif(false)}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium text-sm hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm transition-colors shadow-sm"
            >
              Créer le Tarif
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};