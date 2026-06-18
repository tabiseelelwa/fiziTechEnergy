/* eslint-disable react/no-unescaped-entities */
'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import style from '@/app/styles/client/succesPaiement.module.scss';
import { IoIosCheckmarkCircleOutline } from 'react-icons/io';

function ContenuSucces() {
    const searchParams = useSearchParams();
    const code = searchParams.get('code') || 'FT-0000';

    useEffect(() => {
        if (code && code !== 'FT-0000') {
            const minuterie = setTimeout(() => {
                const formulaireMikrotik = document.createElement('form');
                formulaireMikrotik.method = 'POST';

                // 🔥 SÉCURITÉ : Forçage propre de l'adresse IP cliente pour la redirection Hotspot
                const targetHost = process.env.NEXT_PUBLIC_ROUTER_HOST;
                formulaireMikrotik.action = targetHost && targetHost.trim() !== "" ? targetHost : 'http://10.5.5.1/login';

                const inputUser = document.createElement('input');
                inputUser.type = 'hidden';
                inputUser.name = 'username';
                inputUser.value = code;
                formulaireMikrotik.appendChild(inputUser);

                const inputPassword = document.createElement('input');
                inputPassword.type = 'hidden';
                inputPassword.name = 'password';
                inputPassword.value = code;
                formulaireMikrotik.appendChild(inputPassword);

                const inputDst = document.createElement('input');
                inputDst.type = 'hidden';
                inputDst.name = 'dst';
                inputDst.value = 'https://www.google.com';
                formulaireMikrotik.appendChild(inputDst);

                document.body.appendChild(formulaireMikrotik);
                formulaireMikrotik.submit();
            }, 3000); // 3 secondes suffisent largement

            return () => clearTimeout(minuterie);
        }
    }, [code]);

    return (
        <div className={style.container}>
            <div className={style.successContainer} style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div className={style.successHeader}>
                    <span style={{ fontSize: '60px', color: '#10b981' }}><IoIosCheckmarkCircleOutline /></span>
                    <h2 style={{ marginTop: '10px' }}>Paiement Validé !</h2>
                </div>

                <div style={{ margin: '25px 0' }}>
                    <p style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: '0 0 10px 0' }}>
                        Génération de votre accès en cours...
                    </p>
                    <p style={{ fontSize: '14px', color: '#6b7280', margin: '0' }}>
                        Vous allez être connecté automatiquement au Wi-Fi FiziTech dans un instant.
                    </p>
                </div>

                <div style={{ display: 'inline-block', width: '30px', height: '30px', border: '3px solid #e5e7eb', borderTopColor: '#0070f3', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />

                <style jsx global>{`
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        </div>
    );
}

export default function PagePaiementSucces() {
    return (
        <Suspense fallback={<p style={{ textAlign: 'center', marginTop: '50px' }}>Validation de la transaction...</p>}>
            <ContenuSucces />
        </Suspense>
    );
}