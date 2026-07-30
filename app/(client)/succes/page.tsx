'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { IoIosCheckmarkCircleOutline } from 'react-icons/io';

function ContenuSucces() {
    const searchParams = useSearchParams();
    const code = searchParams.get('code') || 'FT-0000';

    useEffect(() => {
        if (code && code !== 'FT-0000') {
            const minuterie = setTimeout(() => {
                const formulaireMikrotik = document.createElement('form');
                formulaireMikrotik.method = 'POST';

                //La redirection Hotspot
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
            }, 3000
            );
            return () => clearTimeout(minuterie);
        }
    }, [code]);

    return (
        <div className="flex justify-center items-center min-h-screen max-w-[500px] mx-auto mb-[50] mr-auto ml-auto p-4">
            <div className="border-[2px] border-[#10b981] bg-[#f0fdf4] p-[30px] text-center mt-[50px] rounded-[10px]">
                <div className="flex flex-col justify-center items-center">
                    <span className="text-[60px] text-[#10b981] text-center"><IoIosCheckmarkCircleOutline /></span>
                    <h2 className='mt-[10px]'>Paiement Validé !</h2>
                </div>

                <div className='mt-[25px] mb-[25px]'>
                    <p className='text-[16px] font-semibold text-[#1f2937] mb-[10px]'>
                        Connexion en cours...
                    </p>
                    <p className='text-[14px] text-[#6b7280]'>
                        Vous allez être connecté automatiquement au Wi-Fi Empire-Lab dans un instant.
                    </p>
                </div>

                <div className='inline-block w-[30px] h-[30px] border-[3px] border-[#e5e7eb] border-t-[#0070f3] rounded-[50%]' style={{ animation: 'spin 1s linear infinite' }} />

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