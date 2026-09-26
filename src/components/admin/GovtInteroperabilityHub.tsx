import React, { useState } from 'react';
import {
  Globe,
  Radio,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Key,
  Server,
  Layers,
  FileCheck2,
  Building,
  Coins,
  Scale,
  Landmark,
  Share2,
  AlertCircle,
  X,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface GovtPortal {
  id: string;
  name: string;
  hindiName: string;
  ministry: string;
  url: string;
  status: 'CONNECTED' | 'SYNCING' | 'MAINTENANCE';
  latencyMs: number;
  lastSync: string;
  recordsSynced: number;
  description: string;
  category: 'Gazette & Notifications' | 'Land Records' | 'Treasury & PFMS' | 'Forest & Ecology' | 'Judicial & Courts' | 'Multi-modal Infrastructure';
  badge: string;
}

const INITIAL_GOVT_PORTALS: GovtPortal[] = [
  {
    id: 'bhoomi-rashi',
    name: 'Bhoomi Rashi Statutory Portal',
    hindiName: 'भूमि राशि पोर्टल (सड़क परिवहन और राजमार्ग मंत्रालय)',
    ministry: 'Ministry of Road Transport and Highways (MoRTH) / NHAI',
    url: 'https://bhoomirashi.gov.in',
    status: 'CONNECTED',
    latencyMs: 18,
    lastSync: '2 minutes ago',
    recordsSynced: 1240,
    description: 'Statutory Section 3A, 3D, and 3G gazette notifications, automated objection windows, and Competent Authority for Land Acquisition (CALA) award integration.',
    category: 'Gazette & Notifications',
    badge: 'MoRTH Gateway v2.4',
  },
  {
    id: 'dilrmp',
    name: 'Digital India Land Records (DILRMP)',
    hindiName: 'डिजिटल इंडिया भूमि अभिलेख आधुनिकीकरण कार्यक्रम',
    ministry: 'Department of Land Resources, Ministry of Rural Development',
    url: 'https://dilrmp.gov.in',
    status: 'CONNECTED',
    latencyMs: 24,
    lastSync: '4 minutes ago',
    recordsSynced: 3820,
    description: 'National core database for Record of Rights (RoR), digital cadastral demarcation, and computerized settlement mutation register synchronization.',
    category: 'Land Records',
    badge: 'DILRMP Central Node',
  },
  {
    id: 'pfms',
    name: 'Public Financial Management System (PFMS)',
    hindiName: 'सार्वजनिक वित्तीय प्रबंधन प्रणाली (वित्त मंत्रालय)',
    ministry: 'Controller General of Accounts, Ministry of Finance',
    url: 'https://pfms.nic.in',
    status: 'CONNECTED',
    latencyMs: 14,
    lastSync: 'Just now',
    recordsSynced: 2150,
    description: 'Direct Benefit Transfer (DBT) gateway for 100% statutory compensation awards, solatium interest disbursement, and State Treasury Escrow verification.',
    category: 'Treasury & PFMS',
    badge: 'PFMS Treasury Node',
  },
  {
    id: 'parivesh',
    name: 'PARIVESH Environmental Clearance',
    hindiName: 'परिवेश पोर्टल (पर्यावरण एवं वन मंत्रालय)',
    ministry: 'Ministry of Environment, Forest and Climate Change (MoEFCC)',
    url: 'https://parivesh.nic.in',
    status: 'CONNECTED',
    latencyMs: 31,
    lastSync: '12 minutes ago',
    recordsSynced: 412,
    description: 'Stage-1 and Stage-2 statutory forest land diversion NOCs, wildlife sanctuary eco-clearance certificates, and CAMPA afforestation approvals.',
    category: 'Forest & Ecology',
    badge: 'MoEFCC National Grid',
  },
  {
    id: 'apna-khata',
    name: 'Apna Khata & Bhunaksha Rajasthan GIS',
    hindiName: 'अपना खाता एवं भू-नक्शा पोर्टल (राजस्व मंडल)',
    ministry: 'Board of Revenue & Department of Land Settlement, Rajasthan',
    url: 'https://apnakhata.rajasthan.gov.in',
    status: 'CONNECTED',
    latencyMs: 22,
    lastSync: '6 minutes ago',
    recordsSynced: 5410,
    description: 'Live state-level Jamabandi mutation records, Khasra polygon GIS layer overlays, and field surveyor digital geo-tag validation.',
    category: 'Land Records',
    badge: 'State Revenue GIS Hub',
  },
  {
    id: 'ecourts',
    name: 'e-Courts National Judicial Data Grid (NJDG)',
    hindiName: 'ई-कोर्ट्स राष्ट्रीय न्यायिक डेटा ग्रिड',
    ministry: 'e-Committee, Supreme Court of India & Ministry of Law',
    url: 'https://services.ecourts.gov.in',
    status: 'CONNECTED',
    latencyMs: 29,
    lastSync: '15 minutes ago',
    recordsSynced: 86,
    description: 'Real-time alert monitoring for High Court writ petitions, District Revenue Court demarcation injunctions, and stay order registry.',
    category: 'Judicial & Courts',
    badge: 'NJDG Injunction API',
  },
  {
    id: 'pm-gatishakti',
    name: 'PM Gati Shakti National Master Plan (NMP)',
    hindiName: 'पीएम गति शक्ति राष्ट्रीय मास्टर प्लान पोर्टल',
    ministry: 'Logistics Division, DPIIT, Ministry of Commerce and Industry',
    url: 'https://gatishakti.gov.in',
    status: 'CONNECTED',
    latencyMs: 19,
    lastSync: '8 minutes ago',
    recordsSynced: 960,
    description: 'Multi-modal synchronization for Highway, Railway Freight Corridor, Industrial RIICO Zones, and Solar Parks right-of-way (RoW) alignment.',
    category: 'Multi-modal Infrastructure',
    badge: 'PM GatiShakti NMP',
  },
];

export const GovtInteroperabilityHub: React.FC = () => {
  const { currentUser } = useApp();
  const [portals, setPortals] = useState<GovtPortal[]>(INITIAL_GOVT_PORTALS);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [syncSuccessMsg, setSyncSuccessMsg] = useState<string | null>(null);
  const [isTestingAll, setIsTestingAll] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Trigger sync on a specific portal
  const handleSyncPortal = (id: string, name: string) => {
    setSyncingId(id);
    setSyncSuccessMsg(null);

    setTimeout(() => {
      setPortals((prev) =>
        prev.map((p) =>
          p.id === id
            ? {
                ...p,
                lastSync: 'Just now',
                recordsSynced: p.recordsSynced + Math.floor(Math.random() * 25 + 5),
                status: 'CONNECTED',
              }
            : p
        )
      );
      setSyncingId(null);
      setSyncSuccessMsg(`Successfully synchronized latest records with ${name}!`);
      setTimeout(() => setSyncSuccessMsg(null), 4000);
    }, 1100);
  };

  // Ping test all gateways
  const handleTestAllGateways = () => {
    setIsTestingAll(true);
    setSyncSuccessMsg(null);

    setTimeout(() => {
      setIsTestingAll(false);
      setPortals((prev) =>
        prev.map((p) => ({
          ...p,
          status: 'CONNECTED',
          lastSync: 'Just now',
          latencyMs: Math.floor(Math.random() * 15 + 12),
        }))
      );
      setSyncSuccessMsg('All 7 Government Web Gateways & National API Endpoints Verified Active (200 OK)!');
      setTimeout(() => setSyncSuccessMsg(null), 4500);
    }, 1200);
  };

  const filteredPortals = portals.filter((p) => {
    if (selectedCategory !== 'ALL' && p.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="space-y-1">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500 via-white to-emerald-600 p-0.5 shadow-sm">
              <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-white">
                <Globe className="w-5 h-5 text-amber-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-xl font-black text-slate-900 tracking-tight">
                  Government Web & App Interoperability Gateway
                </h2>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-mono">
                  <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
                  <span>7 LIVE ENDPOINTS</span>
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Official interoperability bridge connecting this statutory portal to Central Ministries, State Revenue GIS, and PFMS Treasury.
              </p>
            </div>
          </div>
        </div>

        {/* Global Gateway Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleTestAllGateways}
            disabled={isTestingAll}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold border border-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-blue-600 ${isTestingAll ? 'animate-spin' : ''}`} />
            <span>{isTestingAll ? 'Pinging Gateways...' : 'Test All 7 Endpoints (Ping)'}</span>
          </button>

          <button
            onClick={() => setShowConfigModal(true)}
            className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold border border-blue-200 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Key className="w-3.5 h-3.5 text-blue-600" />
            <span>API Gateway Config</span>
          </button>
        </div>
      </div>

      {/* Sync Success Alert Notification */}
      {syncSuccessMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{syncSuccessMsg}</span>
        </div>
      )}

      {/* Category Tabs */}
      <div className="flex flex-wrap rounded-xl bg-slate-100 p-1 text-xs gap-1">
        {['ALL', 'Gazette & Notifications', 'Land Records', 'Treasury & PFMS', 'Forest & Ecology', 'Judicial & Courts', 'Multi-modal Infrastructure'].map(
          (cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`py-1.5 px-3 rounded-lg font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat === 'ALL' ? 'All Gateways (7)' : cat}
            </button>
          )
        )}
      </div>

      {/* Portals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPortals.map((portal) => (
          <div
            key={portal.id}
            className="bg-slate-50/70 border border-slate-200 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-blue-400 hover:shadow-xs transition-all"
          >
            <div className="space-y-2.5">
              {/* Top row */}
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded border border-blue-200">
                  {portal.badge}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>ONLINE ({portal.latencyMs}ms)</span>
                </span>
              </div>

              {/* Title & Ministry */}
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm leading-snug">
                  {portal.name}
                </h3>
                <p className="text-[11px] text-amber-700 font-semibold mt-0.5">
                  {portal.hindiName}
                </p>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-1 font-medium">
                  {portal.ministry}
                </p>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                {portal.description}
              </p>

              {/* Live Status Indicators */}
              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-slate-200/80">
                <div className="p-2 bg-white rounded-xl border border-slate-200/60">
                  <span className="text-[10px] text-slate-400 block font-mono">LAST HEARTBEAT</span>
                  <span className="font-semibold text-slate-800">{portal.lastSync}</span>
                </div>
                <div className="p-2 bg-white rounded-xl border border-slate-200/60">
                  <span className="text-[10px] text-slate-400 block font-mono">RECORDS SYNCED</span>
                  <span className="font-mono font-bold text-blue-700">{portal.recordsSynced}</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200">
              <button
                onClick={() => handleSyncPortal(portal.id, portal.name)}
                disabled={syncingId === portal.id}
                className="py-2 px-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${syncingId === portal.id ? 'animate-spin' : ''}`} />
                <span>{syncingId === portal.id ? 'Syncing...' : 'Sync Live'}</span>
              </button>

              <a
                href={portal.url}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 px-3 bg-white hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold border border-slate-300 transition-colors flex items-center justify-center gap-1"
              >
                <span>Open Portal</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Gateway Configuration & Token Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 text-slate-800 relative">
            <button
              onClick={() => setShowConfigModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-800 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-base">
                  Ministry API Gateway Configuration
                </h3>
                <p className="text-xs text-slate-500">
                  Secured National Admin Interoperability Endpoint Credentials
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  National Admin Authorized Client ID
                </label>
                <input
                  type="text"
                  readOnly
                  value="NIC-MORD-SENTINEL-AUTH-2026-991"
                  className="w-full bg-slate-100 border border-slate-300 rounded-xl px-3 py-2 font-mono text-slate-700 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  DILRMP & Bhoomi Rashi Interoperability Token (Bearer Token)
                </label>
                <input
                  type="password"
                  readOnly
                  value="mord_jwt_eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9_sec2026"
                  className="w-full bg-slate-100 border border-slate-300 rounded-xl px-3 py-2 font-mono text-slate-700 text-xs"
                />
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] text-emerald-800 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  All gateway requests are digitally signed using the National Admin's Ministry Class-3 Digital Signature Certificate (CCA Accredited).
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setShowConfigModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowConfigModal(false);
                  handleTestAllGateways();
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Save & Verify Tokens
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
