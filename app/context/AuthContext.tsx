/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Role = 'vendeur' | 'admin1' | 'admin_sup';

// 1. Définition du type de l'utilisateur
export interface User {
    id: number | string;
    name: string;
    role: Role;
    siteId?: string;
}

// 2. Définition de l'interface du Context
interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (userData: User, userToken: string) => void;
    logout: () => void;
}

// 3. Initialisation du Context avec le type
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('fizitech_user');
        const storedToken = localStorage.getItem('fizitech_token');

        if (storedUser && storedToken) {
            try {
                setUser(JSON.parse(storedUser));
                setToken(storedToken);
            } catch (e) {
                console.error('Erreur de lecture du localStorage', e);
            }
        }
        setLoading(false);
    }, []);

    const login = (userData: User, userToken: string) => {
        setUser(userData);
        setToken(userToken);
        localStorage.setItem('fizitech_user', JSON.stringify(userData));
        localStorage.setItem('fizitech_token', userToken);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('fizitech_user');
        localStorage.removeItem('fizitech_token');
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
        throw new Error("useAuth doit être utilisé dans un AuthProvider");
    }
    return context;
};