/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useState, useEffect } from 'react';
import style from '@/app/styles/client/detailsTicket.module.scss'
import { PulseLoader } from 'react-spinners';
import Link from 'next/link';

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

        // Calcul initial immédiat
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
        <div className={style.ticket}>
            <h3>Suivi de mon forfait</h3>
            <p>Entrez votre numéro pour voir le temps de connexion restant</p>

            <form onSubmit={handleVerifier}>
                <input
                    type="tel"
                    required
                    placeholder="Ex: 0812345678"
                    value={telephone}
                    onChange={(e) => setTelephone(e.target.value)}
                />
                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading ? <PulseLoader id={style.loader} /> : 'Vérifier mon statut'}
                </button>


            </form>

            {error && (
                <div className={style.error}>
                    ❌ {error}
                </div>
            )}

            {ticket && (
                <div className={style.detailsTicket}>
                    <div className={style.detailsTicketTitre}>Ticket Trouvé</div>
                    <div className={style.detailsTicketCode}>{ticket.codeTicket}</div>

                    <div className={style.detailsTicketType}>
                        <strong>Forfait :</strong> {ticket.forfait}
                    </div>

                    <div className={style.detailsTicketTempsContainer}>
                        <div className={style.detailsTicketTempsTitre} >Temps restant</div>
                        <div className={style.detailsTicketTemps}>
                            {tempsRestant}
                        </div>
                    </div>
                </div>
            )}

            <Link href={"/"}>Retour à l'accueil</Link>
        </div>
    );
}