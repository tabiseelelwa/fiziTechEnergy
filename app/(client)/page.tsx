/* eslint-disable react/no-unescaped-entities */
'use client';

import { useRouter } from 'next/navigation';
import style from "@/app/styles/client/achatTicket.module.scss"

export default function PortailCaptifFiziTech() {
    const router = useRouter();

    // Redirection directe vers la page de paiement en passant l'ID du forfait
    const selectionnerForfait = (idForfait: number) => {
        router.push(`/achat?forfait=${idForfait}`);
    };

    return (
        <div className={style.achatForfaitContainer}>
            {/* Header de la marque */}
            <div className={style.achatForfaitTitre}>
                <h1>
                    FiziTech Hotspot
                </h1>
            </div>

            {/* Message de guidage */}
            <div className={style.message}>
                <h2>
                    Choisissez votre forfait
                </h2>
                <p>
                    L'accès internet s'activera automatiquement après votre paiement Mobile Money.
                </p>
            </div>

            {/* LA GRILLE DES FORFAITS */}
            <div className={style.listeForfaits}>

                {/* Forfait 1 : 30 Min */}
                <div className={style.forfait1}>
                    <div>
                        <h3>Forfait 1 Heure</h3>
                        <p>Idéal pour une vérification rapide</p>
                        <span>1 000 FC</span>
                    </div>
                    <button
                        onClick={() => selectionnerForfait(1)}
                    >
                        Choisir
                    </button>
                </div>

                {/* Forfait 2 : 1 Heure (Mis en valeur) */}
                <div className={style.forfait2}>
                    <span className={style.legende}>
                        Le plus vendu
                    </span>
                    <div>
                        <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '700' }}>Forfait 3 Heures</h3>
                        <p style={{ margin: '0', fontSize: '12px', color: '#6b7280' }}>Le meilleur compromis vitesse/prix</p>
                        <span style={{ fontSize: '22px', fontWeight: '800', color: '#0070f3', display: 'block', marginTop: '6px' }}>2 000 FC</span>
                    </div>
                    <button
                        onClick={() => selectionnerForfait(2)}
                        style={{ padding: '12px 20px', backgroundColor: '#0070f3', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}
                    >
                        Choisir
                    </button>
                </div>

                {/* Forfait 3 : 24 Heures */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', border: '1px solid #e5e7eb', borderRadius: '14px', backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.01)' }}>
                    <div>
                        <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '700' }}>Forfait 24 Heures</h3>
                        <p style={{ margin: '0', fontSize: '12px', color: '#6b7280' }}>Tranquillité totale toute la journée</p>
                        <span style={{ fontSize: '22px', fontWeight: '800', color: '#0070f3', display: 'block', marginTop: '6px' }}>5 000 FC</span>
                    </div>
                    <button
                        onClick={() => selectionnerForfait(3)}
                        style={{ padding: '12px 20px', backgroundColor: '#0070f3', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}
                    >
                        Choisir
                    </button>
                </div>

            </div>

            {/* Note de pied de page sur la sécurité */}
            <p style={{ textAlign: 'center', fontSize: '11px', color: '#9ca3af', marginTop: '30px', lineHeight: '1.5' }}>
                Réseau sécurisé. Les paiements s'effectuent via votre compte Mobile Money. Aucun échange de cash pour votre sécurité.
            </p>
        </div>
    );
}