/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { BeatLoader } from 'react-spinners';
import style from "@/app/styles/client/ticket.module.scss"
import { BsArrowLeft } from 'react-icons/bs';

// Base de données locale temporaire des forfaits pour l'affichage Front-End rapide
const FORFAITS_CONFIG = {
    '1': { designation: 'Forfait 3 Heure', prix: '2 500 FC', description: 'Idéal pour une vérification rapide' },
    '2': { designation: 'Forfait 8 Heures', prix: '3 500 FC', description: 'Le meilleur compromis vitesse/prix' },
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
                    nomClient: 'Client Hotspot',
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
        <div className={style.ticketContainer}>
            <div className={style.ticket}>

                {/* Bouton Retour */}
                <div className={style.ticketHeader} onClick={() => router.push('/')}>
                    <BsArrowLeft />
                    <div>
                        Modifier le forfait
                    </div>
                </div>
                {/* Récapitulatif du forfait sélectionné */}
                <div className={style.ticketRecap}>
                    <span>Forfait sélectionné</span>
                    <h2>{infoForfait.designation}</h2>
                    <p>{infoForfait.description}</p>
                    <div className={style.ticketPrix}>{infoForfait.prix}</div>
                </div>

                {/* Formulaire de paiement */}
                <h3>Finaliser votre paiement</h3>

                {error && (
                    <div className={style.error}>
                        ⚠️ {error}
                    </div>
                )}

                <form onSubmit={handleSoumissionPaiement}>
                    <div className={style.ticketTelephone}>
                        <label>Numéro de téléphone Mobile Money *</label>
                        <input
                            type="tel"
                            required
                            value={telephone}
                            onChange={(e) => setTelephone(e.target.value)}
                            placeholder="Ex: 0812345678"
                        />
                    </div>

                    <div className={style.ticketOperateur}>
                        <label>Sélectionnez votre opérateur *</label>
                        <select
                            value={operateur}
                            onChange={(e) => setOperateur(e.target.value)}
                        >
                            <option value="M-Pesa">Vodacom M-Pesa</option>
                            <option value="Airtel-Money">Airtel Money</option>
                            <option value="Orange-Money">Orange Money</option>
                            <option value="Afrimoney">Afrimoney</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            backgroundColor: loading ? '#9ca3af' : '#0070f3',
                            cursor: loading ? 'not-allowed' : 'pointer',
                        }}
                    >
                        {loading ? <BeatLoader style={{ color: "#fff" }} /> : `Payer ${infoForfait.prix}`}
                    </button>
                </form>
            </div>
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