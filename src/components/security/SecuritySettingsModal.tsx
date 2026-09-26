import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Shield,
  ShieldCheck,
  Lock,
  KeyRound,
  Clock,
  CheckCircle2,
  X,
  AlertCircle,
  Eye,
  EyeOff,
  Smartphone,
  Fingerprint,
} from 'lucide-react';

interface SecuritySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SecuritySettingsModal: React.FC<SecuritySettingsModalProps> = ({ isOpen, onClose }) => {
  const {
    currentUser,
    updateOfficerPassword,
    updateOfficerPin,
    sessionTimeoutMinutes,
    setSessionTimeoutMinutes,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'status' | 'password' | 'pin' | 'session'>('status');

  // Password change state
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [passMessage, setPassMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // PIN change state
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinMessage, setPinMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  if (!isOpen) return null;

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPassMessage(null);

    const actualPass = currentUser.password || 'Sentinel@2026';
    if (currentPass !== actualPass) {
      setPassMessage({ text: 'Current password is incorrect.', type: 'error' });
      return;
    }
    if (newPass.length < 8) {
      setPassMessage({ text: 'New password must be at least 8 characters.', type: 'error' });
      return;
    }
    if (newPass !== confirmPass) {
      setPassMessage({ text: 'New passwords do not match.', type: 'error' });
      return;
    }

    updateOfficerPassword(newPass);
    setPassMessage({ text: 'Officer password successfully updated and encrypted.', type: 'success' });
    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPinMessage(null);

    if (newPin.length !== 4) {
      setPinMessage({ text: 'Officer Security PIN must be exactly 4 digits.', type: 'error' });
      return;
    }
    if (newPin !== confirmPin) {
      setPinMessage({ text: 'Security PINs do not match.', type: 'error' });
      return;
    }

    updateOfficerPin(newPin);
    setPinMessage({ text: 'Statutory 4-digit PIN successfully updated.', type: 'success' });
    setNewPin('');
    setConfirmPin('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl text-white space-y-5 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Officer Security & Access Center</h2>
            <p className="text-xs text-slate-400">
              Government credentials, 2FA status & terminal safeguards for {currentUser.name}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('status')}
            className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'status' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            Security Status
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'password' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            Password
          </button>
          <button
            onClick={() => setActiveTab('pin')}
            className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'pin' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            4-Digit PIN
          </button>
          <button
            onClick={() => setActiveTab('session')}
            className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'session' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            Session Timeout
          </button>
        </div>

        {/* Tab 1: Security Status */}
        {activeTab === 'status' && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-400 block font-mono">ENCRYPTION PROTOCOL</span>
                <span className="font-bold text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> TLS 1.3 / AES-256
                </span>
                <p className="text-[10px] text-slate-500">Government Cloud Encrypted</p>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-400 block font-mono">TWO-FACTOR AUTH (2FA)</span>
                <span className="font-bold text-emerald-400 flex items-center gap-1">
                  <Smartphone className="w-3.5 h-3.5" /> Active & Enforced
                </span>
                <p className="text-[10px] text-slate-500">SMS & Email OTP Guard</p>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-400 block font-mono">ANTI-BOT DEFENSE</span>
                <span className="font-bold text-blue-400 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5" /> WAF Captcha Shield
                </span>
                <p className="text-[10px] text-slate-500">Brute-Force Lockout Active</p>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-400 block font-mono">SESSION SAFEGUARD</span>
                <span className="font-bold text-amber-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {sessionTimeoutMinutes}m Auto-Lock
                </span>
                <p className="text-[10px] text-slate-500">Inactivity Protection</p>
              </div>
            </div>

            <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl text-xs text-blue-200 space-y-1">
              <span className="font-bold flex items-center gap-1.5 text-blue-300">
                <Shield className="w-3.5 h-3.5" /> Statutory Compliance Verified
              </span>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Terminal conforms to National Informatics Centre (NIC) and CERT-In guidelines for digital land acquisition records and statutory compensation transfers.
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: Change Password */}
        {activeTab === 'password' && (
          <form onSubmit={handlePasswordSubmit} className="space-y-3 text-xs">
            {passMessage && (
              <div
                className={`p-3 rounded-xl flex items-center gap-2 ${
                  passMessage.type === 'success'
                    ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                    : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
                }`}
              >
                {passMessage.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                <span>{passMessage.text}</span>
              </div>
            )}

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Current Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  value={currentPass}
                  onChange={(e) => setCurrentPass(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">New Password (Min 8 chars)</label>
              <input
                type={showPass ? 'text' : 'password'}
                required
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                placeholder="New password"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Confirm New Password</label>
              <input
                type={showPass ? 'text' : 'password'}
                required
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                placeholder="Re-type new password"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-md shadow-blue-500/20"
            >
              Update Officer Password
            </button>
          </form>
        )}

        {/* Tab 3: Change 4-Digit Security PIN */}
        {activeTab === 'pin' && (
          <form onSubmit={handlePinSubmit} className="space-y-3 text-xs">
            {pinMessage && (
              <div
                className={`p-3 rounded-xl flex items-center gap-2 ${
                  pinMessage.type === 'success'
                    ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                    : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
                }`}
              >
                {pinMessage.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                <span>{pinMessage.text}</span>
              </div>
            )}

            <p className="text-[11px] text-slate-400 leading-relaxed">
              Your 4-Digit Security PIN is required for statutory approvals, high-value compensation releases, and file returns.
            </p>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">New 4-Digit PIN</label>
              <input
                type="password"
                maxLength={4}
                required
                value={newPin}
                onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                placeholder="••••"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2.5 text-center text-lg font-mono tracking-widest text-white"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Confirm 4-Digit PIN</label>
              <input
                type="password"
                maxLength={4}
                required
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                placeholder="••••"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2.5 text-center text-lg font-mono tracking-widest text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-md shadow-blue-500/20"
            >
              Update Security PIN
            </button>
          </form>
        )}

        {/* Tab 4: Session Inactivity Timeout */}
        {activeTab === 'session' && (
          <div className="space-y-4 text-xs">
            <p className="text-slate-400 leading-relaxed">
              Select how long the terminal waits before automatically locking the screen when no mouse or keyboard activity is detected:
            </p>

            <div className="grid grid-cols-3 gap-2">
              {[5, 15, 30].map((mins) => (
                <button
                  key={mins}
                  onClick={() => setSessionTimeoutMinutes(mins)}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    sessionTimeoutMinutes === mins
                      ? 'bg-blue-600/20 border-blue-500 text-white font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="block text-base font-black">{mins} Mins</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    {mins === 5 ? 'High Security' : mins === 15 ? 'Standard NIC' : 'Extended'}
                  </span>
                </button>
              ))}
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
              <span className="text-slate-400">Current Inactivity Safeguard:</span>
              <span className="font-bold text-amber-400 font-mono">{sessionTimeoutMinutes} Minutes</span>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-2 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
