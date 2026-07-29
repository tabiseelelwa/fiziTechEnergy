/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Role, useAuth } from '@/app/context/AuthContext';
import { PulseLoader } from 'react-spinners';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (!username || !password) {
        throw new Error('Veuillez remplir tous les champs.');
      }

      const mockUserData = { id: 1, name: username, role: 'admin1' as Role };
      const mockToken = 'eyJhbGciOiJIUzI1Ni...';

      login(mockUserData, mockToken);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Identifiants incorrects.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full flex h-full items-center justify-center bg-gray-50 p-4 font-sans overflow-y-auto">
      <div className="w-full max-w-sm bg-white border border-gray-200 rounded-xl p-6 shadow-sm my-auto">

        {/* En-tête */}
        <div className="text-center space-y-1">
          <h1 className="text-xl font-bold text-gray-900">
            HotSpot FiziTech
          </h1>
        </div>

        {/* Message d'erreur */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-xs text-center p-2.5 rounded-lg">
            {error}
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700">
              Identifiant
            </label>
            <input
              type="text"
              placeholder="Nom d'utilisateur"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700">
              Mot de passe
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium text-sm rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <PulseLoader color="#ffffff" size={8} />
            ) : (
              'Se connecter'
            )}
          </button>
        </form>

        {/* Pied de page */}
        <div className="pt-2 text-center text-xs text-gray-400 border-t border-gray-100">
          © 2026 FiziTech
        </div>
      </div>
    </div>
  );
}