import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ShieldAlert, Clock, Lock, RefreshCw, CheckCircle2 } from 'lucide-react';

export const InactivityTimeoutModal: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout, sessionTimeoutMinutes } = useApp();

  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(60);

  const lastActivityRef = useRef<number>(Date.now());
  const timerRef = useRef<any>(null);
  const countdownRef = useRef<any>(null);

  // Reset activity timestamp on user interaction
  const resetActivity = () => {
    lastActivityRef.current = Date.now();
    if (isWarningOpen) {
      setIsWarningOpen(false);
      setSecondsRemaining(60);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];
    const handleActivity = () => resetActivity();

    events.forEach((evt) => window.addEventListener(evt, handleActivity, { passive: true }));

    // Check inactivity every 5 seconds
    const intervalMs = 5000;
    const timeoutMs = (sessionTimeoutMinutes || 15) * 60 * 1000;
    const warningMs = timeoutMs - 60 * 1000; // Warn 60s before logout

    timerRef.current = setInterval(() => {
      const inactiveFor = Date.now() - lastActivityRef.current;

      if (inactiveFor >= timeoutMs) {
        // Force logout
        clearInterval(timerRef.current);
        if (countdownRef.current) clearInterval(countdownRef.current);
        setIsWarningOpen(false);
        logout();
        navigate('/logout');
      } else if (inactiveFor >= warningMs && !isWarningOpen) {
        // Trigger 60s warning countdown
        setIsWarningOpen(true);
        const remSecs = Math.max(1, Math.round((timeoutMs - inactiveFor) / 1000));
        setSecondsRemaining(remSecs);
      }
    }, intervalMs);

    return () => {
      events.forEach((evt) => window.removeEventListener(evt, handleActivity));
      if (timerRef.current) clearInterval(timerRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [isAuthenticated, sessionTimeoutMinutes, isWarningOpen, logout, navigate]);

  // Countdown timer inside warning modal
  useEffect(() => {
    if (isWarningOpen) {
      countdownRef.current = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(countdownRef.current);
            logout();
            navigate('/logout');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (countdownRef.current) clearInterval(countdownRef.current);
    }

    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [isWarningOpen, logout, navigate]);

  if (!isAuthenticated || !isWarningOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-amber-500/40 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl text-white space-y-5 text-center relative overflow-hidden">
        {/* Amber warning glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-20 bg-amber-500/20 blur-2xl pointer-events-none" />

        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mx-auto flex items-center justify-center shadow-lg shadow-amber-500/10">
          <ShieldAlert className="w-8 h-8 animate-pulse" />
        </div>

        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-semibold">
            <Clock className="w-3.5 h-3.5" />
            <span>Statutory Inactivity Safeguard</span>
          </div>
          <h2 className="text-xl font-bold text-white">Officer Session Inactivity Warning</h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            In compliance with Government Data Security Guidelines, this terminal will automatically lock to protect pending land acquisition records.
          </p>
        </div>

        {/* Countdown display */}
        <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-center gap-3">
          <span className="text-xs text-slate-400">Automatic lock in:</span>
          <span className="font-mono text-2xl font-black text-amber-400">
            {secondsRemaining}s
          </span>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            onClick={() => {
              logout();
              navigate('/logout');
            }}
            className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold border border-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Lock Now</span>
          </button>

          <button
            onClick={resetActivity}
            className="py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Keep Working</span>
          </button>
        </div>
      </div>
    </div>
  );
};
