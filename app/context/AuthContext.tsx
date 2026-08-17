'use client';

import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import React, { createContext, useContext, useState, useEffect } from 'react';

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
  token: string | null;
  loading: boolean;
  login: (userData: User, userToken: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const queryClient = useQueryClient();

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedUser = localStorage.getItem('Empire-Lab_user');
        const storedToken = localStorage.getItem('Empire-Lab_token');

        if (storedUser && storedToken) {
          const parsedUser: User = JSON.parse(storedUser);
          setUser(parsedUser);
          setToken(storedToken);
        }
      } catch (e) {
        console.error('Erreur de lecture du localStorage :', e);
        localStorage.removeItem('Empire-Lab_user');
        localStorage.removeItem('Empire-Lab_token');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = (userData: User, userToken: string) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('Empire-Lab_user', JSON.stringify(userData));
    localStorage.setItem('Empire-Lab_token', userToken);
  };

  const logout = async () => {

    try {
      // Supprime le cookie côté serveur
      await axios.post('/api/logout');
    } catch (e) {
      console.error('Erreur de déconnexion serveur', e);
    } finally {
      // Nettoie l'état local et le localStorage
      setUser(null);
      setToken(null);
      localStorage.removeItem('Empire-Lab_user');
      localStorage.removeItem('Empire-Lab_token');
      queryClient.clear();
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
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