'use client';

import React, { useState } from 'react';
import Sidebar from "@/app/components/Sidebar";

export default function AdminLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  const [showToggle, setShowToggle] = useState(true);

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    const isAtTop = e.currentTarget.scrollTop <= 10;
    setShowToggle(isAtTop);
  };

  return (
    <div className="flex h-[100dvh] w-full min-h-0 overflow-hidden bg-gray-50">
      {/* Sidebar et son bouton toggle */}
      <Sidebar showToggle={showToggle} />

      <main 
        onScroll={handleScroll}
        className="flex-1 min-h-0 h-full overflow-y-auto p-4 md:p-6"
      >
        {children}
      </main>
    </div>
  );
}