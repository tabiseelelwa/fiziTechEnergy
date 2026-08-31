/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { BeatLoader } from 'react-spinners';
import { BsArrowLeft, BsX } from 'react-icons/bs';
import { getTarifs, TarifData } from '@/app/services/tarif/tarifService';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

function FormulaireAchat() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const forfaitId = searchParams.get('forfait') || '2';
    const siteId = searchParams.get('site') || '1';

    const [telephone, setTelephone] = useState('');
    const [operateur, setOperateur] = useState('M-Pesa');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { data: forfaits = [], isLoading, isError } = useQuery<TarifData[]>({
        queryKey: ["forfaits-publics"],
        queryFn: getTarifs,
    });

    const forfaitSelectionne = forfaits.find(
        (f: any) => String(f.idForfait || f.idTarif || f.codeTypeForfait) === String(forfaitId)
    );

    const handleSoumissionPaiement = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post('/api/demande-paiement', {
                nomClient: 'Client Hotspot',
                telephone: telephone.trim(),
                codeTypeForfait: parseInt(forfaitId, 10),
                idSite: parseInt(siteId, 10),
                operateur
            });

            if (response.status === 200 || response.status === 201) {
                // Redirection avec le paramètre du site
                router.push(`/client/succes?site=${siteId}`);
            }
        } catch (err: any) {
            // Capture propre du message d'erreur retourné par Axios / backend
            const messageErreur = 
                err.response?.data?.message || 
                err.message || 
                'Une erreur est survenue lors du paiement.';
            setError(messageErreur);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='min-h-screen max-w-[500px] text-[#1f2937] mx-auto flex flex-col items-center gap-2 justify-center px-4'>
            {isError && (
                <p className="text-red-500 text-sm text-center py-4">
                    Impossible de charger le forfait. Veuillez vérifier votre connexion.
                </p>
            )}

            {isLoading ? (
                <div className="py-12 flex justify-center">
                    <BeatLoader color="#0070f3" />
                </div>
            ) : (
                <div className="w-full flex flex-col gap-4">
                    {/* Bouton Retour */}
                    <div 
                        className="flex items-center gap-2 text-[16px] font-semibold text-[#2563eb] cursor-pointer" 
                        onClick={() => router.push(`/client?site=${siteId}`)}
                    >
                        <BsArrowLeft />
                        <div>Modifier le forfait</div>
                    </div>

                    {/* Récapitulatif du forfait sélectionné */}
                    <div className="bg-[#eff6ff] border-[1px] border-[#bfdbfe] p-4 rounded-[14px]">
                        <span className='text-[11px] font-bold tracking-wide uppercase text-[#1e40af]'>
                            Forfait sélectionné
                        </span>
                        <h2 className='font-extrabold text-[20px] mt-[5px] mb-[2px] text-[#1e40af]'>
                            {forfaitSelectionne?.designation || (forfaitSelectionne as any)?.nomForfait || "Forfait Hotspot"}
                        </h2>
                        <p className='mt-0 mb-[5px] text-[12px] text-[#0070f3]'>
                            {forfaitSelectionne?.description || "Accès Internet Wi-Fi"}
                        </p>
                        <div className="text-[24px] text-[#0070f3] font-[900]">
                            {forfaitSelectionne?.prix ? `${Number(forfaitSelectionne.prix).toLocaleString('fr-FR')} FC` : '---'}
                        </div>
                    </div>

                    {error && (
                        <div className="flex justify-center items-center gap-2 p-[12px] text-[13px] text-[#dc2626] rounded-[15px] mb-[10px] bg-[#fee2e2]">
                            <BsX className='text-[22px] font-extrabold' /> {error}
                        </div>
                    )}

                    {/* Formulaire de paiement */}
                    <h3 className='text-center text-[18px] font-bold text-[#0070f3]'>Finaliser votre paiement</h3>

                    <form onSubmit={handleSoumissionPaiement} className='flex flex-col gap-4'>
                        <div>
                            <label className="block mb-[6px] text-[13px] text-[#4b5563] font-semibold">
                                Numéro de téléphone Mobile Money *
                            </label>
                            <input
                                className='p-[10px] border-[1px] border-[#d1d5db] w-full rounded-[10px] outline-0 box-border focus:ring-1 focus:ring-[#0070f3]'
                                type="tel"
                                required
                                value={telephone}
                                onChange={(e) => setTelephone(e.target.value)}
                                placeholder="Ex: 0812345678"
                            />
                        </div>

                        <div>
                            <label className="block mb-[6px] text-[13px] text-[#4b5563] font-semibold">
                                Sélectionnez votre opérateur *
                            </label>
                            <select
                                className='w-full p-[10px] border-[1px] border-[#d1d5db] rounded-[10px] outline-0 focus:ring-1 focus:ring-[#0070f3]'
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
                            className='p-[14px] text-white font-bold text-[18px] rounded-[10px] mt-[10px] transition-colors'
                            type="submit"
                            disabled={loading || !forfaitSelectionne}
                            style={{
                                backgroundColor: (loading || !forfaitSelectionne) ? '#9ca3af' : '#0070f3',
                                cursor: (loading || !forfaitSelectionne) ? 'not-allowed' : 'pointer',
                            }}
                        >
                            {loading ? (
                                <BeatLoader color={"#fff"} size={10} />
                            ) : (
                                `Payer ${forfaitSelectionne?.prix ? `${Number(forfaitSelectionne.prix).toLocaleString('fr-FR')} FC` : ''}`
                            )}
                        </button>
                    </form>
                </div>
            )}
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