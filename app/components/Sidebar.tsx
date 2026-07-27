'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HiMenu, HiX } from 'react-icons/hi';

interface SidebarProps {
  showToggle?: boolean;
}

export default function Sidebar({ showToggle = true }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  const navItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Tarifs', href: '/tarifs' },
    { label: 'Sites', href: '/sites' },
    { label: 'Utilisateurs', href: '/utilisateurs' },
    { label: 'Profil', href: '/profil' },
  ];

  return (
    <>
      {/* 1. BOUTON TOGGLE*/}
      <button
        onClick={toggleSidebar}
        aria-label="Ouvrir le menu"
        className={`
          md:hidden fixed top-4 right-4 z-50 p-2 rounded-lg bg-white text-gray-800 shadow-md border border-gray-200
          hover:bg-gray-50 focus:outline-none transition-all duration-300 ease-in-out
        ${showToggle && !isOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-4 pointer-events-none'
          }
        `}
      >
        {isOpen ? <HiX className="hidden" /> : <HiMenu className="w-6 h-6 text-gray-700" />}
      </button>

      {/* 2. OVERLAY SOMBRE */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 z-30 bg-black/50 backdrop-blur-sm transition-opacity"
        />
      )}

      {/* 3. SIDEBAR */}
      <aside
        className={`
          fixed top-0 left-0 z-40 h-full w-64 bg-white border-r border-gray-200 p-6 flex flex-col justify-between
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:static md:translate-x-0 md:z-auto
        `}
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">
              HotSpot FiziTech
            </h2>
            <button
              onClick={closeSidebar}
              className="md:hidden p-1 rounded-md text-gray-500 hover:text-gray-700"
            >
              <HiX className="w-5 h-5" />
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
                  onClick={closeSidebar}
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
          © 2026 FiziTech
        </div>
      </aside>
    </>
  );
}