/* eslint-disable react/no-unescaped-entities */
'use client';

import { useRouter } from 'next/navigation';
import { BsArrowLeft, BsExclamationTriangle } from 'react-icons/bs';

export default function NotFound() {
    const router = useRouter();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-800 p-4">
            <div className="flex flex-col items-center text-center max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-gray-100">

                {/* Icône d'avertissement */}
                <div className="flex items-center justify-center w-16 h-16 bg-blue-50 text-blue-600 rounded-full mb-4">
                    <BsExclamationTriangle className="w-8 h-8" />
                </div>

                {/* Titre 404 & Message */}
                <span className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-1">
                    Erreur 404
                </span>
                <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
                    Page introuvable
                </h1>
                <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                    Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
                </p>

                {/* Boutons d'action intuitive */}
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl border border-gray-300 font-semibold text-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                        <BsArrowLeft className="w-4 h-4" />
                        Retour
                    </button>
                </div>
            </div>
        </div>
    );
}