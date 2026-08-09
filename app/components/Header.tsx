'use client';

import { useAuth } from '@/app/context/AuthContext';
import { FiLogOut, FiUser } from 'react-icons/fi';
import { HiMenu } from 'react-icons/hi';

interface HeaderProps {
  onToggleSidebar?: () => void;
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  const { user, logout } = useAuth();

  return (
    <header className="w-full bg-white border-b border-gray-200 px-4 sm:px-6 py-3 flex justify-between items-center">
      <div className="flex items-center gap-3">
        {/* Bouton Toggle Mobile */}
        <button
          onClick={onToggleSidebar}
          aria-label="Ouvrir le menu"
          className="md:hidden p-2 text-gray-600 hover:text-gray-900 shadow-lg hover:bg-gray-100 rounded-lg transition-colors focus:outline-none"
        >
          <HiMenu size={22} />
        </button>

        <div className="flex items-center gap-2 text-right">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
            {user?.prenom?.[0] && user?.nom?.[0] ? (
              `${user.prenom[0]}${user.nom[0]}`
            ) : (
              <FiUser size={16} />
            )}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-gray-900 leading-none">
              {user?.prenom} {user?.nom}
            </p>
            <p className="text-[10px] text-gray-500 font-medium leading-tight">
              {user?.designRole}
            </p>
          </div>
        </div>

      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm font-semibold text-gray-800">
          {user?.designSite ? user.designSite : 'Administration Globale'}
        </span>

        <button
          onClick={logout}
          title="Se déconnecter"
          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <FiLogOut size={18} />
        </button>
      </div>
    </header>
  );
}