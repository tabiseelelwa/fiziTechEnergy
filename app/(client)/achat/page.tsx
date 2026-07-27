/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { BeatLoader } from 'react-spinners';
import { BsArrowLeft, BsX } from 'react-icons/bs';

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
            router.push(`/succes`);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='min-h-screen max-w-[500px] text-[#1f2937] mx-auto flex flex-col items-center gap-2 justify-center px-4'>
            <div className="w-full flex flex-col gap-4">
                {/* Bouton Retour */}
                <div className="flex items-center gap-2 text-[16px] font-semibold text-[#2563eb] cursor-pointer" onClick={() => router.push('/')}>
                    <BsArrowLeft />
                    <div>
                        Modifier le forfait
                    </div>
                </div>

                {/* Récapitulatif du forfait sélectionné */}
                <div className="bg-[#eff6ff] border-[1px] border-[#bfdbfe] p-2 rounded-[14px]">
                    <span className='text-[11px] font-bold tracking-wide-[0.5px]'>Forfait sélectionné</span>
                    <h2 className='font-extrabold text-[20px] mt-[5px] mr-0 mb-[2px] ml-0 text-[#1e40af] '>{infoForfait.designation}</h2>
                    <p className='mt-0 mb-[5px] text-[12px] text-[#0070f3]'>{infoForfait.description}</p>
                    <div className="text-[24px] text-[#0070f3] font-[900]">{infoForfait.prix}</div>
                </div>

                {error && (
                    <div className="flex justify-center items-center gap-2 p-[12px] text-[13px] text-[#dc2626] rounded-[15px] mb-[10px] bg-[#fee2e2]">
                        <BsX className='text-[22px] font-extrabold ' /> {error}
                    </div>
                )}

                {/* Formulaire de paiement */}
                <h3 className='text-center tex-[18px] font-bold text-[#0070f3]'>Finaliser votre paiement</h3>

                <form onSubmit={handleSoumissionPaiement} className='flex flex-col gap-4'>
                    <div>
                        <label className="block mb-[6px] text-[13px] text-[#4b5563] font-semibold">Numéro de téléphone Mobile Money *</label>
                        <input
                            className='p-[10px] border-[1px] border-[#d1d5db] w-full rounded-[10px] outline-0 box-border'
                            type="tel"
                            required
                            value={telephone}
                            onChange={(e) => setTelephone(e.target.value)}
                            placeholder="Ex: 0812345678"
                        />
                    </div>

                    <div>
                        <label className="block mb-[6px] text-[13px] text-[#4b5563] font-semibold">Sélectionnez votre opérateur *</label>
                        <select
                            className='w-full p-[10px] border-[1px] border-[#d1d5db] rounded-[10px] outline-0'
                            value={operateur}
                            onChange={(e) => setOperateur(e.target.value)}
                        >
                            <option value="M-Pesa">M-Pesa</option>
                            <option value="Airtel-Money">Airtel Money</option>
                            <option value="Orange-Money">Orange Money</option>
                            <option value="Afrimoney">Afrimoney</option>
                        </select>
                    </div>

                    <button
                        className='p-[14px] text-white font-bold text-[18px] rounded-[10px] mt-[10px]'
                        type="submit"
                        disabled={loading}
                        style={{
                            backgroundColor: loading ? '#9ca3af' : '#0070f3',
                            cursor: loading ? 'not-allowed' : 'pointer',
                        }}
                    >
                        {loading ? <BeatLoader color={"#fff"} /> : `Payer ${infoForfait.prix}`}
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