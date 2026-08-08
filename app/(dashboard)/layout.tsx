'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import Sidebar from "@/app/components/Sidebar";
import { PulseLoader } from 'react-spinners';
import Header from '../components/Header';

export default function AdminLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  const [showToggle, setShowToggle] = useState(true);
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirection automatique si l'utilisateur n'est pas connecté
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    const isAtTop = e.currentTarget.scrollTop <= 10;
    setShowToggle(isAtTop);
  };

  // Affichage d'un loader pendant la vérification du contexte d'authentification
  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <PulseLoader color="#2563eb" size={12} />
      </div>
    );
  }

  // Évite de rendre le contenu du dashboard si l'utilisateur n'est pas identifié
  if (!user) {
    return null;
  }

  return (
  <div className="flex h-[100dvh] w-full min-h-0 overflow-hidden bg-gray-50">
    <Sidebar showToggle={showToggle} />

    <div className="flex-1 flex flex-col min-w-0 h-full">
      <Header />
      <main
        onScroll={handleScroll}
        className="flex-1 min-h-0 h-full overflow-y-auto p-4 md:p-6"
      >
        {children}
      </main>
    </div>
  </div>
);
}