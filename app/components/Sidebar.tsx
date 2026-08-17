'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HiX } from 'react-icons/hi';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  label: string;
  href: string;
  role: string[];
}

interface UserProfile {
  idUser: number;
  nom: string;
  email: string;
  designRole: string;
}

// Nettoyage et normalisation des chaînes (supprime accents et minuscules)
const normalize = (str: string = '') =>
  str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const annee = new Date().getFullYear();

  const { data: user, isLoading, isError } = useQuery<UserProfile>({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const response = await axios.get('/api/users/profile');
      return response.data.user;
    },
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  const navItems: NavItem[] = [
    { label: 'Dashboard', href: '/', role: ['Admin'] },
    { label: 'Mes Ventes', href: '/ventes', role: ['Admin', 'Gerant', 'Caissier', 'Caissiere'] },
    { label: 'Tarifs', href: '/tarifs', role: ['Admin', 'Gerant', 'Caissier'] },
    { label: 'Sites', href: '/sites', role: ['Admin'] },
    { label: 'Utilisateurs', href: '/utilisateurs', role: ['Admin', 'Gerant'] },
    { label: 'Profil', href: '/profil', role: ['Admin', 'Gerant', 'Caissier', 'Caissiere'] },
  ];

  const rawRole = user?.designRole || '';
  const currentRoleNormalized = normalize(rawRole);

  const filteredNavItems = navItems.filter((item) =>
    item.role.some((r) => normalize(r) === currentRoleNormalized)
  );

  return (
    <>
      {/* OVERLAY SOMBRE */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-72 bg-white border-r border-gray-200 p-6 flex flex-col justify-between
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:static md:translate-x-0 md:z-auto
        `}
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Empire Hotspot
              </h2>
            </div>
            <button
              onClick={onClose}
              aria-label="Fermer le menu"
              className="md:hidden p-1 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            >
              <HiX className="w-6 h-6" />
            </button>
          </div>

          <nav className="space-y-1">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-10 bg-gray-100 animate-pulse rounded-lg w-full mb-1" />
              ))
            ) : isError ? (
              <div className="p-3 text-xs text-red-500 bg-red-50 rounded-lg">
                Erreur de chargement du profil
              </div>
            ) : filteredNavItems.length === 0 ? (
              <div className="p-3 text-xs text-amber-600 bg-amber-50 rounded-lg">
                Aucun menu disponible pour ce rôle ({rawRole || 'Inconnu'}).
              </div>
            ) : (
              filteredNavItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-600 font-semibold'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })
            )}
          </nav>
        </div>

        {/* Pied de la Sidebar */}
        <div className="pt-4 border-t border-gray-100 flex flex-col gap-1">
          {user && (
            <p className="text-xs font-semibold text-gray-700 truncate">
              {user.nom}
            </p>
          )}
          <p className="text-xs text-gray-400">
            © {annee} Empire hotspot
          </p>
        </div>
      </aside>
    </>
  );
}