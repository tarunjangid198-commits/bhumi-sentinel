import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { InactivityTimeoutModal } from '../security/InactivityTimeoutModal';
import { Menu } from 'lucide-react';

export const AppLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('bhumi_desktop_sidebar_open');
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });

  const handleToggleSidebar = () => {
    // If mobile width (<1024), toggle mobile menu
    if (window.innerWidth < 1024) {
      setMobileMenuOpen((prev) => !prev);
    } else {
      // Desktop toggle
      setDesktopSidebarOpen((prev) => {
        const next = !prev;
        try {
          localStorage.setItem('bhumi_desktop_sidebar_open', String(next));
        } catch {}
        return next;
      });
    }
  };

  const handleCloseSidebar = () => {
    setMobileMenuOpen(false);
    setDesktopSidebarOpen(false);
    try {
      localStorage.setItem('bhumi_desktop_sidebar_open', 'false');
    } catch {}
  };

  const handleOpenDesktopSidebar = () => {
    setDesktopSidebarOpen(true);
    try {
      localStorage.setItem('bhumi_desktop_sidebar_open', 'true');
    } catch {}
  };

  return (
    <div className="flex h-screen bg-slate-100/70 font-sans overflow-hidden relative">
      {/* Session Security Inactivity Monitor */}
      <InactivityTimeoutModal />

      {/* Sidebar for Desktop & Mobile drawer */}
      <Sidebar
        mobileOpen={mobileMenuOpen}
        setMobileOpen={setMobileMenuOpen}
        desktopOpen={desktopSidebarOpen}
        onClose={handleCloseSidebar}
      />

      {/* Floating Expand Sidebar Button when sidebar is collapsed on desktop */}
      {!desktopSidebarOpen && (
        <button
          onClick={handleOpenDesktopSidebar}
          className="hidden lg:flex fixed left-0 top-18 z-40 bg-slate-900/90 hover:bg-blue-600 text-white py-2 px-3 rounded-r-xl shadow-xl border-y border-r border-slate-700/80 items-center gap-1.5 transition-all text-xs font-bold cursor-pointer group hover:pl-4 backdrop-blur-xs animate-in fade-in slide-in-from-left-4 duration-200"
          title="Expand Navigation Sidebar"
        >
          <Menu className="w-4 h-4 text-amber-300 group-hover:text-white transition-colors" />
          <span className="text-[11px] font-mono tracking-wider">NAV MENU</span>
        </button>
      )}

      {/* Main Content Area: transitions dynamically between lg:pl-72 (docked sidebar) and lg:pl-0 (full-width view) */}
      <div
        className={`flex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-300 ease-in-out ${
          desktopSidebarOpen ? 'lg:pl-72' : 'lg:pl-0'
        }`}
      >
        <Header
          setMobileOpen={setMobileMenuOpen}
          sidebarOpen={desktopSidebarOpen}
          onToggleSidebar={handleToggleSidebar}
        />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
