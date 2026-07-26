/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useState, useEffect } from 'react';
import { PulseLoader } from 'react-spinners';
import { useRouter } from 'next/navigation';

interface TicketInfos {
    codeTicket: string;
    dateExpiration: string;
    forfait: string;
}

export default function VerifTicketPage() {
    const [telephone, setTelephone] = useState('');
    const [ticket, setTicket] = useState<TicketInfos | null>(null);
    const [tempsRestant, setTempsRestant] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const router = useRouter()

    // Fonction qui calcule l'écart entre maintenant et la date d'expiration
    const calculerTempsRestant = (dateExpirationStr: string) => {
        const maintenant = new Date().getTime();
        const expiration = new Date(dateExpirationStr).getTime();
        const difference = expiration - maintenant;

        if (difference <= 0) {
            return "Forfait expiré";
        }

        const heures = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const secondes = Math.floor((difference % (1000 * 60)) / 1000);

        // Formatage pour afficher "02h 45m 12s"
        return `${heures.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${secondes.toString().padStart(2, '0')}s`;
    };

    // Mettre à jour le compte à rebours toutes les secondes si un ticket est trouvé
    useEffect(() => {
        if (!ticket) return;

        // Calcul initial du temps restant
        setTempsRestant(calculerTempsRestant(ticket.dateExpiration));

        const intervalle = setInterval(() => {
            const nvTemps = calculerTempsRestant(ticket.dateExpiration);
            setTempsRestant(nvTemps);

            if (nvTemps === "Forfait expiré") {
                clearInterval(intervalle);
                setTicket(null);
            }
        }, 1000);

        return () => clearInterval(intervalle);
    }, [ticket]);

    const handleVerifier = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(false);
        setError('');
        setTicket(null);
        setLoading(true);

        try {
            const response = await fetch('/api/verif-ticket', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ telephone })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Impossible de vérifier le ticket.');
            }

            setTicket(data.ticket);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen max-w-[500px] mx-auto flex flex-col justify-center items-center gap-[0.8rem] p-4">
            <h3 className='text-[18px] font-bold text-[#0070f3] '>Suivi de mon forfait</h3>
            <p className='text-center text-[13px] text-[#666]'>Entrez votre numéro pour voir le temps de connexion restant</p>

            <form
                onSubmit={handleVerifier}
                className='flex flex-col gap-[0.8rem] w-full'
            >
                <input
                    className='p-[10px] border-[1px] border-[#ccc] rounded-[7px] outline-0'
                    type="tel"
                    required
                    placeholder="Ex: 0812345678"
                    value={telephone}
                    onChange={(e) => setTelephone(e.target.value)}
                />
                <button
                    className='text-white bg-[#0070f3] border-0 p-[10px] rounded-[7px] cursor-pointer'
                    type="submit"
                    disabled={loading}
                >
                    {loading ? <PulseLoader className='text-white' /> : 'Vérifier mon statut'}
                </button>
            </form>

            {error && (
                <div className="text-[#dc2626] bg-[#fee2e2] w-full text-[14px] text-center p-[10px] rounded-[7px]">
                    ❌ {error}
                </div>
            )}

            {ticket && (
                <div className="p-[20px] border-[1px]  border-[#e5e7eb] rounded-[8px] bg-[#f9fafb] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] w-full">
                    <div className="uppercase text-[#6b7280] text-[11px] font-bold tracking-wide-[1px]">Ticket Trouvé</div>
                    <div className="text-[24px] font-bold text-[#111827] mt-[5px] mb-[#5px]">{ticket.codeTicket}</div>

                    <div className="text-[#374151] text-[14px] mt-[15px] mb-[5px]">
                        <strong>Forfait :</strong> {ticket.forfait}
                    </div>

                    <div className="p-[10px] bg-[#eff6ff] border-[1px] border-[#bfdbfe] text-center rounded-[7px]">
                        <div className="text-[12px] text-[#1e40af] font-bold uppercase "  >Temps restant</div>
                        <div className="text-[22px] font-bold text-[#1d4ed8]">
                            {tempsRestant}
                        </div>
                    </div>
                </div>
            )}
            <button
                onClick={() => router.push('/')}
                className='border-0 bg-[#d2d1d1] text-[#3f68a2] w-full rounded-[0.3rem] p-[0.5rem]'
            >
                Retour à l'accueil
            </button>
        </div>
    );
}