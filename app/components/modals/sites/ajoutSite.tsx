'use client';

import React, { useState } from 'react';
import { 
  HiX, 
  HiServer, 
  HiLocationMarker, 
  HiDesktopComputer, 
  HiGlobeAlt 
} from 'react-icons/hi';

interface AjoutSiteProps {
  setModalAjoutSite: (value: boolean) => void;
}

export const AjoutSite = ({ setModalAjoutSite }: AjoutSiteProps) => {
  const [formData, setFormData] = useState({
    nom: '',
    localisation: '',
    ipAddress: '',
    equipements: '',
    statut: 'en_ligne',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Fermeture du modal
    setModalAjoutSite(false);
  };

  return (
    <div className="fixed inset-0 flex h-full justify-center items-center bg-black/60 z-[1000] backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-[520px] rounded-2xl shadow-xl border border-gray-100 overflow-hidden text-gray-800 animate-[fadeModalIn_250ms_ease-out]">
        
        {/* EN-TÊTE DU MODAL */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <HiServer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Nouveau Site HotSpot</h3>
              <p className="text-xs text-gray-500">Ajouter une passerelle MikroTik / Starlink</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setModalAjoutSite(false)}
            aria-label="Fermer"
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 rounded-xl transition-colors"
          >
            <HiX className="w-5 h-5" />
          </button>
        </div>

        {/* FORMULAIRE */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-left">
          {/* Nom du site */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 block">
              Nom du Site <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <HiServer className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                required
                placeholder="ex: Agence Limete"
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Localisation */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 block">
              Localisation <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <HiLocationMarker className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                required
                placeholder="ex: Blvd du 30 Juin, Kinshasa"
                value={formData.localisation}
                onChange={(e) => setFormData({ ...formData, localisation: e.target.value })}
                className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Adresse IP RouterOS */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 block">
              Adresse IP / Passerelle <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <HiGlobeAlt className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                required
                placeholder="ex: 192.168.88.1"
                value={formData.ipAddress}
                onChange={(e) => setFormData({ ...formData, ipAddress: e.target.value })}
                className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Équipements */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 block">
              Équipement(s) Déployé(s)
            </label>
            <div className="relative">
              <HiDesktopComputer className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="ex: MikroTik hAP ac² + Starlink"
                value={formData.equipements}
                onChange={(e) => setFormData({ ...formData, equipements: e.target.value })}
                className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Statut initial */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 block">Statut Initial</label>
            <select
              value={formData.statut}
              onChange={(e) => setFormData({ ...formData, statut: e.target.value})}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
            >
              <option value="en_ligne">En ligne</option>
              <option value="hors_ligne">Hors ligne</option>
            </select>
          </div>

          {/* BOUTONS D'ACTION */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100 mt-6">
            <button
              type="button"
              onClick={() => setModalAjoutSite(false)}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium text-sm hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm transition-colors shadow-sm"
            >
              Enregistrer le Site
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};