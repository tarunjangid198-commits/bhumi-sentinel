import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  Bell,
  Menu,
  RotateCcw,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronDown,
  UserCheck,
  ShieldAlert,
  LogOut,
  UserPlus,
  Shield,
  ArrowLeft,
  Home,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Role } from '../../types';
import { SecuritySettingsModal } from '../security/SecuritySettingsModal';

interface HeaderProps {
  setMobileOpen: (open: boolean) => void;
  sidebarOpen?: boolean;
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  setMobileOpen,
  sidebarOpen = true,
  onToggleSidebar,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboard = location.pathname === '/' || location.pathname === '/dashboard';

  const getPageTitle = (path: string) => {
    if (path === '/' || path === '/dashboard') return 'Command Center';
    if (path.startsWith('/map')) return 'Acquisition Map';
    if (path.startsWith('/land-rates')) return 'District Land Rates';
    if (path === '/cases') return 'Land Cases';
    if (path.startsWith('/cases/')) return 'Case Details';
    if (path === '/portal') return 'Officer Portal';
    if (path === '/movement' || path === '/files') return 'File Movement';
    if (path === '/tasks') return 'My Tasks';
    if (path === '/bottlenecks') return 'Risk & Bottlenecks';
    if (path === '/simulator') return 'Scenario Simulator';
    if (path === '/copilot') return 'AI Copilot';
    if (path === '/projects') return 'Projects';
    if (path === '/completed-projects') return 'Completed Projects Archive';
    if (path === '/officers') return 'Officers Directory';
    if (path === '/reports') return 'Reports & Export';
    if (path === '/audit') return 'Audit Trail';
    return 'Portal';
  };

  const {
    currentUser,
    switchUser,
    logout,
    allUsers,
    parcels,
    files,
    notifications,
    markNotificationRead,
    resetToDemoState,
    projects,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('ALL');

  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchResults(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (roleRef.current && !roleRef.current.contains(e.target as Node)) {
        setShowRoleMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter parcels & files based on search with safe string checks
  const safeParcels = Array.isArray(parcels) ? parcels : [];
  const filteredParcels = searchQuery.trim()
    ? safeParcels
        .filter((p) => {
          if (!p) return false;
          const query = searchQuery.toLowerCase();
          const matchParcelId = typeof p.parcelId === 'string' && p.parcelId.toLowerCase().includes(query);
          const matchKhasra = typeof p.khasraNumber === 'string' && p.khasraNumber.toLowerCase().includes(query);
          const matchVillage = typeof p.village === 'string' && p.village.toLowerCase().includes(query);
          const matchDistrict = typeof p.district === 'string' && p.district.toLowerCase().includes(query);
          const matchProject = typeof p.project === 'string' && p.project.toLowerCase().includes(query);
          return matchParcelId || matchKhasra || matchVillage || matchDistrict || matchProject;
        })
        .slice(0, 6)
    : [];

  const unreadNotifs = (notifications || []).filter((n) => Boolean(n && !n.read));

  const handleRoleSelect = (roleName: Role) => {
    switchUser(roleName);
    setShowRoleMenu(false);
    navigate('/portal');
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 lg:px-8 py-3 flex items-center justify-between shadow-xs">
      <div className="flex items-center space-x-2.5 flex-1 max-w-3xl">
        {/* Navigation Sidebar Toggle / Menu button */}
        <button
          onClick={() => {
            if (onToggleSidebar) {
              onToggleSidebar();
            } else {
              setMobileOpen(true);
            }
          }}
          className={`p-2 rounded-xl text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 border border-slate-200 transition-all cursor-pointer shadow-2xs shrink-0 ${
            !sidebarOpen
              ? 'bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100 ring-2 ring-blue-500/20'
              : 'lg:hidden'
          }`}
          aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          title={sidebarOpen ? 'Close Navigation Sidebar' : 'Open Navigation Sidebar (Show Menu)'}
        >
          <Menu className={`w-5 h-5 ${!sidebarOpen ? 'text-blue-600' : 'text-slate-700'}`} />
          <span className="text-xs font-bold hidden sm:inline">
            {!sidebarOpen ? 'Expand Menu' : 'Menu'}
          </span>
        </button>

        {/* Back Button (Prominent when on any page) */}
        {!isDashboard ? (
          <button
            onClick={() => {
              if (window.history.length > 1) {
                navigate(-1);
              } else {
                navigate('/dashboard');
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 hover:text-blue-900 rounded-lg text-xs font-bold border border-blue-200 transition-all cursor-pointer shadow-2xs shrink-0"
            title="Go to previous page"
          >
            <ArrowLeft className="w-4 h-4 text-blue-600" />
            <span className="font-bold">Back</span>
          </button>
        ) : (
          <button
            onClick={() => navigate('/dashboard')}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 text-slate-700 rounded-lg text-xs font-bold border border-slate-200 shrink-0"
            title="Command Center Home"
          >
            <Home className="w-4 h-4 text-blue-600" />
            <span className="font-bold text-slate-900">Command Center</span>
          </button>
        )}

        {/* Breadcrumb Title Indicator */}
        {!isDashboard && (
          <div className="hidden md:flex items-center text-xs font-semibold text-slate-700 shrink-0">
            <span className="text-slate-400 mx-1">/</span>
            <span className="font-extrabold text-slate-900 truncate max-w-[170px] bg-slate-100 px-2 py-0.5 rounded">
              {getPageTitle(location.pathname)}
            </span>
          </div>
        )}

        {/* Global Search Bar */}
        <div ref={searchRef} className="relative flex-1">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchResults(true);
              }}
              onFocus={() => setShowSearchResults(true)}
              placeholder="Search Parcel ID (e.g. P-1024), Khasra (124/3), Village, or File ID..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>

          {/* Search Dropdown */}
          {showSearchResults && searchQuery.trim() && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden z-50">
              <div className="px-3 py-2 bg-slate-50 border-b border-slate-100 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                Matching Land Records ({filteredParcels.length})
              </div>
              {filteredParcels.length > 0 ? (
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                  {filteredParcels.map((p) => (
                    <button
                      key={p.parcelId}
                      onClick={() => {
                        navigate(`/cases/${p.parcelId}`);
                        setShowSearchResults(false);
                        setSearchQuery('');
                      }}
                      className="w-full text-left px-3.5 py-2.5 hover:bg-blue-50/70 transition-colors flex items-center justify-between group"
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-xs text-slate-900 group-hover:text-blue-600">
                            {p.parcelId}
                          </span>
                          <span className="text-[11px] font-medium text-slate-500">
                            Khasra {p.khasraNumber}
                          </span>
                          <span
                            className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                              p.riskLevel === 'HIGH'
                                ? 'bg-red-100 text-red-700'
                                : p.riskLevel === 'MEDIUM'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-emerald-100 text-emerald-700'
                            }`}
                          >
                            {p.riskLevel} RISK
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate max-w-sm mt-0.5">
                          {p.village}, {p.district} · {p.project}
                        </p>
                      </div>
                      <span className="text-[10px] font-mono font-medium text-slate-400 group-hover:text-blue-600 flex items-center gap-1">
                        {p.currentStage}
                        <ExternalLink className="w-3 h-3" />
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-xs text-slate-400">
                  No matching land parcels or khasras found for "{searchQuery}".
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center space-x-2 lg:space-x-4">
        {/* Project Selector */}
        <div className="hidden xl:block">
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
          >
            <option value="ALL">All National Projects (10)</option>
            {projects.map((prj) => (
              <option key={prj.projectId} value={prj.projectId}>
                {prj.code} - {prj.name.slice(0, 24)}...
              </option>
            ))}
          </select>
        </div>

        {/* DEMO ROLE SWITCHER (Core Hackathon Feature) */}
        <div ref={roleRef} className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-900 px-3 py-1.5 rounded-lg text-xs font-semibold hover:border-blue-300 transition-all shadow-2xs"
            title="Switch demo role to test officer workflows"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="hidden sm:inline font-mono text-[10px] uppercase text-blue-600">Demo Role:</span>
            <span className="font-bold">{currentUser.role}</span>
            <ChevronDown className="w-3.5 h-3.5 text-blue-500" />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-xl p-2 z-50">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900">Switch Demo Persona</p>
                <p className="text-[10px] text-slate-400">
                  Instantly simulate end-to-end officer handoffs & permissions
                </p>
              </div>
              <div className="py-1 space-y-0.5">
                {allUsers.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => handleRoleSelect(user.role)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                      currentUser.role === user.role
                        ? 'bg-blue-600 text-white font-semibold'
                        : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span>{user.role}</span>
                        {user.role === 'Finance Officer' && (
                          <span className="text-[9px] bg-amber-400 text-slate-900 px-1 rounded font-bold">
                            Demo P-1024
                          </span>
                        )}
                      </div>
                      <p
                        className={`text-[10px] ${
                          currentUser.role === user.role ? 'text-blue-100' : 'text-slate-400'
                        }`}
                      >
                        {user.name} ({user.department})
                      </p>
                    </div>
                    {currentUser.role === user.role && <CheckCircle2 className="w-4 h-4 text-white" />}
                  </button>
                ))}
              </div>

              {/* Bottom Actions in Role Menu */}
              <div className="p-2 bg-slate-900 border-t border-slate-750 flex items-center justify-between text-xs">
                <button
                  onClick={() => {
                    setShowRoleMenu(false);
                    navigate('/register');
                  }}
                  className="text-emerald-400 hover:text-emerald-300 hover:underline text-[11px] font-semibold flex items-center gap-1"
                >
                  <UserPlus className="w-3 h-3" />
                  <span>Register Account</span>
                </button>
                <button
                  onClick={() => {
                    setShowRoleMenu(false);
                    logout();
                    navigate('/logout');
                  }}
                  className="flex items-center gap-1 text-rose-400 hover:text-rose-300 text-[11px] font-bold"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Notifications Popover */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifs.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden">
              <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">
                  Notification Center ({unreadNotifs.length} unread)
                </span>
                <span className="text-[10px] text-slate-500">Real-time alerts</span>
              </div>
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      markNotificationRead(n.id);
                      if (n.parcelId) navigate(`/cases/${n.parcelId}`);
                      setShowNotifications(false);
                    }}
                    className={`p-3 hover:bg-slate-50 cursor-pointer transition-colors ${
                      !n.read ? 'bg-blue-50/40' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      <span className="mt-0.5">
                        {n.priority === 'HIGH' ? (
                          <ShieldAlert className="w-4 h-4 text-rose-500" />
                        ) : (
                          <Clock className="w-4 h-4 text-blue-500" />
                        )}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold text-slate-800">{n.title}</p>
                          <span className="text-[9px] text-slate-400">
                            {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">{n.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Reset Demo State button */}
        <button
          onClick={() => {
            if (confirm('Reset application to original demo seed state?')) {
              resetToDemoState();
              navigate('/dashboard');
            }
          }}
          title="Reset to fresh demo state"
          className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Security & Access Center button */}
        <button
          onClick={() => setShowSecurityModal(true)}
          title="Officer Security, 2FA & Access Center"
          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors relative cursor-pointer"
        >
          <Shield className="w-4 h-4 text-emerald-600" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
        </button>

        {/* Quick Sign Out button */}
        <button
          onClick={() => {
            logout();
            navigate('/logout');
          }}
          title="Sign Out / Log Out"
          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>

      {/* Security & Access Center Modal */}
      <SecuritySettingsModal
        isOpen={showSecurityModal}
        onClose={() => setShowSecurityModal(false)}
      />
    </header>
  );
};
