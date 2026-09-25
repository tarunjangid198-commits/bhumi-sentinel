import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Role } from '../types';
import {
  ShieldCheck,
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
  HelpCircle,
  Eye,
  EyeOff,
  UserPlus,
  LogIn,
  Sparkles,
  AlertCircle,
  MapPin,
  Briefcase,
  BadgeCheck,
} from 'lucide-react';

interface LoginPageProps {
  initialTab?: 'login' | 'register' | 'persona' | 'dsc';
}

export const LoginPage: React.FC<LoginPageProps> = ({ initialTab = 'login' }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { allUsers, login, registerUser, isAuthenticated, currentUser } = useApp();

  // Determine starting tab from URL query (?tab=register) or prop
  const queryTab = searchParams.get('tab') as 'login' | 'register' | 'persona' | 'dsc' | null;
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'persona' | 'dsc'>(
    queryTab || initialTab
  );

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('RJ_GOV_RAJESH');
  const [loginPassword, setLoginPassword] = useState('Sentinel@2026');
  const [loginRole, setLoginRole] = useState<Role>(allUsers[0]?.role || 'National Admin');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Register form state
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

  // OTP Demo state
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  // Synchronize query param if changes
  useEffect(() => {
    if (queryTab && ['login', 'register', 'persona', 'dsc'].includes(queryTab)) {
      setActiveTab(queryTab);
    }
  }, [queryTab]);

  // Handle Quick 1-Click Login
  const handleQuickLogin = (userId: string) => {
    login(userId);
    navigate('/dashboard');
  };

  // Handle Login Submission
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);

    setTimeout(() => {
      setIsLoggingIn(false);

      const idLower = loginIdentifier.trim().toLowerCase();
      // Try to match user by email, employeeId, name, or role
      const matched = allUsers.find(
        (u) =>
          u.email.toLowerCase() === idLower ||
          u.employeeId?.toLowerCase() === idLower ||
          u.id.toLowerCase() === idLower ||
          u.name.toLowerCase().includes(idLower)
      );

      if (matched) {
        login(matched.id);
        navigate('/dashboard');
      } else {
        // Fallback to role match or first user for demo convenience
        const byRole = allUsers.find((u) => u.role === loginRole) || allUsers[0];
        login(byRole.id);
        navigate('/dashboard');
      }
    }, 400);
  };

  // Handle Registration Submission
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);
    setRegSuccess(null);

    // Validation
    if (!regFullName.trim()) {
      setRegError('Please provide your full legal name.');
      return;
    }
    if (!regEmail.trim() || !regEmail.includes('@')) {
      setRegError('Please provide a valid departmental or official email address.');
      return;
    }
    if (regPassword.length < 6) {
      setRegError('Password must be at least 6 characters in length.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setRegError('Passwords do not match. Please verify your password entry.');
      return;
    }
    if (!agreedTerms) {
      setRegError('You must acknowledge the statutory authorization terms.');
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

        setRegSuccess(`Account successfully created for ${newUser.name}! Redirecting to portal...`);

        setTimeout(() => {
          navigate('/dashboard');
        }, 800);
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
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Navigation */}
      <header className="max-w-5xl w-full mx-auto flex items-center justify-between py-3 border-b border-slate-800/80 relative z-10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20 ring-1 ring-blue-400/30">
            <ShieldCheck className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-sm sm:text-base tracking-wider text-white">BHUMI-SENTINEL</span>
              <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full border border-blue-500/30 font-semibold hidden sm:inline-block">
                RFCTLARR 2013 Statutory Gateway
              </span>
            </div>
            <span className="text-[11px] text-slate-400 block font-mono">
              National Land Acquisition Risk & Cadastral Intelligence Platform
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isAuthenticated && (
            <div className="hidden sm:flex items-center gap-2 text-xs bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="truncate max-w-[140px]">Signed in: {currentUser.name}</span>
              <button
                onClick={() => navigate('/dashboard')}
                className="text-blue-400 hover:text-blue-300 font-bold ml-1"
              >
                Go to App →
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
        {/* Title Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-semibold">
            <Lock className="w-3.5 h-3.5 text-blue-400" />
            <span>Authorized Officer & Stakeholder Gateway</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
            {activeTab === 'login' && 'Sign In to Your Officer Account'}
            {activeTab === 'register' && 'Create New Officer Account'}
            {activeTab === 'persona' && '1-Click Statutory Officer Personas'}
            {activeTab === 'dsc' && 'Class-3 Digital Signature Authentication'}
          </h1>
          <p className="text-xs text-slate-400 max-w-lg mx-auto leading-relaxed">
            {activeTab === 'login' &&
              'Enter your SSO credentials, employee ID, or registered email to access cadastral surveys, compensation disbursement, and acquisition workflows.'}
            {activeTab === 'register' &&
              'Register your designation and jurisdiction to access the multi-tier land acquisition decision pipeline and cadastral map.'}
            {activeTab === 'persona' &&
              'Instant simulation: select any pre-configured statutory officer profile to test specific permissions, files, and role dashboards.'}
            {activeTab === 'dsc' &&
              'Cryptographic hardware e-Sign token verification for statutory awards, 2013 act notices, and direct escrow releases.'}
          </p>
        </div>

        {/* Primary Tab Switcher */}
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

        {/* ----------------- TAB 1: LOGIN ----------------- */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {loginError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{loginError}</span>
              </div>
            )}

            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                  <span>SSO ID / Official Email / Username</span>
                  <span className="text-[11px] text-slate-500">e.g. RJ_GOV_RAJESH or Email</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500 transition-colors"
                    placeholder="Enter SSO ID, Employee Code, or Email"
                  />
                  <Building className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                  <span>Departmental Security Password</span>
                  <span className="text-[11px] text-slate-500">Default: Sentinel@2026</span>
                </label>
                <div className="relative">
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500 transition-colors font-mono"
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

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Designated Officer Role / Authority Level
                </label>
                <select
                  value={loginRole}
                  onChange={(e) => setLoginRole(e.target.value as Role)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-hidden focus:border-blue-500 cursor-pointer"
                >
                  <option value="National Admin">National Admin · Ministry of Rural Development</option>
                  <option value="State Officer">State Officer · Principal Secretary Revenue</option>
                  <option value="District Officer">District Officer · ADM / Land Acquisition Officer</option>
                  <option value="Survey Officer">Survey Officer · Head Cadastral Surveyor</option>
                  <option value="Legal Officer">Legal Officer · Senior Legal Dispute Arbiter</option>
                  <option value="Finance Officer">Finance Officer · Chief Accounts Officer</option>
                  <option value="Project Authority">Project Authority · NHAI / Infrastructure Director</option>
                </select>
              </div>

              {otpSent ? (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl space-y-2">
                  <label className="block text-xs font-semibold text-emerald-400 flex items-center justify-between">
                    <span>One-Time Password (OTP) Verified</span>
                    <span className="text-[10px] text-emerald-300 font-mono">Demo OTP: 458921</span>
                  </label>
                  <input
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="Enter 6-digit OTP"
                    className="w-full bg-slate-950 border border-emerald-500/60 rounded-xl px-3 py-2 text-xs text-white font-mono tracking-widest text-center focus:outline-hidden"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-between pt-0.5 text-xs">
                  <span className="text-slate-400 text-[11px]">Two-Factor Authentication:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setOtpSent(true);
                      setOtpCode('458921');
                    }}
                    className="text-blue-400 hover:text-blue-300 text-[11px] font-bold"
                  >
                    Send OTP to Registered Mobile
                  </button>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoggingIn ? (
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Verifying Credentials...</span>
                </div>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Authenticate & Enter Platform</span>
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
        {activeTab === 'register' && (
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
                    placeholder="vikram.rathore@rajasthan.gov.in"
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
                    // auto-adjust department hint
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
                  Create Password <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 transition-colors font-mono"
                    placeholder="Min 6 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  >
                    {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
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
                  <span>Registering Officer Account...</span>
                </div>
              ) : (
                <>
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Create Account & Enter Platform</span>
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
        {activeTab === 'persona' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
              <span className="font-semibold text-slate-300">Choose Officer Persona to Simulate</span>
              <span className="font-mono text-emerald-400 text-[11px] font-bold">Instant 1-Click Access</span>
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

            {/* Demo Recommendation */}
            <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-200 space-y-1">
              <span className="font-bold text-amber-400 block flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Recommended Demonstration Paths:
              </span>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                • <strong>Finance Officer</strong>: Review compensation calculation, accept/return case <strong>LA-2026-01024</strong>.
                <br />
                • <strong>National Admin</strong>: Complete oversight of all 10 projects, bottlenecks, satellite map, and officer directory.
              </p>
            </div>
          </div>
        )}

        {/* ----------------- TAB 4: e-SIGN / DSC TOKEN ----------------- */}
        {activeTab === 'dsc' && (
          <div className="space-y-4 text-center py-2">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 mx-auto flex items-center justify-center shadow-lg shadow-indigo-500/10">
              <Fingerprint className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">Class-3 Government Digital Signature (DSC)</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Insert USB Crypto Token or utilize UIDAI Aadhaar e-Sign to authenticate statutory acquisition orders.
              </p>
            </div>

            <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl text-left space-y-2 text-xs font-mono">
              <div className="flex justify-between text-slate-400 text-[11px]">
                <span>Token Status:</span>
                <span className="text-emerald-400 font-bold">READY (Crypto Token Active)</span>
              </div>
              <div className="flex justify-between text-slate-400 text-[11px]">
                <span>Certificate Authority:</span>
                <span className="text-white">eMudhra / Controller of Certifying Authorities (CCA)</span>
              </div>
              <div className="flex justify-between text-slate-400 text-[11px]">
                <span>Officer Certificate:</span>
                <span className="text-white">Pooja Sharma (FO-RJ-98) · Class 3 Signing & Encryption</span>
              </div>
            </div>

            <button
              onClick={() => {
                login('USR-06');
                navigate('/dashboard');
              }}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Verify DSC Token & Enter Portal</span>
            </button>
          </div>
        )}

        {/* Direct Map exploration link */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Need public cadastral information?</span>
          <button
            onClick={() => {
              login('USR-01');
              navigate('/map');
            }}
            className="text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
          >
            Access Cadastral Satellite Map →
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-4xl w-full mx-auto text-center text-[11px] text-slate-500 py-2 border-t border-slate-900 font-mono">
        BHUMI-SENTINEL Administrative Gateway · Statutory Land Acquisition Decision Engine · Government of Rajasthan
      </footer>
    </div>
  );
};
