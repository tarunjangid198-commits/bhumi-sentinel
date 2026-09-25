import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  LogOut,
  ShieldCheck,
  ArrowRight,
  UserCheck,
  CheckCircle2,
  Lock,
  Clock,
  ExternalLink,
  MapPin,
  RefreshCw,
  UserPlus,
} from 'lucide-react';

export const LogoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, logout, isAuthenticated } = useApp();

  // Execute logout on mount if still authenticated
  useEffect(() => {
    if (isAuthenticated) {
      logout();
    }
  }, [isAuthenticated, logout]);

  const logoutTime = new Date().toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  const logoutDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-6 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar */}
      <div className="max-w-4xl w-full mx-auto flex items-center justify-between py-2 border-b border-slate-800/80">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20">
            <ShieldCheck className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <span className="font-extrabold text-sm tracking-wider text-white">BHUMI-SENTINEL</span>
            <span className="text-[10px] text-slate-400 block -mt-0.5">Government of Rajasthan · Land Acquisition Risk Portal</span>
          </div>
        </div>
        <Link
          to="/login"
          className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold"
        >
          <span>Officer Login</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Main Card */}
      <div className="max-w-md w-full mx-auto my-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative z-10">
        {/* Status Icon */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/10">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-extrabold tracking-tight text-white">
            Officer Session Terminated Safely
          </h1>
          <p className="text-xs text-slate-400">
            Your statutory administrative session has been signed out and all pending file locks released.
          </p>
        </div>

        {/* Security Audit Receipt */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-2.5 text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-slate-400 text-[11px]">Officer Profile</span>
            <span className="font-bold text-white text-right">{currentUser.name}</span>
          </div>
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-slate-400 text-[11px]">Designation & Role</span>
            <span className="font-mono text-blue-400 text-[11px] font-semibold">{currentUser.role}</span>
          </div>
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-slate-400 text-[11px]">Department / Unit</span>
            <span className="text-slate-300 text-[11px] truncate max-w-[200px] text-right">{currentUser.department}</span>
          </div>
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-slate-400 text-[11px]">Sign-Out Timestamp</span>
            <span className="font-mono text-slate-300 text-[11px]">{logoutDate} · {logoutTime}</span>
          </div>
          <div className="flex items-center justify-between pt-0.5">
            <span className="text-slate-400 text-[11px]">Audit Verification Token</span>
            <span className="font-mono text-emerald-400 text-[10px] font-bold">SEC-RJ-{Math.floor(100000 + Math.random() * 900000)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <button
            onClick={() => navigate('/login')}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex items-center justify-center space-x-2"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Sign In to Officer Account</span>
          </button>

          <button
            onClick={() => navigate('/register')}
            className="w-full py-2.5 bg-emerald-700/90 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all border border-emerald-600/50 flex items-center justify-center space-x-2"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Create Account & Register</span>
          </button>

          <button
            onClick={() => navigate('/map')}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-all border border-slate-700 flex items-center justify-center space-x-2"
          >
            <MapPin className="w-3.5 h-3.5 text-blue-400" />
            <span>View Public Cadastral Map & Land Rates</span>
          </button>
        </div>

        {/* Security Notice */}
        <div className="flex items-start space-x-2 text-[11px] text-slate-500 bg-slate-950/40 p-3 rounded-xl border border-slate-800/60">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
          <p>
            Compliant with RFCTLARR 2013 & Rajasthan Land Revenue Act security guidelines for digital case movement.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-4xl w-full mx-auto text-center text-[11px] text-slate-500 py-3 border-t border-slate-900 font-mono">
        BHUMI-SENTINEL Administrative Engine · Secure Officer Terminal
      </div>
    </div>
  );
};
