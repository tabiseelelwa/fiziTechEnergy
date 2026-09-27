'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const normalize = (str: string = '') =>
  str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

const DEFAULT_FALLBACK_ROUTES: Record<string, string> = {
  admin: '/',
  gerant: '/',
  caissier: '/ventes',
};

export default function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const router = useRouter();
  const { user, loading } = useAuth();

  const userRole = user?.designRole || '';
  const currentRoleNormalized = normalize(userRole);

  const isAdmin = currentRoleNormalized === 'admin';
  const isAuthorized =
    isAdmin || allowedRoles.some((role) => normalize(role) === currentRoleNormalized);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace('/login');
      return;
    }

    if (!isAuthorized) {
      const fallbackRoute = DEFAULT_FALLBACK_ROUTES[currentRoleNormalized] || '/login';
      router.replace(fallbackRoute);
    }
  }, [loading, user, isAuthorized, currentRoleNormalized, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-2 text-sm text-gray-500">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p>Vérification des autorisations...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAuthorized) {
    return null;
  }

  return <>{children}</>;
}