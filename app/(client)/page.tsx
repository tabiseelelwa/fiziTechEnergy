'use client';

import { useRouter } from 'next/navigation';

export default function PortailCaptifFiziTech() {
    const router = useRouter();

    // Redirection directe vers la page de paiement en passant l'ID du forfait
    const selectionnerForfait = (idForfait: number) => {
        router.push(`/achat?forfait=${idForfait}`);
    };

    const verifForfait = () => {
        router.push('/ticket')
    }

    // return (
    //     <div className={style.achatForfaitContainer}>
    //         <div className={style.achatForfaitTitre}>
    //             <h1>
    //                 FiziTech Hotspot
    //             </h1>
    //         </div>

    //         {/* Message de guidage */}
    //         <div className={style.message}>
    //             <h2>
    //                 Choisissez votre forfait
    //             </h2>
    //         </div>

    //         {/* LA GRILLE DES FORFAITS */}
    //         <div className={style.listeForfaits}>

    //             {/* Forfait 1 : 3 heures */}
    //             <div className={style.forfait1}>
    //                 <div>
    //                     <h3>Forfait 3 Heures</h3>
    //                     <p>Idéal pour une vérification rapide</p>
    //                     <span>2 500 FC</span>
    //                 </div>
    //                 <button
    //                     onClick={() => selectionnerForfait(1)}
    //                 >
    //                     Choisir
    //                 </button>
    //             </div>

    //             {/* Forfait 2 : 8 Heures (Mis en valeur) */}
    //             <div className={style.forfait2}>
    //                 <span className={style.legende}>
    //                     Le plus vendu
    //                 </span>
    //                 <div className={style.contenuForfait}>
    //                     <h3>Forfait 8 Heures</h3>
    //                     <p>Le meilleur compromis vitesse/prix</p>
    //                     <span>3 500 FC</span>
    //                 </div>
    //                 <button
    //                     onClick={() => selectionnerForfait(2)}
    //                 >
    //                     Choisir
    //                 </button>
    //             </div>

    //             {/* Forfait 3 : 24 Heures */}
    //             <div className={style.forfait3}>
    //                 <div className={style.contenuForfait}>
    //                     <h3>Forfait 24 Heures</h3>
    //                     <p>Tranquillité totale toute la journée</p>
    //                     <span>5 000 FC</span>
    //                 </div>
    //                 <button
    //                     onClick={() => selectionnerForfait(3)}
    //                 >
    //                     Choisir
    //                 </button>
    //             </div>
    //         </div>

    //         <button
    //             onClick={() => verifForfait()}
    //             className={style.btnVerifForfait}
    //         >
    //             Vérifier mon ticket
    //         </button>
    //     </div>
    // );

    return (
        <div className="min-h-screen max-w-[500px] mx-auto flex flex-col items-center gap-2 justify-center px-4">
            <div className="bg-[#0070f3] px-1.5 py-1 w-full rounded-[0.5rem]">
                <h1 className='text-white text-[28px] text-center font-bold'>
                    FiziTech Hotspot
                </h1>
            </div>

            {/* Message de guidage */}
            <div className="font-bold">
                <h2 className='text-[18px]'>
                    Choisissez votre forfait
                </h2>
            </div>

            {/* LA GRILLE DES FORFAITS */}
            <div className="flex flex-col gap-4 w-full">

                {/* Forfait 1 : 3 heures */}
                <div className="flex justify-between items-center gap-4 py-[0.8rem] px-[20px] shadow-[0_2px_4px_rgba(0,0,0,0.11)] rounded-[14px] border-[1px] border-[#e5e7eb]">
                    <div>
                        <h3 className='font-bold text-[16px]'>Forfait 3 Heures</h3>
                        <p className='text-[12px] text-[#6b7280]'>Idéal pour une vérification rapide</p>
                        <span className='text[22px] font-extrabold block'>2 500 FC</span>
                    </div>
                    <button
                        onClick={() => selectionnerForfait(1)}
                        className='text-[18px] font-bold bg-[#0070f3] px-[20px] py-[12px] text-white rounded-[10px]'
                    >
                        Choisir
                    </button>
                </div>

                {/* Forfait 2 : 8 Heures (Mis en valeur) */}
                <div className="flex justify-between items-center relative gap-8 rounded-[14px] bg-white shadow-[0_4px_12px_rgba(0,112,243,0.1)] border-[2px] border-[#0070f3] py-[1.25rem] px-[20px]">
                    <span className="absolute  top-[-11px] right-[15px] bg-[#0070f3] text-white py-[5px] px-[10px] rounded-[20px] tracking-wide-[5px] uppercase">
                        Le plus vendu
                    </span>
                    <div className="inline gap-16">
                        <h3 className='text-[16px] font-bold mt-0 mr-0 mb-[4px] ml-0'>Forfait 8 Heures</h3>
                        <p className='text-[12px] text-[#6b7280]'>Le meilleur compromis vitesse/prix</p>
                        <span className='text[22px] font-extrabold block'>3 500 FC</span>
                    </div>
                    <button
                        onClick={() => selectionnerForfait(2)}
                        className='text-[18px] font-bold bg-[#0070f3] px-[10px] py-[12px] text-white rounded-[10px]'
                    >
                        Choisir
                    </button>
                </div>

                {/* Forfait 3 : 24 Heures */}
                <div className="flex justify-between items-center relative gap-8 rounded-[14px] bg-white shadow-[0_4px_12px_rgba(0,112,243,0.1)] shadow-[0_2px_4px_rgba(0,0,0,0.2)] py-[1.25rem] px-[20px]">
                    <div className="inline gap-8">
                        <h3 className='text-[16px] font-bold mt-0 mr-0 mb-[4px] ml-0'>Forfait 24 Heures</h3>
                        <p className='text-[12px] text-[#6b7280]'>Tranquillité totale toute la journée</p>
                        <span className='text[22px] font-extrabold block'>5 000 FC</span>
                    </div>
                    <button
                        onClick={() => selectionnerForfait(3)}
                        className='text-[18px] font-bold bg-[#0070f3] px-[10px] py-[12px] text-white rounded-[10px]'
                    >
                        Choisir
                    </button>
                </div>
            </div>

            <button
                onClick={() => verifForfait()}
                className="bg-[#0070f3] w-full py-[0.5rem] px-0 text-white rounded-[0.35rem]"
            >
                Vérifier mon ticket
            </button>
        </div>
    );
}