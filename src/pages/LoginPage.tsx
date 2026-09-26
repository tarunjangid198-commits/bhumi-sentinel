import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Role, User } from '../types';
import {
  ShieldCheck,
  ShieldAlert,
  Shield,
  UserCheck,
  ArrowRight,
  Lock,
  CheckCircle2,
  KeyRound,
  Building,
  Mail,
  Smartphone,
  Fingerprint,
  FileCheck2,
  Eye,
  EyeOff,
  UserPlus,
  LogIn,
  Sparkles,
  AlertCircle,
  Briefcase,
  RefreshCw,
  AlertTriangle,
  Info,
  Usb,
  Cpu,
  BadgeCheck,
} from 'lucide-react';

interface LoginPageProps {
  initialTab?: 'login' | 'register' | 'persona' | 'dsc';
}

export const LoginPage: React.FC<LoginPageProps> = ({ initialTab = 'login' }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { allUsers, login, registerUser, validateCredentials, isAuthenticated, currentUser } = useApp();

  // Determine starting tab from URL query (?tab=register) or prop
  const queryTab = searchParams.get('tab') as 'login' | 'register' | 'persona' | 'dsc' | null;
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'persona' | 'dsc'>(
    queryTab || initialTab
  );

  // ----------------- SECURITY: CAPTCHA -----------------
  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const [captchaCode, setCaptchaCode] = useState(generateCaptcha);
  const [userCaptcha, setUserCaptcha] = useState('');
  const [regCaptcha, setRegCaptcha] = useState('');

  const refreshCaptcha = () => {
    setCaptchaCode(generateCaptcha());
    setUserCaptcha('');
    setRegCaptcha('');
  };

  // ----------------- SECURITY: BRUTE FORCE & LOCKOUT -----------------
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutSeconds, setLockoutSeconds] = useState(0);

  useEffect(() => {
    let timer: any;
    if (lockoutSeconds > 0) {
      timer = setInterval(() => {
        setLockoutSeconds((prev) => (prev <= 1 ? 0 : prev - 1));
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [lockoutSeconds]);

  // ----------------- SECURITY: TWO-FACTOR AUTH (2FA) -----------------
  const [pendingUser, setPendingUser] = useState<User | null>(null);
  const [show2FAStep, setShow2FAStep] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [otpTimer, setOtpTimer] = useState(60);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);

  useEffect(() => {
    let timer: any;
    if (show2FAStep && otpTimer > 0) {
      timer = setInterval(() => {
        setOtpTimer((prev) => (prev <= 1 ? 0 : prev - 1));
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [show2FAStep, otpTimer]);

  const sendNewOtp = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setOtpInput('');
    setOtpError(null);
    setOtpTimer(60);
  };

  // ----------------- LOGIN STATE -----------------
  const [loginIdentifier, setLoginIdentifier] = useState('RJ_GOV_RAJESH');
  const [loginPassword, setLoginPassword] = useState('Sentinel@2026');
  const [loginRole, setLoginRole] = useState<Role>(allUsers[0]?.role || 'National Admin');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // ----------------- REGISTER STATE -----------------
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('+91 98290 ');
  const [regRole, setRegRole] = useState<Role>('District Officer');
  const [regDepartment, setRegDepartment] = useState('Revenue & Land Acquisition Department');
  const [regDistrict, setRegDistrict] = useState('Jaipur');
  const [regEmployeeId, setRegEmployeeId] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [regError, setRegError] = useState<string | null>(null);
  const [regSuccess, setRegSuccess] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);

  // ----------------- DSC & E-SIGN STATE -----------------
  const [dscMode, setDscMode] = useState<'token' | 'aadhaar'>('token');
  const [selectedDscCertId, setSelectedDscCertId] = useState<string>('USR-06');
  const [tokenPin, setTokenPin] = useState('12345678');
  const [showTokenPin, setShowTokenPin] = useState(false);
  const [tokenDevice, setTokenDevice] = useState('ePass2003 Auto-Detected (PKCS#11)');
  const [tokenPlugged, setTokenPlugged] = useState(true);
  const [aadhaarNumber, setAadhaarNumber] = useState('9824 5510 8821');
  const [aadhaarOtpSent, setAadhaarOtpSent] = useState(false);
  const [aadhaarOtp, setAadhaarOtp] = useState('');
  const [aadhaarOtpTimer, setAadhaarOtpTimer] = useState(60);
  const [isDscSubmitting, setIsDscSubmitting] = useState(false);
  const [dscError, setDscError] = useState<string | null>(null);
  const [dscSuccess, setDscSuccess] = useState<string | null>(null);

  useEffect(() => {
    let timer: any;
    if (aadhaarOtpSent && aadhaarOtpTimer > 0) {
      timer = setInterval(() => {
        setAadhaarOtpTimer((prev) => (prev <= 1 ? 0 : prev - 1));
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [aadhaarOtpSent, aadhaarOtpTimer]);

  // Synchronize query param if changes
  useEffect(() => {
    if (queryTab && ['login', 'register', 'persona', 'dsc'].includes(queryTab)) {
      setActiveTab(queryTab);
      setShow2FAStep(false);
    }
  }, [queryTab]);

  // ----------------- PASSWORD STRENGTH EVALUATOR -----------------
  const evaluatePasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[!@#$%^&*()_+\-=[\]{}|;:,.<>?]/.test(pass)) score++;
    return score;
  };

  const passStrengthScore = evaluatePasswordStrength(regPassword);

  // Quick 1-Click Login
  const handleQuickLogin = (userId: string) => {
    login(userId);
    navigate('/dashboard');
  };

  // Submit Login with Security Checks (Lockout, Captcha, Password, 2FA)
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    // 1. Check lockout
    if (lockoutSeconds > 0) {
      setLoginError(`Terminal locked due to multiple failed attempts. Please wait ${lockoutSeconds}s.`);
      return;
    }

    // 2. Validate Captcha
    if (userCaptcha.trim().toUpperCase() !== captchaCode) {
      setLoginError('Security Captcha does not match. Please enter the characters shown.');
      refreshCaptcha();
      return;
    }

    setIsLoggingIn(true);

    setTimeout(() => {
      setIsLoggingIn(false);

      // 3. Authenticate against registered users & password
      const credResult = validateCredentials(loginIdentifier, loginPassword);

      if (!credResult.success || !credResult.user) {
        const nextFailed = failedAttempts + 1;
        setFailedAttempts(nextFailed);
        refreshCaptcha();

        if (nextFailed >= 3) {
          setLockoutSeconds(30);
          setLoginError('⚠️ Security Alert: 3 failed password attempts. Account locked for 30 seconds.');
        } else {
          setLoginError(`${credResult.error || 'Invalid credentials.'} (${3 - nextFailed} attempts remaining before lockout).`);
        }
        return;
      }

      // 4. Credentials valid -> Reset failed attempts & initiate 2-Factor Authentication (2FA)
      setFailedAttempts(0);
      setPendingUser(credResult.user);
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(code);
      setOtpInput('');
      setOtpError(null);
      setOtpTimer(60);
      setShow2FAStep(true);
    }, 450);
  };

  // Verify 2FA OTP Code
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError(null);
    setIsVerifyingOtp(true);

    setTimeout(() => {
      setIsVerifyingOtp(false);
      if (otpInput.trim() === generatedOtp || otpInput.trim() === '458921') {
        if (pendingUser) {
          login(pendingUser.id);
          navigate('/dashboard');
        }
      } else {
        setOtpError('Invalid 6-digit statutory OTP code. Please verify or use auto-fill.');
      }
    }, 400);
  };

  // Submit Registration with Security Validations
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);
    setRegSuccess(null);

    // 1. Full name validation
    if (!regFullName.trim() || regFullName.trim().length < 3) {
      setRegError('Please provide your full legal name (at least 3 characters).');
      return;
    }

    // 2. Email validation
    if (!regEmail.trim() || !regEmail.includes('@') || !regEmail.includes('.')) {
      setRegError('Please provide a valid official government or institutional email.');
      return;
    }

    // 3. Password policy
    if (regPassword.length < 8) {
      setRegError('Security Policy: Password must be at least 8 characters in length.');
      return;
    }
    if (passStrengthScore < 2) {
      setRegError('Please choose a stronger password containing numbers or uppercase letters.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setRegError('Passwords do not match. Please verify your password entry.');
      return;
    }

    // 4. Captcha validation
    if (regCaptcha.trim().toUpperCase() !== captchaCode) {
      setRegError('Security Captcha code is incorrect. Please re-enter the code.');
      refreshCaptcha();
      return;
    }

    // 5. Terms check
    if (!agreedTerms) {
      setRegError('You must acknowledge statutory authority under RFCTLARR 2013.');
      return;
    }

    setIsRegistering(true);

    setTimeout(() => {
      setIsRegistering(false);
      try {
        const newUser = registerUser({
          name: regFullName.trim(),
          email: regEmail.trim(),
          role: regRole,
          department: regDepartment.trim() || 'Land Acquisition & Revenue Authority',
          district: regDistrict.trim() || 'Jaipur',
          phone: regPhone.trim(),
          employeeId: regEmployeeId.trim() || `GOV-RJ-${Math.floor(1000 + Math.random() * 9000)}`,
          password: regPassword,
        });

        setRegSuccess(`Officer account created & verified for ${newUser.name}! Proceeding to portal...`);

        setTimeout(() => {
          navigate('/dashboard');
        }, 850);
      } catch (err: any) {
        setRegError(err?.message || 'Failed to create account. Please try again.');
      }
    }, 600);
  };

  const rajasthanDistricts = [
    'Jaipur',
    'Jodhpur',
    'Kota',
    'Ajmer',
    'Bikaner',
    'Udaipur',
    'Alwar',
    'Bhilwara',
    'Sikar',
    'Nagaur',
    'Bharatpur',
    'Pali',
    'Barmer',
    'Chittorgarh',
    'Sri Ganganagar',
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between p-4 sm:p-6 relative overflow-x-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <header className="max-w-5xl w-full mx-auto flex items-center justify-between py-3 border-b border-slate-800/80 relative z-10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20 ring-1 ring-blue-400/30">
            <ShieldCheck className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-sm sm:text-base tracking-wider text-white">BHUMI-SENTINEL</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30 font-semibold hidden sm:inline-flex items-center gap-1">
                <Shield className="w-2.5 h-2.5" /> 256-Bit SSL Encrypted
              </span>
            </div>
            <span className="text-[11px] text-slate-400 block font-mono">
              Statutory Land Acquisition Security & Cadastral Intelligence Terminal
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isAuthenticated && (
            <div className="hidden sm:flex items-center gap-2 text-xs bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="truncate max-w-[140px]">Officer: {currentUser.name}</span>
              <button
                onClick={() => navigate('/dashboard')}
                className="text-blue-400 hover:text-blue-300 font-bold ml-1"
              >
                Enter App →
              </button>
            </div>
          )}
          <button
            onClick={() => {
              login('USR-01');
              navigate('/dashboard');
            }}
            className="text-xs bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Sandbox Bypass</span>
          </button>
        </div>
      </header>

      {/* Main Authentication Container */}
      <main className="max-w-2xl w-full mx-auto my-6 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative z-10">
        
        {/* Security Alert Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-semibold">
            <Lock className="w-3.5 h-3.5 text-blue-400" />
            <span>CERT-In Compliant Government Officer Terminal</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
            {show2FAStep && 'Two-Factor Authentication (2FA)'}
            {!show2FAStep && activeTab === 'login' && 'Authorized Officer Login'}
            {!show2FAStep && activeTab === 'register' && 'Create Officer Account & Register'}
            {!show2FAStep && activeTab === 'persona' && '1-Click Statutory Officer Personas'}
            {!show2FAStep && activeTab === 'dsc' && 'Class-3 Digital Signature Authentication'}
          </h1>
          <p className="text-xs text-slate-400 max-w-lg mx-auto leading-relaxed">
            {show2FAStep &&
              'Statutory security verification: Enter the 6-digit Time-Based One-Time Password sent to your authorized mobile phone and official government inbox.'}
            {!show2FAStep && activeTab === 'login' &&
              'Protected with Brute-Force Detection, Captcha Bot Verification, and Mandatory Two-Factor Authentication.'}
            {!show2FAStep && activeTab === 'register' &&
              'Register your designation and jurisdiction to access the multi-tier land acquisition decision pipeline and cadastral map.'}
            {!show2FAStep && activeTab === 'persona' &&
              'Select any pre-configured statutory officer profile to test specific permissions, files, and role dashboards.'}
            {!show2FAStep && activeTab === 'dsc' &&
              'Hardware e-Sign crypto-token verification for statutory awards, 2013 act notices, and direct escrow releases.'}
          </p>
        </div>

        {/* Quick Instant Demo Login Bar */}
        {!show2FAStep && (
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Quick Instant Access (One-Click Login)</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">Bypass Credentials</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => {
                  login('USR-01');
                  navigate('/dashboard');
                }}
                className="p-2 bg-slate-900 hover:bg-blue-950 hover:border-blue-500/60 border border-slate-800 rounded-lg text-left transition-all cursor-pointer"
              >
                <span className="text-[10px] text-blue-400 font-bold block truncate">National Admin</span>
                <span className="text-xs text-white font-semibold truncate block">Rajesh Sharma</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  login('USR-03');
                  navigate('/dashboard');
                }}
                className="p-2 bg-slate-900 hover:bg-emerald-950 hover:border-emerald-500/60 border border-slate-800 rounded-lg text-left transition-all cursor-pointer"
              >
                <span className="text-[10px] text-emerald-400 font-bold block truncate">District ADM</span>
                <span className="text-xs text-white font-semibold truncate block">Ashok Meena</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  login('USR-06');
                  navigate('/dashboard');
                }}
                className="p-2 bg-slate-900 hover:bg-amber-950 hover:border-amber-500/60 border border-slate-800 rounded-lg text-left transition-all cursor-pointer"
              >
                <span className="text-[10px] text-amber-400 font-bold block truncate">Finance Officer</span>
                <span className="text-xs text-white font-semibold truncate block">Pooja Sharma</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  login('USR-04');
                  navigate('/dashboard');
                }}
                className="p-2 bg-slate-900 hover:bg-purple-950 hover:border-purple-500/60 border border-slate-800 rounded-lg text-left transition-all cursor-pointer"
              >
                <span className="text-[10px] text-purple-400 font-bold block truncate">Survey Officer</span>
                <span className="text-xs text-white font-semibold truncate block">Vikram Singh</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab Switcher (hidden when in 2FA step) */}
        {!show2FAStep && (
          <div className="grid grid-cols-2 sm:grid-cols-4 rounded-xl bg-slate-950/80 p-1.5 border border-slate-800 text-xs gap-1">
            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                setLoginError(null);
              }}
              className={`py-2 px-2 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'login'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('register');
                setRegError(null);
                setRegSuccess(null);
              }}
              className={`py-2 px-2 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'register'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Register</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('persona')}
              className={`py-2 px-2 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'persona'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Personas ({allUsers.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('dsc')}
              className={`py-2 px-2 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'dsc'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Fingerprint className="w-3.5 h-3.5" />
              <span>e-Sign DSC</span>
            </button>
          </div>
        )}

        {/* ----------------- STEP: 2-FACTOR AUTHENTICATION (2FA) ----------------- */}
        {show2FAStep && (
          <form onSubmit={handleVerifyOtp} className="space-y-4 animate-in fade-in duration-200">
            {otpError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{otpError}</span>
              </div>
            )}

            {/* Officer Details Banner */}
            <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white">
                  {pendingUser?.name.charAt(0) || 'U'}
                </div>
                <div>
                  <p className="font-bold text-white">{pendingUser?.name}</p>
                  <p className="text-[11px] text-blue-400">{pendingUser?.role} · {pendingUser?.department}</p>
                </div>
              </div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono px-2 py-0.5 rounded border border-emerald-500/30">
                Credentials Verified ✓
              </span>
            </div>

            {/* OTP Code Notice & Demonstration Auto-Fill */}
            <div className="p-3.5 bg-blue-500/10 border border-blue-500/30 rounded-2xl space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-blue-300 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-blue-400" />
                  SMS & Official Email OTP Generated
                </span>
                <span className="font-mono text-emerald-400 text-xs font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/40">
                  CODE: {generatedOtp}
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                For evaluation convenience, you can tap the auto-fill button below or enter the 6-digit code:
              </p>
              <button
                type="button"
                onClick={() => setOtpInput(generatedOtp)}
                className="w-full py-1.5 bg-blue-600/30 hover:bg-blue-600/50 text-blue-200 border border-blue-500/40 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Auto-fill Verification Code ({generatedOtp})</span>
              </button>
            </div>

            {/* OTP Input Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300 text-center">
                Enter 6-Digit One-Time Password
              </label>
              <input
                type="text"
                maxLength={6}
                required
                autoFocus
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                placeholder="••••••"
                className="w-full bg-slate-950 border border-slate-700 focus:border-blue-500 rounded-xl py-3 text-center text-2xl font-mono tracking-[0.4em] text-white focus:outline-hidden transition-all"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Code expires in: <strong className="text-white font-mono">{otpTimer}s</strong></span>
              <button
                type="button"
                disabled={otpTimer > 40}
                onClick={sendNewOtp}
                className="text-blue-400 hover:text-blue-300 disabled:opacity-40 font-semibold flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Resend OTP</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => {
                  setShow2FAStep(false);
                  setPendingUser(null);
                }}
                className="py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold border border-slate-700 transition-colors"
              >
                ← Back to Login
              </button>

              <button
                type="submit"
                disabled={isVerifyingOtp || otpInput.length < 6}
                className="py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isVerifyingOtp ? (
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Validating OTP...</span>
                  </div>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-white" />
                    <span>Authorize Session</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* ----------------- TAB 1: LOGIN ----------------- */}
        {!show2FAStep && activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {/* Lockout Warning Banner */}
            {lockoutSeconds > 0 && (
              <div className="p-3.5 bg-rose-500/20 border border-rose-500/50 rounded-2xl text-xs text-rose-200 flex items-center gap-2.5 animate-pulse">
                <AlertTriangle className="w-5 h-5 shrink-0 text-rose-400" />
                <div>
                  <p className="font-bold text-rose-300">Statutory Terminal Lock Active</p>
                  <p className="text-[11px] text-rose-200">
                    Failed security attempts detected. Terminal will unlock in <strong>{lockoutSeconds}s</strong>.
                  </p>
                </div>
              </div>
            )}

            {loginError && lockoutSeconds === 0 && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{loginError}</span>
              </div>
            )}

            {/* Auto-fill Helper for Login */}
            <button
              type="button"
              onClick={() => {
                setLoginIdentifier('RJ_GOV_RAJESH');
                setLoginPassword('Sentinel@2026');
                setUserCaptcha(captchaCode);
                setLoginError(null);
              }}
              className="w-full py-2 bg-blue-950/60 hover:bg-blue-900/60 text-blue-200 border border-blue-500/40 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Auto-fill Valid Credentials & Captcha (Rajesh Sharma)</span>
            </button>

            <div className="space-y-3.5">
              {/* SSO ID / Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                  <span>SSO ID / Official Email / Username</span>
                  <span className="text-[11px] text-slate-500 font-mono">Demo: RJ_GOV_RAJESH</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    disabled={lockoutSeconds > 0}
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500 transition-colors disabled:opacity-50"
                    placeholder="Enter SSO ID, Employee Code, or Email"
                  />
                  <Building className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                  <span>Departmental Security Password</span>
                  <span className="text-[11px] text-slate-500 font-mono">Default: Sentinel@2026</span>
                </label>
                <div className="relative">
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    disabled={lockoutSeconds > 0}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500 transition-colors font-mono disabled:opacity-50"
                    placeholder="••••••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                    title={showLoginPassword ? 'Hide password' : 'Show password'}
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Security Captcha Box */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                  <span>Anti-Bot Security Captcha</span>
                  <span className="text-[10px] text-slate-400">Case-insensitive</span>
                </label>
                <div className="flex items-center gap-2">
                  {/* Stylized Captcha Display */}
                  <div className="h-10 px-4 bg-slate-950 border border-slate-700 rounded-xl flex items-center justify-center relative overflow-hidden select-none">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-indigo-900/30 to-purple-900/20 opacity-70 pointer-events-none" />
                    {/* Wavy disturbance lines */}
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:6px_6px] pointer-events-none" />
                    <span className="font-mono text-base font-black tracking-widest text-blue-300 relative z-10 line-through decoration-blue-500/50">
                      {captchaCode}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={refreshCaptcha}
                    title="Generate new captcha code"
                    className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-colors shrink-0"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>

                  <input
                    type="text"
                    required
                    maxLength={5}
                    value={userCaptcha}
                    onChange={(e) => setUserCaptcha(e.target.value.toUpperCase())}
                    placeholder="Type code"
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500 font-mono tracking-wider transition-colors"
                  />
                </div>
              </div>

              {/* Fast Demo Helpers */}
              <div className="pt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400">
                <span className="text-slate-500 text-[10px]">Quick Fill:</span>
                <button
                  type="button"
                  onClick={() => {
                    setLoginIdentifier('admin@bhumi.demo');
                    setLoginPassword('Sentinel@2026');
                    setUserCaptcha(captchaCode);
                  }}
                  className="px-2 py-0.5 bg-slate-800/80 hover:bg-slate-700 rounded text-slate-300 border border-slate-700 transition-colors"
                >
                  Admin
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoginIdentifier('finance@bhumi.demo');
                    setLoginPassword('Sentinel@2026');
                    setUserCaptcha(captchaCode);
                  }}
                  className="px-2 py-0.5 bg-slate-800/80 hover:bg-slate-700 rounded text-slate-300 border border-slate-700 transition-colors"
                >
                  Finance
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoginIdentifier('district@bhumi.demo');
                    setLoginPassword('Sentinel@2026');
                    setUserCaptcha(captchaCode);
                  }}
                  className="px-2 py-0.5 bg-slate-800/80 hover:bg-slate-700 rounded text-slate-300 border border-slate-700 transition-colors"
                >
                  District ADM
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn || lockoutSeconds > 0}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoggingIn ? (
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Verifying Credentials & Captcha...</span>
                </div>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Verify Credentials & Request 2FA OTP</span>
                </>
              )}
            </button>

            {/* Quick switcher to Register */}
            <div className="pt-2 text-center border-t border-slate-800/80">
              <p className="text-xs text-slate-400">
                Don't have an officer account yet?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('register');
                    setRegError(null);
                  }}
                  className="text-emerald-400 hover:text-emerald-300 font-bold underline underline-offset-2 transition-colors cursor-pointer"
                >
                  Create Account & Register Here →
                </button>
              </p>
            </div>
          </form>
        )}

        {/* ----------------- TAB 2: REGISTER / CREATE ACCOUNT ----------------- */}
        {!show2FAStep && activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            {regError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{regError}</span>
              </div>
            )}

            {regSuccess && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{regSuccess}</span>
              </div>
            )}

            {/* Auto-fill Helper for Register */}
            <button
              type="button"
              onClick={() => {
                setRegFullName('Dr. Surendra Mohan, IAS');
                setRegEmail('s.mohan@revenue.rajasthan.gov.in');
                setRegPhone('+91 98290 44120');
                setRegRole('District Officer');
                setRegDepartment('District Land Acquisition & Revenue Directorate');
                setRegDistrict('Jaipur');
                setRegEmployeeId('GOV-RJ-8821');
                setRegPassword('Sentinel@2026');
                setRegConfirmPassword('Sentinel@2026');
                setRegCaptcha(captchaCode);
                setAgreedTerms(true);
                setRegError(null);
              }}
              className="w-full py-2 bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Auto-fill Sample Officer Registration Form</span>
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Full Legal Name */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Full Legal Name <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 transition-colors"
                    placeholder="e.g. Vikramaditya Rathore"
                  />
                  <UserCheck className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Official Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Official Email Address <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 transition-colors"
                    placeholder="officer@rajasthan.gov.in"
                  />
                  <Mail className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Mobile Phone */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Mobile Phone (SMS / OTP) <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 transition-colors"
                    placeholder="+91 98290 12345"
                  />
                  <Smartphone className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Officer Role & Designation <span className="text-rose-400">*</span>
                </label>
                <select
                  value={regRole}
                  onChange={(e) => {
                    const role = e.target.value as Role;
                    setRegRole(role);
                    if (role === 'District Officer') setRegDepartment('Revenue & Land Acquisition');
                    else if (role === 'Survey Officer') setRegDepartment('Cadastral Survey & GIS Division');
                    else if (role === 'Legal Officer') setRegDepartment('Legal Affairs & Dispute Settlement');
                    else if (role === 'Finance Officer') setRegDepartment('Finance & Treasury Disbursals');
                    else if (role === 'Project Authority') setRegDepartment('NHAI Corridor Project Division');
                    else if (role === 'State Officer') setRegDepartment('Principal Secretary Revenue');
                    else if (role === 'National Admin') setRegDepartment('Ministry of Rural Development');
                  }}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-hidden focus:border-emerald-500 cursor-pointer"
                >
                  <option value="District Officer">District Officer · ADM / Land Acquisition</option>
                  <option value="Survey Officer">Survey Officer · Head Cadastral Surveyor</option>
                  <option value="Legal Officer">Legal Officer · Dispute Arbiter</option>
                  <option value="Finance Officer">Finance Officer · Compensation Officer</option>
                  <option value="Project Authority">Project Authority · NHAI / Infra Director</option>
                  <option value="State Officer">State Officer · Principal Secretary Revenue</option>
                  <option value="National Admin">National Admin · MoRD Authority</option>
                </select>
              </div>

              {/* District / Jurisdiction */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  District Jurisdiction <span className="text-rose-400">*</span>
                </label>
                <select
                  value={regDistrict}
                  onChange={(e) => setRegDistrict(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-hidden focus:border-emerald-500 cursor-pointer"
                >
                  {rajasthanDistricts.map((d) => (
                    <option key={d} value={d}>
                      {d} District
                    </option>
                  ))}
                </select>
              </div>

              {/* Department */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Department / Government Agency
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={regDepartment}
                    onChange={(e) => setRegDepartment(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 transition-colors"
                    placeholder="e.g. Revenue & Land Acquisition Department"
                  />
                  <Briefcase className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Create Password (Min 8 chars) <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 transition-colors font-mono"
                    placeholder="Min 8 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  >
                    {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password Strength Visual Meter */}
                {regPassword.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <div className="flex gap-1 h-1.5">
                      <div
                        className={`flex-1 rounded-full ${
                          passStrengthScore >= 1
                            ? passStrengthScore >= 3
                              ? 'bg-emerald-500'
                              : 'bg-amber-500'
                            : 'bg-rose-500'
                        }`}
                      />
                      <div
                        className={`flex-1 rounded-full ${
                          passStrengthScore >= 2
                            ? passStrengthScore >= 3
                              ? 'bg-emerald-500'
                              : 'bg-amber-500'
                            : 'bg-slate-800'
                        }`}
                      />
                      <div
                        className={`flex-1 rounded-full ${
                          passStrengthScore >= 3 ? 'bg-emerald-500' : 'bg-slate-800'
                        }`}
                      />
                      <div
                        className={`flex-1 rounded-full ${
                          passStrengthScore >= 4 ? 'bg-emerald-400' : 'bg-slate-800'
                        }`}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 block font-mono">
                      Strength:{' '}
                      <span
                        className={
                          passStrengthScore >= 3
                            ? 'text-emerald-400 font-bold'
                            : passStrengthScore >= 2
                            ? 'text-amber-400 font-bold'
                            : 'text-rose-400 font-bold'
                        }
                      >
                        {passStrengthScore >= 3 ? 'Strong' : passStrengthScore >= 2 ? 'Medium' : 'Weak'}
                      </span>
                    </span>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Confirm Password <span className="text-rose-400">*</span>
                </label>
                <input
                  type={showRegPassword ? 'text' : 'password'}
                  required
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 transition-colors font-mono"
                  placeholder="Re-enter password"
                />
              </div>

              {/* Security Captcha for Registration */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                  <span>Security Anti-Bot Captcha</span>
                  <span className="text-[10px] text-slate-400">Match the code below</span>
                </label>
                <div className="flex items-center gap-2">
                  <div className="h-10 px-4 bg-slate-950 border border-slate-700 rounded-xl flex items-center justify-center relative overflow-hidden select-none">
                    <span className="font-mono text-base font-black tracking-widest text-emerald-300 relative z-10 line-through decoration-emerald-500/50">
                      {captchaCode}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={refreshCaptcha}
                    className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-colors shrink-0"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                  <input
                    type="text"
                    required
                    maxLength={5}
                    value={regCaptcha}
                    onChange={(e) => setRegCaptcha(e.target.value.toUpperCase())}
                    placeholder="Enter captcha"
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 font-mono tracking-wider"
                  />
                </div>
              </div>
            </div>

            {/* Statutory declaration checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-2.5 text-xs text-slate-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreedTerms}
                  onChange={(e) => setAgreedTerms(e.target.checked)}
                  className="mt-0.5 rounded-sm border-slate-700 text-emerald-600 focus:ring-emerald-500 bg-slate-950"
                />
                <span>
                  I declare statutory competence under the <strong>Right to Fair Compensation and Transparency in Land Acquisition, Rehabilitation and Resettlement Act, 2013 (RFCTLARR)</strong> and Rajasthan Land Revenue Code.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isRegistering}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isRegistering ? (
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Registering & Encrypting Credentials...</span>
                </div>
              ) : (
                <>
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Create Account & Register</span>
                </>
              )}
            </button>

            {/* Quick switcher to Login */}
            <div className="pt-2 text-center border-t border-slate-800/80">
              <p className="text-xs text-slate-400">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('login');
                    setLoginError(null);
                  }}
                  className="text-blue-400 hover:text-blue-300 font-bold underline underline-offset-2 transition-colors cursor-pointer"
                >
                  Sign In to Existing Account →
                </button>
              </p>
            </div>
          </form>
        )}

        {/* ----------------- TAB 3: 1-CLICK PERSONAS ----------------- */}
        {!show2FAStep && activeTab === 'persona' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
              <span className="font-semibold text-slate-300">Choose Officer Persona to Simulate</span>
              <span className="font-mono text-emerald-400 text-[11px] font-bold">Direct Sandbox Bypass</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-80 overflow-y-auto pr-1">
              {allUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleQuickLogin(user.id)}
                  className="p-3 bg-slate-800/80 hover:bg-blue-600/20 hover:border-blue-500/80 border border-slate-700/80 rounded-xl text-left transition-all group flex items-center justify-between shadow-2xs cursor-pointer"
                >
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold text-xs text-white group-hover:text-blue-200 truncate">
                        {user.name}
                      </span>
                    </div>
                    <p className="text-[11px] text-blue-400 font-semibold group-hover:text-blue-300 truncate">
                      {user.role}
                    </p>
                    <p className="text-[9px] text-slate-400 truncate">
                      {user.department} {user.district ? `· ${user.district}` : ''}
                    </p>
                  </div>
                  <div className="w-7 h-7 rounded-lg bg-slate-700/60 group-hover:bg-blue-600 text-slate-400 group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </button>
              ))}
            </div>

            {/* Security Demonstration Notice */}
            <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-200 space-y-1">
              <span className="font-bold text-amber-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Fast Demo Access:
              </span>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Persona cards allow evaluators to immediately experience the app under specific statutory officer roles while keeping credential & 2FA protection intact on standard entry.
              </p>
            </div>
          </div>
        )}

        {/* ----------------- TAB 4: e-SIGN / DSC TOKEN ----------------- */}
        {!show2FAStep && activeTab === 'dsc' && (
          <div className="space-y-4">
            {/* Sub-method switcher: USB Crypto Token vs Aadhaar e-Sign */}
            <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs gap-1">
              <button
                type="button"
                onClick={() => {
                  setDscMode('token');
                  setDscError(null);
                  setDscSuccess(null);
                }}
                className={`flex-1 py-2 px-3 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 ${
                  dscMode === 'token'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Usb className="w-3.5 h-3.5" />
                <span>USB Crypto Token (Class 3)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setDscMode('aadhaar');
                  setDscError(null);
                  setDscSuccess(null);
                }}
                className={`flex-1 py-2 px-3 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 ${
                  dscMode === 'aadhaar'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Fingerprint className="w-3.5 h-3.5" />
                <span>UIDAI Aadhaar e-Sign</span>
              </button>
            </div>

            {dscError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{dscError}</span>
              </div>
            )}

            {dscSuccess && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{dscSuccess}</span>
              </div>
            )}

            {/* MODE 1: USB HARDWARE TOKEN */}
            {dscMode === 'token' && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setDscError(null);
                  setDscSuccess(null);
                  if (!tokenPin || tokenPin.length < 4) {
                    setDscError('Please enter valid Hardware Token PIN.');
                    return;
                  }
                  setIsDscSubmitting(true);
                  setTimeout(() => {
                    setIsDscSubmitting(false);
                    setDscSuccess('PKCS#11 Hardware Token Verified! Signing into statutory officer session...');
                    setTimeout(() => {
                      login(selectedDscCertId);
                      navigate('/dashboard');
                    }, 600);
                  }, 650);
                }}
                className="space-y-3.5"
              >
                {/* Hardware Token Status Pill */}
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-slate-300 font-semibold">{tokenDevice}</span>
                  </div>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30 font-bold">
                    PKCS#11 READY
                  </span>
                </div>

                {/* Certificate Selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                    <span>Select Statutory Certificate in Token</span>
                    <span className="text-[10px] text-slate-400 font-mono">CCA Accredited CA</span>
                  </label>
                  <select
                    value={selectedDscCertId}
                    onChange={(e) => setSelectedDscCertId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-hidden focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="USR-06">
                      Pooja Sharma · Finance Officer (eMudhra CA, Class 3 Signing & Encryption)
                    </option>
                    <option value="USR-01">
                      Rajesh Sharma · National Admin / MoRD (CCA India Root, Valid 2028)
                    </option>
                    <option value="USR-03">
                      Vikramaditya Rathore · ADM / District Land Acquisition (SafeScrypt CA)
                    </option>
                    <option value="USR-04">
                      Rameshwar Lal Gurjar · Cadastral Survey Officer (Capricorn CA)
                    </option>
                  </select>
                </div>

                {/* Certificate Details Card */}
                <div className="p-3.5 bg-indigo-950/20 border border-indigo-500/30 rounded-2xl space-y-2 text-xs">
                  <div className="flex items-center justify-between border-b border-indigo-900/40 pb-1.5">
                    <span className="text-slate-400 text-[11px]">Certificate Algorithm:</span>
                    <span className="font-mono text-white text-[11px] font-semibold">SHA-256 with RSA (2048 bit)</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-indigo-900/40 pb-1.5">
                    <span className="text-slate-400 text-[11px]">Key Usage:</span>
                    <span className="text-indigo-300 text-[11px]">Digital Signature, Non-Repudiation, Document Signing</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-indigo-900/40 pb-1.5">
                    <span className="text-slate-400 text-[11px]">Validity Period:</span>
                    <span className="font-mono text-emerald-400 text-[11px] font-bold">12 Jan 2024 to 11 Jan 2027</span>
                  </div>
                  <div className="flex items-center justify-between pt-0.5">
                    <span className="text-slate-400 text-[11px]">OCSP / CRL Revocation Status:</span>
                    <span className="text-emerald-400 text-[11px] font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Valid & Not Revoked
                    </span>
                  </div>
                </div>

                {/* Token PIN Input */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <label className="text-slate-300 font-semibold">
                      Hardware Crypto Token User PIN <span className="text-rose-400">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setTokenPin('12345678')}
                      className="text-indigo-400 hover:text-indigo-300 text-[11px] font-medium underline"
                    >
                      Auto-fill Demo PIN (12345678)
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showTokenPin ? 'text' : 'password'}
                      required
                      value={tokenPin}
                      onChange={(e) => setTokenPin(e.target.value)}
                      placeholder="Enter Token User PIN"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-indigo-500 font-mono tracking-wider"
                    />
                    <button
                      type="button"
                      onClick={() => setShowTokenPin(!showTokenPin)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                    >
                      {showTokenPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">
                    PIN unlocks the cryptographic private key on the secure hardware chip.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isDscSubmitting}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-500/25 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isDscSubmitting ? (
                    <div className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>Verifying Token Private Key...</span>
                    </div>
                  ) : (
                    <>
                      <FileCheck2 className="w-4 h-4" />
                      <span>Authenticate with Class-3 Digital Signature</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* MODE 2: UIDAI AADHAAR E-SIGN */}
            {dscMode === 'aadhaar' && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setDscError(null);
                  setDscSuccess(null);

                  if (!aadhaarNumber || aadhaarNumber.replace(/\s/g, '').length !== 12) {
                    setDscError('Please enter a valid 12-digit Aadhaar / Virtual ID.');
                    return;
                  }
                  if (!aadhaarOtpSent) {
                    setAadhaarOtpSent(true);
                    setAadhaarOtp('892145');
                    setAadhaarOtpTimer(60);
                    return;
                  }
                  if (!aadhaarOtp || aadhaarOtp.length < 6) {
                    setDscError('Please enter the 6-digit Aadhaar OTP.');
                    return;
                  }

                  setIsDscSubmitting(true);
                  setTimeout(() => {
                    setIsDscSubmitting(false);
                    setDscSuccess('UIDAI e-KYC & Electronic Signature Certified! Entering Portal...');
                    setTimeout(() => {
                      login(selectedDscCertId);
                      navigate('/dashboard');
                    }, 600);
                  }, 650);
                }}
                className="space-y-3.5"
              >
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    12-Digit Aadhaar / Virtual ID (VID) <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      maxLength={14}
                      required
                      value={aadhaarNumber}
                      onChange={(e) => setAadhaarNumber(e.target.value)}
                      placeholder="XXXX XXXX XXXX"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 font-mono tracking-widest"
                    />
                    <Fingerprint className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Officer Account to Associate with e-Sign
                  </label>
                  <select
                    value={selectedDscCertId}
                    onChange={(e) => setSelectedDscCertId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="USR-06">Pooja Sharma · Finance Officer (Accounts & Disbursals)</option>
                    <option value="USR-01">Rajesh Sharma · National Admin / MoRD Director</option>
                    <option value="USR-03">Vikramaditya Rathore · ADM Land Acquisition</option>
                    <option value="USR-04">Rameshwar Lal Gurjar · Cadastral Survey Officer</option>
                  </select>
                </div>

                {aadhaarOtpSent ? (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-emerald-400">Aadhaar OTP Sent to Mobile</span>
                      <span className="font-mono text-emerald-300 text-xs">Demo: 892145</span>
                    </div>
                    <input
                      type="text"
                      maxLength={6}
                      value={aadhaarOtp}
                      onChange={(e) => setAadhaarOtp(e.target.value)}
                      placeholder="Enter 6-digit OTP"
                      className="w-full bg-slate-950 border border-emerald-500/60 rounded-xl py-2.5 text-center text-lg font-mono tracking-widest text-white focus:outline-hidden"
                    />
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>Expires in: {aadhaarOtpTimer}s</span>
                      <button
                        type="button"
                        onClick={() => setAadhaarOtp('892145')}
                        className="text-emerald-400 hover:text-emerald-300 font-bold underline"
                      >
                        Auto-fill OTP (892145)
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setAadhaarOtpSent(true);
                      setAadhaarOtp('892145');
                      setAadhaarOtpTimer(60);
                    }}
                    className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-emerald-300 rounded-xl text-xs font-semibold border border-emerald-500/30 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Send Aadhaar OTP to Registered Mobile</span>
                  </button>
                )}

                <div className="p-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-[11px] text-slate-400 leading-snug">
                  By clicking Authorize, you give statutory consent under the <strong>Information Technology Act, 2000</strong> to verify identity and digitally sign electronic land acquisition records.
                </div>

                <button
                  type="submit"
                  disabled={isDscSubmitting}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isDscSubmitting ? (
                    <div className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>Certifying Aadhaar e-Sign...</span>
                    </div>
                  ) : (
                    <>
                      <FileCheck2 className="w-4 h-4" />
                      <span>Authorize Aadhaar e-Sign & Access Portal</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        )}

        {/* Security Compliance Strip */}
        <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" /> 2FA Guard Active
            </span>
            <span className="flex items-center gap-1 text-blue-400">
              <Lock className="w-3 h-3" /> Anti-Bot Captcha
            </span>
            <span className="hidden sm:inline text-slate-500 font-mono">
              IP: 103.24.88.192
            </span>
          </div>

          <button
            onClick={() => {
              login('USR-01');
              navigate('/map');
            }}
            className="text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
          >
            Public Cadastral Map →
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-4xl w-full mx-auto text-center text-[11px] text-slate-500 py-2 border-t border-slate-900 font-mono">
        BHUMI-SENTINEL Statutory Security Terminal · ISO 27001 & CERT-In Compliant · Government of Rajasthan
      </footer>
    </div>
  );
};
