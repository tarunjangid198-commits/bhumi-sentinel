import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, KeyRound, AlertCircle, X, Lock } from 'lucide-react';

interface OfficerSecurityPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  title: string;
  description: string;
  actionButtonText?: string;
}

export const OfficerSecurityPinModal: React.FC<OfficerSecurityPinModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  title,
  description,
  actionButtonText = 'Authorize Action',
}) => {
  const { currentUser, verifyOfficerPin } = useApp();
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);
      const valid = verifyOfficerPin(pin);
      if (valid) {
        onSuccess();
        onClose();
        setPin('');
      } else {
        setError('Invalid Officer Security PIN. (Default demo PIN is 1234)');
      }
    }, 350);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-sm w-full p-6 shadow-2xl text-white space-y-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 mx-auto flex items-center justify-center">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">{title}</h3>
          <p className="text-xs text-slate-400 leading-relaxed">{description}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-2.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <label className="text-slate-300 font-semibold">Enter 4-Digit Security PIN</label>
              <button
                type="button"
                onClick={() => setPin('1234')}
                className="text-blue-400 hover:text-blue-300 text-[11px] underline"
              >
                Auto-fill (1234)
              </button>
            </div>
            <div className="relative">
              <input
                type="password"
                maxLength={4}
                required
                autoFocus
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                placeholder="••••"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 text-center text-xl tracking-[0.5em] font-mono text-white focus:outline-hidden focus:border-blue-500 transition-colors"
              />
              <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <p className="text-[10px] text-slate-500 mt-1 text-center font-mono">
              Authorized Officer: {currentUser.name} ({currentUser.role})
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold border border-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isVerifying || pin.length < 4}
              className="py-2.5 px-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-1.5"
            >
              {isVerifying ? <span>Verifying...</span> : <span>{actionButtonText}</span>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
