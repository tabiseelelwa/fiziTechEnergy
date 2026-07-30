'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { HiPlus, HiPencil, HiTrash, HiClock, HiRefresh } from 'react-icons/hi';
import { AjoutTarif } from '@/app/components/modals/tarifs/ajoutTarif';
import { ModifierTarif } from '@/app/components/modals/tarifs/modifTarif';
import { SupprimerTarif } from '@/app/components/modals/tarifs/supprTarif';
import { getTarifs, TarifData } from '@/app/services/tarif/tarifService';

export default function TarifsPage() {
  // Gestion de l'affichage des modales
  const [modalAjoutTarif, setModalAjoutTarif] = useState<boolean>(false);
  const [modalModifTarif, setModalModifTarif] = useState<boolean>(false);
  const [modalSupprTarif, setModalSupprTarif] = useState<boolean>(false);

  // État pour conserver le tarif sélectionné (pour éditer ou supprimer)
  const [selectedTarif, setSelectedTarif] = useState<TarifData | null>(null);

  // Récupération dynamique depuis l'API MySQL
  const { data: tarifs = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['tarifs'],
    queryFn: getTarifs,
  });

  // Ouvre le modal de modification avec le tarif ciblé
  const handleEdit = (tarif: TarifData) => {
    setSelectedTarif(tarif);
    setModalModifTarif(true);
  };

  // Ouvre le modal de suppression avec le tarif ciblé
  const handleDelete = (tarif: TarifData) => {
    setSelectedTarif(tarif);
    setModalSupprTarif(true);
  };

  // Formatage de l'affichage des minutes en Heures / Minutes
  const formatDuree = (minutes: number) => {
    if (minutes < 60) return `${minutes} Min`;
    const heures = Math.floor(minutes / 60);
    const minsRestantes = minutes % 60;
    return minsRestantes > 0 ? `${heures}h ${minsRestantes}m` : `${heures} Heures`;
  };

  return (
    <div className="space-y-6">
      {/* MODALES AVEC PROPS ADAPTÉES */}
      {modalAjoutTarif && (
        <AjoutTarif setModalAjoutTarif={setModalAjoutTarif} />
      )}

      {modalModifTarif && selectedTarif && (
        <ModifierTarif
          key={selectedTarif.codeTypeForfait}
          setModalModifierTarif={setModalModifTarif}
          tarif={selectedTarif}
        />
      )}

      {modalSupprTarif && selectedTarif && (
        <SupprimerTarif
          setModalSupprimerTarif={setModalSupprTarif}
          tarif={selectedTarif}
        />
      )}

      {/* 1. EN-TÊTE DE LA PAGE */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tarifs</h1>
          <p className="text-sm text-gray-500 mt-1">
            Configurez les forfaits Hotspot, les durées et les tarifs associés.
          </p>
        </div>

        <button
          className="flex items-center cursor-pointer justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-colors shadow-sm"
          onClick={() => setModalAjoutTarif(true)}
        >
          <HiPlus className="w-5 h-5" />
          <span>Nouveau Tarif</span>
        </button>
      </div>

      {/* GESTION DE CHARGEMENT ET ERREURS */}
      {isLoading && (
        <div className="flex items-center justify-center p-12 bg-white rounded-2xl border border-gray-100">
          <div className="flex items-center gap-3 text-emerald-600 font-medium text-sm">
            <span className="w-5 h-5 border-2 border-emerald-600/30 border-t-emerald-600 rounded-full animate-spin" />
            <span>Chargement des tarifs depuis la base de données...</span>
          </div>
        </div>
      )}

      {isError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center justify-between text-xs text-red-600 font-medium">
          <span>Impossible de charger la liste des tarifs.</span>
          <button
            onClick={() => refetch()}
            className="flex items-center gap-1 text-red-700 hover:underline font-bold"
          >
            <HiRefresh className="w-4 h-4" /> Réessayer
          </button>
        </div>
      )}

      {!isLoading && !isError && (
        <>
          {/* 2. CARTES DES FORFAITS (Aperçu visuel des 4 premiers) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {tarifs.slice(0, 4).map((tarif) => (
              <div
                key={tarif.codeTypeForfait}
                className="relative bg-white rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between border border-gray-100 hover:shadow-md transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                      {formatDuree(tarif.dureeMinutes)}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900">{tarif.designation}</h3>

                  <div className="text-2xl font-extrabold text-gray-900">
                    {tarif.prixFC.toLocaleString('fr-FR')}{' '}
                    <span className="text-sm font-normal text-gray-500">FC</span>
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
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {tarifs.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-gray-400 text-xs">
                        Aucun tarif trouvé dans la base de données.
                      </td>
                    </tr>
                  ) : (
                    tarifs.map((item) => (
                      <tr key={item.codeTypeForfait} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-gray-900">
                          {item.designation}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1.5 text-gray-700">
                            <HiClock className="w-4 h-4 text-gray-400" />
                            {formatDuree(item.dureeMinutes)}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-gray-900 font-mono">
                          {item.prixFC.toLocaleString('fr-FR')} FC
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              aria-label="Modifier"
                              className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                              onClick={() => handleEdit(item)}
                            >
                              <HiPencil className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              aria-label="Supprimer"
                              className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              onClick={() => handleDelete(item)}
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
        </>
      )}
    </div>
  );
}