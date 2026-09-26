import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  MapPin,
  FileSpreadsheet,
  CheckSquare,
  ArrowRightLeft,
  UserCheck,
  AlertTriangle,
  BrainCircuit,
  Sliders,
  FolderGit2,
  Users,
  FileText,
  History,
  Shield,
  LogOut,
  ChevronRight,
  Coins,
  QrCode,
  Smartphone,
  X,
  Award,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  desktopOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  mobileOpen,
  setMobileOpen,
  desktopOpen = true,
  onClose,
}) => {
  const navigate = useNavigate();
  const { currentUser, files, logout } = useApp();

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      setMobileOpen(false);
    }
  };

  // Incoming files count for the current officer with defensive null-safety
  const roleName = (currentUser?.role || '').toLowerCase().replace(' officer', '').trim();

  const safeFiles = Array.isArray(files) ? files : [];

  const incomingCount = safeFiles.filter(
    (f) =>
      Boolean(f && (f.status === 'SENT' || f.status === 'RECEIVED')) &&
      typeof f.currentOfficer === 'string' &&
      f.currentOfficer.toLowerCase().includes(roleName)
  ).length;

  const returnedCount = safeFiles.filter(
    (f) =>
      Boolean(f && f.status === 'RETURNED') &&
      typeof f.currentOfficer === 'string' &&
      f.currentOfficer.toLowerCase().includes(roleName)
  ).length;

  const navItems = [
    { name: 'Command Center', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Acquisition Map', path: '/map', icon: MapPin },
    {
      name: 'District Land Rates',
      path: '/land-rates',
      icon: Coins,
      badge: 'meter/sq, acre',
      badgeColor: 'bg-emerald-600 text-white',
    },
    { name: 'Land Cases', path: '/cases', icon: FileSpreadsheet },
    {
      name: `${currentUser.role.replace(' Officer', '')} Portal`,
      path: '/portal',
      icon: UserCheck,
      badge: incomingCount > 0 ? `${incomingCount} incoming` : returnedCount > 0 ? `${returnedCount} returned` : undefined,
      badgeColor: incomingCount > 0 ? 'bg-amber-500 text-white' : 'bg-rose-500 text-white',
    },
    { name: 'My Tasks', path: '/tasks', icon: CheckSquare },
    { name: 'File Movement', path: '/files', icon: ArrowRightLeft },
    { name: 'Risk & Bottlenecks', path: '/bottlenecks', icon: AlertTriangle },
    { name: 'Scenario Simulator', path: '/simulator', icon: Sliders },
    { name: 'AI Copilot', path: '/copilot', icon: BrainCircuit, badge: 'Intelligence', badgeColor: 'bg-indigo-600 text-white' },
    { name: 'Projects', path: '/projects', icon: FolderGit2 },
    {
      name: 'Completed Projects',
      path: '/completed-projects',
      icon: Award,
      badge: 'Archive',
      badgeColor: 'bg-emerald-600 text-white',
    },
    { name: 'Officers Directory', path: '/officers', icon: Users },
    { name: 'Reports & Export', path: '/reports', icon: FileText },
    { name: 'Audit Trail', path: '/audit', icon: History },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-slate-900 text-slate-200 flex flex-col transition-all duration-300 ease-in-out shadow-2xl ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } ${desktopOpen ? 'lg:translate-x-0' : 'lg:-translate-x-full'}`}
      >
        {/* Brand Header with Visible Close / Collapse Button */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20 shrink-0">
              <Shield className="w-6 h-6 text-amber-300" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold tracking-wider text-base text-white truncate">BHUMI-SENTINEL</span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-tight leading-tight truncate">
                Land Acquisition Risk & Intel
              </p>
            </div>
          </div>

          {/* Clear, visible close (✕) / collapse toggle button */}
          <button
            onClick={handleClose}
            className="p-1.5 sm:p-2 rounded-xl text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700/90 border border-slate-700/80 transition-all flex items-center justify-center cursor-pointer shadow-xs shrink-0 group focus:outline-hidden focus:ring-2 focus:ring-blue-500/40"
            title="Close / Minimize Sidebar (View Dashboard Full Width)"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5 text-slate-300 group-hover:text-white group-hover:scale-110 transition-transform" />
          </button>
        </div>

        {/* Tagline micro banner */}
        <div className="px-5 py-2 bg-slate-950/60 border-b border-slate-800/80 text-[11px] text-amber-400/90 font-mono flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
          Predicting where land gets stuck
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Control Navigation
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                  }`
                }
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-4 h-4 text-slate-400 group-hover:text-white" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Current Officer / Session footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between gap-2">
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-blue-700/80 border border-blue-400/30 flex items-center justify-center font-bold text-white text-xs shrink-0">
              {currentUser.name
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{currentUser.name}</p>
              <p className="text-[10px] text-blue-300 truncate">{currentUser.role}</p>
            </div>
          </div>
          <button
            onClick={() => {
              logout();
              navigate('/logout');
            }}
            title="Log Out of Officer Session"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 border border-transparent hover:border-rose-800/40 transition-all shrink-0 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>
    </>
  );
};
