'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { PulseLoader } from 'react-spinners';
import axios from 'axios';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (!email || !pass) {
        throw new Error('Veuillez remplir tous les champs.');
      }

      const response = await axios.post('/api/login', {
        email,
        pass,
      });

      const { user, token } = response.data;

      // Enregistrement de l'utilisateur dans le contexte
      login(user, token);

      // Redirection vers le dashboard
      router.push('/dashboard');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Identifiants incorrects.');
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Une erreur est survenue lors de la connexion.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full flex h-full items-center justify-center bg-gray-50 p-4 font-sans overflow-y-auto">
      <div className="w-full max-w-sm bg-white border border-gray-200 rounded-xl p-6 shadow-sm my-auto space-y-4">

        {/* En-tête */}
        <div className="text-center space-y-1">
          <h1 className="text-xl font-bold text-gray-900">
            HotSpot Empire
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
              Adresse e-mail
            </label>
            <input
              type="email"
              placeholder="ex: admin@empirelab.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              required
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium text-sm rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex justify-center items-center"
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
          © 2026 Empire-Lab
        </div>
      </div>
    </div>
  );
}