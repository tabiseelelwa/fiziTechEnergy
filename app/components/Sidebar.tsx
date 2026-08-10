'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HiX } from 'react-icons/hi';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { label: 'Dashboard', href: '/' },
    { label: 'Tarifs', href: '/tarifs' },
    { label: 'Sites', href: '/sites' },
    { label: 'Utilisateurs', href: '/utilisateurs' },
    { label: 'Profil', href: '/profil' },
  ];

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
            <h2 className="text-lg font-bold text-gray-900">
              Empire Hotspot 
            </h2>
            <button
              onClick={onClose}
              aria-label="Fermer le menu"
              className="md:hidden p-1 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            >
              <HiX className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Pied de la Sidebar */}
        <div className="pt-4 border-t border-gray-100 text-xs text-gray-400">
          © 2026 Empire hotspot
        </div>
      </aside>
    </>
  );
}