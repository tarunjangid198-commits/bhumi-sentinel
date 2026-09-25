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
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MobileScannerModal } from '../common/MobileScannerModal';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const navigate = useNavigate();
  const { currentUser, files, logout } = useApp();
  const [showScanner, setShowScanner] = useState(false);

  // Incoming files count for the current officer
  const incomingCount = files.filter(
    (f) =>
      (f.status === 'SENT' || f.status === 'RECEIVED') &&
      f.currentOfficer.toLowerCase().includes(currentUser.role.toLowerCase().replace(' officer', ''))
  ).length;

  const returnedCount = files.filter(
    (f) =>
      f.status === 'RETURNED' &&
      f.currentOfficer.toLowerCase().includes(currentUser.role.toLowerCase().replace(' officer', ''))
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
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-slate-900 text-slate-200 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20">
              <Shield className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold tracking-wider text-base text-white">BHUMI-SENTINEL</span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-tight leading-tight">
                Land Acquisition Risk & Intelligence
              </p>
            </div>
          </div>
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

        {/* Mobile / Expo Scanner Quick Action Card */}
        <div className="px-4 py-2 border-t border-slate-800">
          <button
            onClick={() => setShowScanner(true)}
            className="w-full p-2.5 bg-gradient-to-r from-emerald-950/70 via-slate-900 to-slate-900 border border-emerald-500/40 hover:border-emerald-400 rounded-xl flex items-center justify-between text-left transition-all group shadow-inner"
          >
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30 group-hover:scale-105 transition-transform">
                <QrCode className="w-4 h-4" />
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-emerald-300 group-hover:text-emerald-200">
                  Mobile / Expo QR
                </p>
                <p className="text-[10px] text-slate-400 truncate">Scan to launch on phone</p>
              </div>
            </div>
            <span className="text-[9px] bg-emerald-500 text-slate-950 font-extrabold px-1.5 py-0.5 rounded shrink-0">
              SCAN
            </span>
          </button>
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
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 border border-transparent hover:border-rose-800/40 transition-all shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Mobile Scanner Modal from Sidebar */}
      <MobileScannerModal
        isOpen={showScanner}
        onClose={() => setShowScanner(false)}
        defaultTab="expo"
      />
    </>
  );
};
