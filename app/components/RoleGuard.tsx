'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import axios from 'axios';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

interface UserProfile {
  idUser: number;
  nom: string;
  email: string;
  designRole: string;
}

const normalize = (str: string = '') =>
  str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

export default function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const router = useRouter();

  const { data: user, isLoading, isError } = useQuery<UserProfile>({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const response = await axios.get('/api/users/profile');
      return response.data.user;
    },
    staleTime: 1000 * 60 * 5,
  });

  const userRole = user?.designRole || '';
  const currentRoleNormalized = normalize(userRole);

  const isAuthorized = allowedRoles.some(
    (role) => normalize(role) === currentRoleNormalized
  );

  useEffect(() => {

    if (!isLoading && !isError) {

      if (!user || !isAuthorized) {
        router.replace('/ventes');
      }
    }
  }, [isLoading, isError, user, isAuthorized, router]);


  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-2 text-sm text-gray-500">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p>Vérification des autorisations...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAuthorized || isError) {
    return null;
  }

  return <>{children}</>;
}