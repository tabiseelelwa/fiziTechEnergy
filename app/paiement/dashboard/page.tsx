/* eslint-disable react/no-unescaped-entities */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  BsPlusCircleFill, 
  BsCashCoin, 
  BsTicketPerforated, 
  BsCheckCircle, 
  BsSearch,
  BsBoxArrowRight,
  BsBarChartLine
} from 'react-icons/bs';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

// --- Données factices pour la démonstration ---
const DATA_VENTES_HEURES = [
  { heure: '08h', ventes: 12500 },
  { heure: '10h', ventes: 27500 },
  { heure: '12h', ventes: 45000 },
  { heure: '14h', ventes: 32500 },
  { heure: '16h', ventes: 58000 },
  { heure: '18h', ventes: 72500 },
];

const DATA_FORFAITS = [
  { name: '3 Heures (2 500 FC)', value: 45, color: '#3b82f6' },
  { name: '8 Heures (3 500 FC)', value: 30, color: '#10b981' },
  { name: '24 Heures (5 000 FC)', value: 25, color: '#f59e0b' },
];

const RECENT_TRANSACTIONS = [
  { id: 'FT-9182', client: '0812345678', forfait: 'Forfait 8h', montant: '3 500 FC', mode: 'Cash', date: 'Aujourd\'hui 14:32', statut: 'Reussi' },
  { id: 'FT-4819', client: '0991543970', forfait: 'Forfait 3h', montant: '2 500 FC', mode: 'M-Pesa', date: 'Aujourd\'hui 14:15', statut: 'Reussi' },
  { id: 'FT-3021', client: '0821122334', forfait: 'Forfait 24h', montant: '5 000 FC', mode: 'Cash', date: 'Aujourd\'hui 13:45', statut: 'Reussi' },
  { id: 'FT-1102', client: '0970001122', forfait: 'Forfait 3h', montant: '2 500 FC', mode: 'Airtel-Money', date: 'Aujourd\'hui 12:10', statut: 'Reussi' },
];

export default function VendeurDashboard() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrage des transactions pour la recherche
  const filteredTransactions = RECENT_TRANSACTIONS.filter((t) =>
    t.client.includes(searchTerm) || t.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-4 md:p-8">
      {/* ---------------- BARRE SUPÉRIEURE / EN-TÊTE ---------------- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard Vendeur</h1>
          <p className="text-sm text-slate-500">Comptoir de vente et suivi en temps réel</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => router.push('/vendeur/ticket')}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2.5 rounded-xl shadow-sm transition"
          >
            <BsPlusCircleFill size={18} />
            Nouvelle Vente
          </button>

          <button
            onClick={() => router.push('/login')}
            className="p-2.5 bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-xl transition"
            title="Déconnexion"
          >
            <BsBoxArrowRight size={20} />
          </button>
        </div>
      </div>

      {/* ---------------- CARTES STATISTIQUES ---------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        {/* Recette Totale */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Total Encaissé (Aujourd'hui)</p>
            <h3 className="text-2xl font-extrabold text-slate-900">248 000 FC</h3>
            <span className="inline-block mt-2 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
              +12% vs hier
            </span>
          </div>
          <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl">
            <BsCashCoin size={28} />
          </div>
        </div>

        {/* Tickets Vendus */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Tickets Générés</p>
            <h3 className="text-2xl font-extrabold text-slate-900">68 Tickets</h3>
            <span className="inline-block mt-2 text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
              Moyenne: 8 t/h
            </span>
          </div>
          <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
            <BsTicketPerforated size={28} />
          </div>
        </div>

        {/* Mode de Paiement Dominant */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between sm:col-span-2 lg:col-span-1">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Mode Principal</p>
            <h3 className="text-2xl font-extrabold text-slate-900">Espèces (Cash)</h3>
            <span className="inline-block mt-2 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
              75% du volume
            </span>
          </div>
          <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl">
            <BsBarChartLine size={28} />
          </div>
        </div>
      </div>

      {/* ---------------- GRAPHIQUES RECHARTS ---------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Graphique de Ventes par heure */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-base font-bold text-slate-900">Évolution des Recettes (FC)</h2>
            <span className="text-xs text-slate-400">Aujourd'hui</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DATA_VENTES_HEURES}>
                <defs>
                  <linearGradient id="colorVentes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="heure" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip 
                  formatter={(value) => [`${value} FC`, 'Ventes']}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', borderColor: '#e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
                <Area type="monotone" dataKey="ventes" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorVentes)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PieChart Répartition des Forfaits */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <h2 className="text-base font-bold text-slate-900 mb-2">Répartition des Forfaits</h2>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={DATA_FORFAITS}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {DATA_FORFAITS.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-4">
            {DATA_FORFAITS.map((f, index) => (
              <div key={index} className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: f.color }} />
                  <span className="text-slate-600 font-medium">{f.name}</span>
                </div>
                <span className="font-bold text-slate-800">{f.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ---------------- TABLEAU DES DERNIÈRES VENTES ---------------- */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {/* En-tête du tableau + Recherche */}
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Dernières Ventes Enregistrées</h2>
            <p className="text-xs text-slate-500">Historique des tickets émis aujourd'hui au comptoir</p>
          </div>

          <div className="relative w-full sm:w-64">
            <BsSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher par code ou tél..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
            />
          </div>
        </div>

        {/* Structure du tableau Tailwind */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-6">Code Ticket</th>
                <th className="py-3.5 px-6">Client</th>
                <th className="py-3.5 px-6">Forfait</th>
                <th className="py-3.5 px-6">Montant</th>
                <th className="py-3.5 px-6">Règlement</th>
                <th className="py-3.5 px-6">Heure</th>
                <th className="py-3.5 px-6 text-center">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/50 transition">
                    <td className="py-4 px-6 font-bold text-blue-600">{tx.id}</td>
                    <td className="py-4 px-6 font-medium text-slate-800">{tx.client}</td>
                    <td className="py-4 px-6">{tx.forfait}</td>
                    <td className="py-4 px-6 font-bold text-slate-900">{tx.montant}</td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 font-medium text-slate-700">
                        {tx.mode}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-400">{tx.date}</td>
                    <td className="py-4 px-6 text-center">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-[11px]">
                        <BsCheckCircle className="text-emerald-500" />
                        {tx.statut}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">
                    Aucune transaction trouvée pour "{searchTerm}"
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