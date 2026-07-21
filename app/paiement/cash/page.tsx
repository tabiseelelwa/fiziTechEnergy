/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BeatLoader } from 'react-spinners';
import style from "@/app/styles/client/ticket.module.scss"; // Réutilisation de vos styles existants
import { BsArrowLeft, BsCheckCircleFill } from 'react-icons/bs';

// Configuration des forfaits disponibles au guichet
const FORFAITS_CONFIG = {
  '1': { designation: 'Forfait 3 Heures', prix: '2 500 FC', durationMins: 180, priceNum: 2500 },
  '2': { designation: 'Forfait 8 Heures', prix: '3 500 FC', durationMins: 480, priceNum: 3500 },
  '3': { designation: 'Forfait 24 Heures', prix: '5 000 FC', durationMins: 1440, priceNum: 5000 },
};

type ForfaitKey = keyof typeof FORFAITS_CONFIG;

export default function VendeurPage() {
  const router = useRouter();

  // États du formulaire
  const [telephone, setTelephone] = useState('');
  const [forfaitId, setForfaitId] = useState<ForfaitKey>('2');
  const [modePaiement, setModePaiement] = useState('Cash');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // État du ticket généré
  const [ticketGenere, setTicketGenere] = useState<{
    code: string;
    telephone: string;
    designation: string;
    prix: string;
  } | null>(null);

  const handleVendreTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTicketGenere(null);

    const infoForfait = FORFAITS_CONFIG[forfaitId];

    try {
      const reponse = await fetch('/api/tickets/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          telephone: telephone.trim(),
          durationMins: infoForfait.durationMins,
          prix: infoForfait.priceNum,
          codeTypeForfait: parseInt(forfaitId),
          modePaiement,
        }),
      });

      const donnees = await reponse.json();

      if (!reponse.ok) {
        throw new Error(donnees.message || 'Erreur lors de la création du ticket.');
      }

      // Ticket généré avec succès
      setTicketGenere({
        code: donnees.ticket.code,
        telephone: telephone.trim(),
        designation: infoForfait.designation,
        prix: infoForfait.prix,
      });

      // Réinitialisation du champ téléphone pour la vente suivante
      setTelephone('');

    } catch (err: any) {
      setError(err.message || 'Impossible de contacter le serveur local.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={style.ticketConainer}>

      {/* Header Vendeur / Bouton Retour */}
      <div className={style.ticketHeader} onClick={() => router.push('/admin')}>
        <BsArrowLeft />
        <div>Retour au Dashboard Admin</div>
      </div>

      {/* Titre Comptoir */}
      <h3>Comptoir Vendeur — Paiement Cash</h3>

      {error && (
        <div className={style.error}>
          ⚠️ {error}
        </div>
      )}

      {/* Formulaire de Vente */}
      <form onSubmit={handleVendreTicket}>
        
        {/* Champ Téléphone */}
        <div className={style.ticketTelephone}>
          <label>Numéro de téléphone du client *</label>
          <input
            type="tel"
            required
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
            placeholder="Ex: 0812345678"
          />
        </div>

        {/* Sélection du Forfait */}
        <div className={style.ticketOperateur}>
          <label>Forfait sélectionné *</label>
          <select
            value={forfaitId}
            onChange={(e) => setForfaitId(e.target.value as ForfaitKey)}
          >
            <option value="1">Forfait 3 Heures — 2 500 FC</option>
            <option value="2">Forfait 8 Heures — 3 500 FC</option>
            <option value="3">Forfait 24 Heures — 5 000 FC</option>
          </select>
        </div>

        {/* Sélection de la méthode de règlement */}
        <div className={style.ticketOperateur}>
          <label>Mode de règlement *</label>
          <select
            value={modePaiement}
            onChange={(e) => setModePaiement(e.target.value)}
          >
            <option value="Cash">Espèces (Cash au comptoir)</option>
            <option value="M-Pesa">Direct Cash (M-Pesa Vendeur)</option>
            <option value="Airtel-Money">Direct Cash (Airtel Vendeur)</option>
          </select>
        </div>

        {/* Bouton de validation */}
        <button
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: loading ? '#9ca3af' : '#22c55e', // Vert pour valider une vente
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? (
            <BeatLoader style={{ color: "#fff" }} />
          ) : (
            `Valider la vente (${FORFAITS_CONFIG[forfaitId].prix})`
          )}
        </button>
      </form>

      {/* Zone de reçu / Reçois du Ticket généré pour le Vendeur */}
      {ticketGenere && (
        <div className={style.ticketRecap} style={{ marginTop: '25px', borderColor: '#22c55e' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#22c55e', marginBottom: '8px' }}>
            <BsCheckCircleFill size={20} />
            <span style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>Vente Cash Enregistrée</span>
          </div>

          <p style={{ fontSize: '13px', margin: '4px 0' }}>Code du ticket à remettre au client :</p>
          <h2 style={{ fontSize: '36px', color: '#0070f3', letterSpacing: '2px', margin: '10px 0' }}>
            {ticketGenere.code}
          </h2>

          <div style={{ textAlign: 'left', fontSize: '14px', marginTop: '12px', background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '8px' }}>
            <div><strong>Téléphone :</strong> {ticketGenere.telephone}</div>
            <div><strong>Forfait :</strong> {ticketGenere.designation}</div>
            <div><strong>Prix payé :</strong> {ticketGenere.prix}</div>
          </div>
        </div>
      )}

    </div>
  );
}