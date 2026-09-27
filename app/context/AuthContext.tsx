'use client';

import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import React, { createContext, useContext, useState, useEffect } from 'react';
import '@/app/lib/axios';

export interface User {
  idUser: number;
  nom: string;
  prenom: string;
  email: string;
  idSite?: number | null;
  idRole: number;
  designSite?: string | null;
  designRole: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const queryClient = useQueryClient();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const response = await axios.get('/api/me');
        setUser(response.data.user);
      } catch {
        setUser(null);

        // Redirection centralisée : que la page courante ait ou non
        // son propre garde (RoleGuard, useEffect local...), l'échec
        // de /api/me — la source de vérité de la session — suffit
        // à lui seul à renvoyer vers /login.
        if (
          typeof window !== 'undefined' &&
          !window.location.pathname.startsWith('/login')
        ) {
          window.location.href = '/login';
        }
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await axios.post('/api/logout');
    } catch (e) {
      console.error('Erreur de déconnexion serveur', e);
    } finally {
      setUser(null);
      queryClient.clear();
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};