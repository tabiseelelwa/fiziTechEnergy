/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { validerTicketSecours } from '@/app/services/ticket/ticketService';
import { BeatLoader } from 'react-spinners';
import { HiTicket, HiPhone, HiCheckCircle, HiExclamationCircle } from 'react-icons/hi';

export default function ConnexionTicketForm() {
  const [telephone, setTelephone] = useState('');
  const [codeTicket, setCodeTicket] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const ticketMutation = useMutation({
    mutationFn: validerTicketSecours,
    onSuccess: (data) => {
      alert('Connexion réussie ! Redirection vers internet...');
      // Redirection automatique pour valider le captive portal MikroTik
      if (data.redirectUrl) {
        window.location.href = `${data.redirectUrl}?username=${codeTicket}&password=${codeTicket}`;
      }
    },
    onError: (err: any) => {
      setErrorMessage(err.response?.data?.message || 'Erreur de connexion avec ce ticket.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!telephone || !codeTicket) {
      setErrorMessage('Veuillez remplir tous les champs.');
      return;
    }
    ticketMutation.mutate({ telephone, codeTicket });
  };

  return (
    <div className="min-h-screen flex flex-center items-center justify-center">
    <div className="max-w-md mx-auto bg-white border border-gray-200 rounded-2xl p-6 shadow-md">
      <div className="flex items-center gap-3 mb-4 text-emerald-600">
        <HiTicket className="w-8 h-8" />
        <h2 className="text-xl font-bold text-gray-900">Se connecter avec un Ticket</h2>
      </div>

      <p className="text-xs text-gray-500 mb-6">
        Utilisez cette méthode en cas de perturbation du réseau Mobile Money ou si vous disposez déjà d'un ticket physique.
      </p>

      {errorMessage && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl flex items-center gap-2">
          <HiExclamationCircle className="w-5 h-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
            Numéro de téléphone
          </label>
          <div className="relative">
            <HiPhone className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="tel"
              placeholder="0810000000"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
            Code du Ticket
          </label>
          <div className="relative">
            <HiTicket className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="EX: FT-98214"
              value={codeTicket}
              onChange={(e) => setCodeTicket(e.target.value.toUpperCase())}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={ticketMutation.isPending}
          className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {ticketMutation.isPending ? (
            <>
              <BeatLoader color="#ffffff" size={8} />
              <span>Vérification...</span>
            </>
          ) : (
            <>
              <HiCheckCircle className="w-5 h-5" />
              <span>Activer ma connexion</span>
            </>
          )}
        </button>
      </form>
    </div>
    </div>
  );
}