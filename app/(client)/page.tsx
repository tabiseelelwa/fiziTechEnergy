'use client';

import { useRouter } from 'next/navigation';
import style from "@/app/styles/client/achatTicket.module.scss"

export default function PortailCaptifFiziTech() {
    const router = useRouter();

    // Redirection directe vers la page de paiement en passant l'ID du forfait
    const selectionnerForfait = (idForfait: number) => {
        router.push(`/achat?forfait=${idForfait}`);
    };

    const verifForfait = () => {
        router.push('/ticket')
    }

    return (
        <div className={style.achatForfaitContainer}>
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
            </div>

            {/* LA GRILLE DES FORFAITS */}
            <div className={style.listeForfaits}>

                {/* Forfait 1 : 3 heures */}
                <div className={style.forfait1}>
                    <div>
                        <h3>Forfait 3 Heures</h3>
                        <p>Idéal pour une vérification rapide</p>
                        <span>2 500 FC</span>
                    </div>
                    <button
                        onClick={() => selectionnerForfait(1)}
                    >
                        Choisir
                    </button>
                </div>

                {/* Forfait 2 : 8 Heures (Mis en valeur) */}
                <div className={style.forfait2}>
                    <span className={style.legende}>
                        Le plus vendu
                    </span>
                    <div className={style.contenuForfait}>
                        <h3>Forfait 8 Heures</h3>
                        <p>Le meilleur compromis vitesse/prix</p>
                        <span>3 500 FC</span>
                    </div>
                    <button
                        onClick={() => selectionnerForfait(2)}
                    >
                        Choisir
                    </button>
                </div>

                {/* Forfait 3 : 24 Heures */}
                <div className={style.forfait3}>
                    <div className={style.contenuForfait}>
                        <h3>Forfait 24 Heures</h3>
                        <p>Tranquillité totale toute la journée</p>
                        <span>5 000 FC</span>
                    </div>
                    <button
                        onClick={() => selectionnerForfait(3)}
                    >
                        Choisir
                    </button>
                </div>
            </div>

            <button
                onClick={() => verifForfait()}
                className={style.btnVerifForfait}
            >
                Vérifier mon ticket
            </button>
        </div>
    );
}