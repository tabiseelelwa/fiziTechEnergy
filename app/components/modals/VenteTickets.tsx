/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { BeatLoader } from 'react-spinners';
import { BsCheckCircleFill, BsX } from 'react-icons/bs';

// Configuration des forfaits disponibles au guichet
const FORFAITS_CONFIG = {
    '1': { designation: 'Forfait 3 Heures', prix: '2 500 FC', durationMins: 180, priceNum: 2500 },
    '2': { designation: 'Forfait 8 Heures', prix: '3 500 FC', durationMins: 480, priceNum: 3500 },
    '3': { designation: 'Forfait 24 Heures', prix: '5 000 FC', durationMins: 1440, priceNum: 5000 },
};

type ForfaitKey = keyof typeof FORFAITS_CONFIG;

interface VenteTickets {
    setModalVenteTicket: (value: boolean) => void
}

export const VendeurPage = ({ setModalVenteTicket }: VenteTickets) => {

    // États du formulaire
    const [telephone, setTelephone] = useState('');
    const [forfaitId, setForfaitId] = useState<ForfaitKey>('2');
    const [modePaiement, setModePaiement] = useState('Cash');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // État du ticket généré (Sert de contrôle d'affichage de la Modal)
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
            const reponse = await fetch('/api/vente', {
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

            // Ticket généré avec succès -> Ouvre la Popup
            setTicketGenere({
                code: donnees.ticket.code,
                telephone: telephone.trim(),
                designation: infoForfait.designation,
                prix: infoForfait.prix,
            });

            // Réinitialisation du champ téléphone pour la vente suivante
            setTelephone('');

        } catch (err: any) {
            setError(err.message || 'Impossible de contacter le serveur.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black/70 z-[1000] backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-[500px] rounded-[16px] relative text-center text-[#1f2937] animate-[fadeModalIn_250ms_ease-out]">
                <div className="p-4">
                    <div className="flex flex-col gap-[1rem] w-full">
                        <div className="flex items-center justify-end items-center gap-[0.5rem] text-[16px] font-semibold cursor-pointer w-full">
                            <button
                                onClick={() => setModalVenteTicket(false)}
                                className='flex items-center gap-[0.5rem] bg-[#ff0000] p-[5px] text-[28px] text-white rounded-[0.5rem] font-bold cursor-pointer'
                            >
                                <BsX />
                            </button>
                        </div>

                        <h3 className='text-[18px] text-[#0070f3] font-[900]'>PAIEMENT CASH</h3>

                        {error && (
                            <div className="p-[12px] bg-[#fee2e2] text-[#dc2626] mb-[15px] font-tin text-[13px] rounded-[10px]">
                                ⚠️ {error}
                            </div>
                        )}

                        {/* Formulaire de Vente */}
                        <form
                            onSubmit={handleVendreTicket}
                            className='flex flex-col gap-[1.2rem]'
                        >
                            <div>
                                <label className='block mb-[6px] text-[13px] font-semibold text-[#4b5563]'>Numéro de téléphone du client *</label>
                                <input
                                    className='p-[12px] rounded-[10px] border-1 border-[#d1d5db] text-[15px] box-border outline-0 w-full'
                                    type="tel"
                                    required
                                    value={telephone}
                                    onChange={(e) => setTelephone(e.target.value)}
                                    placeholder="Ex: 0812345678"
                                />
                            </div>

                            <div>
                                <label className='block mb-[6px] text-[13px] font-semibold text-[#4b5563]'>Forfait sélectionné *</label>
                                <select
                                    className='p-[12px] rounded-[10px] border-1 border-[#d1d5db] text-[15px] box-border outline-0 w-full'
                                    value={forfaitId}
                                    onChange={(e) => setForfaitId(e.target.value as ForfaitKey)}
                                >
                                    <option value="1">Forfait 3 Heures — 2 500 FC</option>
                                    <option value="2">Forfait 8 Heures — 3 500 FC</option>
                                    <option value="3">Forfait 24 Heures — 5 000 FC</option>
                                </select>
                            </div>

                            <div>
                                <label className='block mb-[6px] text-[13px] font-semibold text-[#4b5563]'>Mode de règlement *</label>
                                <select
                                    className='p-[12px] rounded-[10px] border-1 border-[#d1d5db] text-[15px] box-border outline-0 w-full'
                                    value={modePaiement}
                                    onChange={(e) => setModePaiement(e.target.value)}
                                >
                                    <option value="Cash">Espèces (Cash au comptoir)</option>
                                    <option value="M-Pesa">Direct Cash (M-Pesa Vendeur)</option>
                                    <option value="Airtel-Money">Direct Cash (Airtel Vendeur)</option>
                                </select>
                            </div>

                            <button
                                className='w-full p-[14px] rounded-[10px] border-0 texte-white mt-[10px] text-[15px] font-bold text-white'
                                type="submit"
                                disabled={loading}
                                style={{
                                    backgroundColor: loading ? '#9ca3af' : '#22c55e',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                }}
                            >
                                {loading ? (
                                    <BeatLoader style={{ color: "#fff" }} color={"#fff"} />
                                ) : (
                                    `Valider la vente (${FORFAITS_CONFIG[forfaitId].prix})`
                                )}
                            </button>
                        </form>
                    </div>

                    {ticketGenere && (
                        <div className="fixed inset-0 flex justify-center items-center bg-black/70 z-[1000] backdrop-blur-sm p-4">
                            <div className="bg-white max-w-[500px] rounded-[16px] w-full relative text-center text-[#1f2937] animate-[fadeModalIn_300ms_ease-out]">
                                <div className="flex flex-col items-center justify-center text-[#1f2937] p-[1rem]">
                                    <div className="flex items-center justify-center gap-[8px] text-[#22c55e] mb-[12px]">
                                        <BsCheckCircleFill size={28} />
                                        <span className="font-bold text-[18px] uppercase">Vente Enregistrée</span>
                                    </div>

                                    <p className="14px text-[#4b5563] my-[8px] mx-0">Code du ticket à remettre au client :</p>

                                    <div className="bg-[#f3f4f6] p-[15px] rounded-[12px] border-2 border-dashed border-blue-500 mt-[15px] mb-[15px]">
                                        <h2 className="text-[38px] text-[#1d4ed8] tracking-wide-[3px] m-0 font-bold">
                                            {ticketGenere.code}
                                        </h2>
                                    </div>

                                    <div className="text-left text-[14px] bg-[#f9fafb] py-[16px] px-[12px] rounded-[8px] border-1 border-[#e5e7eb]">
                                        <div className='mt-[6px]'><strong>Client :</strong> {ticketGenere.telephone}</div>
                                        <div className='mt-[6px]'><strong>Forfait :</strong> {ticketGenere.designation}</div>
                                        <div><strong>Montant payé :</strong> {ticketGenere.prix}</div>
                                    </div>

                                    <button
                                        onClick={() => setTicketGenere(null)}
                                        className="mt-[20px] w-full p-[12px] bg-[#2563eb] text-white border-0 rounded-[8px] text-[15px] font-bold cursor pointer"
                                    >
                                        Fermer et effectuer une autre vente
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}