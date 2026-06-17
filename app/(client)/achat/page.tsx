/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { BeatLoader } from 'react-spinners';

// Base de données locale temporaire des forfaits pour l'affichage Front-End rapide
const FORFAITS_CONFIG = {
    '1': { designation: 'Forfait 1 Heure', prix: '1 000 FC', description: 'Idéal pour une vérification rapide' },
    '2': { designation: 'Forfait 3 Heures', prix: '2 000 FC', description: 'Le meilleur compromis vitesse/prix' },
    '3': { designation: 'Forfait 24 Heures', prix: '5 000 FC', description: 'Tranquillité totale toute la journée' },
};

type ForfaitKey = keyof typeof FORFAITS_CONFIG;

function FormulaireAchat() {
    const searchParams = useSearchParams();
    const router = useRouter();

    // Récupération de l'ID depuis l'URL (par défaut le forfait 2 s'il n'y a rien)
    const forfaitId = (searchParams.get('forfait') || '2') as ForfaitKey;
    const infoForfait = FORFAITS_CONFIG[forfaitId] || FORFAITS_CONFIG['2'];

    // États du formulaire
    const [nomClient, setNomClient] = useState('');
    const [telephone, setTelephone] = useState('');
    const [operateur, setOperateur] = useState('M-Pesa');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSoumissionPaiement = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const reponse = await fetch('/api/demande-paiement', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nomClient: nomClient || 'Client Hotspot',
                    telephone: telephone.trim(),
                    codeTypeForfait: parseInt(forfaitId),
                    operateur
                }),
            });

            const donnees = await reponse.json();

            if (!reponse.ok) {
                throw new Error(donnees.message || 'Une erreur est survenue.');
            }

            // Redirection vers la page succès avec les paramètres du ticket
            router.push(`/paiement/succes?code=${donnees.ticket.code}&expiration=${donnees.ticket.expiration}&forfait=${encodeURIComponent(donnees.ticket.forfait)}`);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '500px', margin: '20px auto', padding: '20px', fontFamily: 'Poppins, sans-serif', color: '#1f2937' }}>

            {/* Bouton Retour */}
            <button
                onClick={() => router.push('/')}
                style={{ background: 'none', border: 'none', color: '#0070f3', fontSize: '14px', fontWeight: '600', cursor: 'pointer', padding: '0', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '5px' }}
            >
                ← Modifier le forfait
            </button>

            {/* Récapitulatif du forfait sélectionné */}
            <div style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', padding: '20px', borderRadius: '14px', marginBottom: '25px' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: '#1e40af', letterSpacing: '0.5px' }}>Forfait sélectionné</span>
                <h2 style={{ margin: '5px 0 2px 0', fontSize: '20px', fontWeight: '800', color: '#1e3a8a' }}>{infoForfait.designation}</h2>
                <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#60a5fa' }}>{infoForfait.description}</p>
                <div style={{ fontSize: '24px', fontWeight: '900', color: '#0070f3' }}>{infoForfait.prix}</div>
            </div>

            {/* Formulaire de paiement */}
            <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 15px 0' }}>Finaliser votre paiement</h3>

            {error && (
                <div style={{ padding: '12px', backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: '10px', marginBottom: '15px', fontSize: '13px', fontWeight: '5px' }}>
                    ⚠️ {error}
                </div>
            )}

            <form onSubmit={handleSoumissionPaiement} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#4b5563' }}>Numéro de téléphone Mobile Money *</label>
                    <input
                        type="tel"
                        required
                        value={telephone}
                        onChange={(e) => setTelephone(e.target.value)}
                        placeholder="Ex: 0812345678"
                        style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #d1d5db', fontSize: '15px', boxSizing: 'border-box' }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#4b5563' }}>Sélectionnez votre opérateur *</label>
                    <select
                        value={operateur}
                        onChange={(e) => setOperateur(e.target.value)}
                        style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #d1d5db', fontSize: '15px', backgroundColor: '#fff', boxSizing: 'border-box' }}
                    >
                        <option value="M-Pesa">Vodacom M-Pesa</option>
                        <option value="Airtel Money">Airtel Money</option>
                        <option value="Orange Money">Orange Money</option>
                        <option value="Afrimoney">Afrimoney</option>
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        width: '100%',
                        padding: '14px',
                        borderRadius: '10px',
                        border: 'none',
                        backgroundColor: loading ? '#9ca3af' : '#0070f3',
                        color: 'white',
                        fontWeight: '700',
                        fontSize: '15px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        marginTop: '10px'
                    }}
                >
                    {loading ? <BeatLoader /> : `Payer ${infoForfait.prix}`}
                </button>
            </form>
        </div>
    );
}

export default function PageAchat() {
    return (
        <Suspense fallback={<p style={{ textAlign: 'center', marginTop: '50px' }}>Chargement de l'interface de paiement...</p>}>
            <FormulaireAchat />
        </Suspense>
    );
}