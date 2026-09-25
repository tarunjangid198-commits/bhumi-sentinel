import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import {
  QrCode,
  Smartphone,
  Copy,
  Check,
  Camera,
  X,
  ExternalLink,
  Code,
  Layers,
  Sparkles,
  RefreshCw,
  Search,
  ScanLine,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

interface MobileScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'expo' | 'camera';
}

export const MobileScannerModal: React.FC<MobileScannerModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'expo',
}) => {
  const navigate = useNavigate();
  const { parcels } = useApp();

  const [activeTab, setActiveTab] = useState<'expo' | 'camera' | 'code'>(defaultTab);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Live Camera Scanner State
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // App URL: Prefer shared public URL if in AI Studio, else current window location
  const appUrl =
    typeof window !== 'undefined'
      ? window.location.href.includes('ais-dev') || window.location.href.includes('ais-pre')
        ? 'https://ais-pre-gl4en2ko25d6ocbitxh2jt-331635882482.asia-east1.run.app'
        : window.location.origin
      : 'https://ais-pre-gl4en2ko25d6ocbitxh2jt-331635882482.asia-east1.run.app';

  // Generate QR Code on mount or tab change
  useEffect(() => {
    if (isOpen) {
      QRCode.toDataURL(appUrl, {
        width: 320,
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
        errorCorrectionLevel: 'H',
      })
        .then((url) => setQrCodeDataUrl(url))
        .catch((err) => console.error('Failed to generate QR code', err));
    }
  }, [isOpen, appUrl]);

  // Handle Camera streaming
  useEffect(() => {
    if (isOpen && activeTab === 'camera' && cameraActive) {
      navigator.mediaDevices
        ?.getUserMedia({ video: { facingMode: 'environment' } })
        .then((stream) => {
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(() => {});
          }
          setCameraError(null);
        })
        .catch((err) => {
          console.warn('Camera access not granted or unavailable:', err);
          setCameraError(
            'Camera permission unavailable in this browser environment. You can use the instant parcel simulator below.'
          );
          setCameraActive(false);
        });
    } else {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, [isOpen, activeTab, cameraActive]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const expoCodeSnippet = `// Expo Go / React Native WebView Launcher
// 1. In your Expo project, run: npx expo install react-native-webview
// 2. Paste this into App.js:

import React from 'react';
import { StyleSheet, SafeAreaView, StatusBar, Platform } from 'react-native';
import { WebView } from 'react-native-webview';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      <WebView
        source={{ uri: '${appUrl}' }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={true}
        allowsInlineMediaPlayback={true}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  webview: {
    flex: 1,
  },
});`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(expoCodeSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleSimulateScan = (parcelId: string) => {
    setScannedResult(parcelId);
    setTimeout(() => {
      onClose();
      navigate(`/cases/${parcelId}`);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-8">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5">
                <span>Scan & Launch on Mobile / Expo Go</span>
              </h3>
              <p className="text-[11px] text-slate-400">
                BHUMI-SENTINEL Mobile Interface & Cadastral QR Scanner
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('expo')}
            className={`flex-1 py-3 px-4 flex items-center justify-center space-x-2 border-b-2 transition-all ${
              activeTab === 'expo'
                ? 'border-blue-600 text-blue-600 bg-white font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Expo Go & Phone QR</span>
          </button>
          <button
            onClick={() => setActiveTab('camera')}
            className={`flex-1 py-3 px-4 flex items-center justify-center space-x-2 border-b-2 transition-all ${
              activeTab === 'camera'
                ? 'border-blue-600 text-blue-600 bg-white font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <ScanLine className="w-4 h-4" />
            <span>Cadastral Parcel Scanner</span>
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`flex-1 py-3 px-4 flex items-center justify-center space-x-2 border-b-2 transition-all ${
              activeTab === 'code'
                ? 'border-blue-600 text-blue-600 bg-white font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Code className="w-4 h-4" />
            <span>Expo App.js Code</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {/* TAB 1: EXPO GO & MOBILE QR SCANNER */}
          {activeTab === 'expo' && (
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-3 bg-white border-2 border-slate-200 rounded-2xl shadow-inner inline-block">
                {qrCodeDataUrl ? (
                  <img
                    src={qrCodeDataUrl}
                    alt="Expo Go / Mobile QR Code"
                    className="w-56 h-56 object-contain rounded-lg"
                  />
                ) : (
                  <div className="w-56 h-56 flex items-center justify-center bg-slate-100 rounded-lg animate-pulse text-xs text-slate-400">
                    Generating high-resolution QR...
                  </div>
                )}
              </div>

              <div className="space-y-1 max-w-md">
                <span className="text-xs font-extrabold uppercase text-emerald-600 tracking-wider flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Instant Live Mobile Launch
                </span>
                <p className="text-xs text-slate-600">
                  Point your <strong>Expo Go QR Scanner</strong>, iPhone Camera, or Android Google Lens at this code to test this app on your phone.
                </p>
              </div>

              {/* URL with Copy Button */}
              <div className="w-full flex items-center space-x-2 bg-slate-50 border border-slate-200 p-2 rounded-xl text-xs">
                <input
                  type="text"
                  readOnly
                  value={appUrl}
                  className="bg-transparent flex-1 text-slate-700 font-mono text-[11px] truncate focus:outline-hidden"
                />
                <button
                  onClick={handleCopyLink}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-colors shrink-0 ${
                    copied
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
              </div>

              {/* Step by step helper */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full text-left pt-2 text-xs">
                <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl space-y-1">
                  <span className="font-bold text-blue-900 block flex items-center gap-1">
                    <Smartphone className="w-3.5 h-3.5 text-blue-600" />
                    Option A: Native Mobile Browser
                  </span>
                  <p className="text-[11px] text-blue-800">
                    Scan with default Camera app on iOS or Android. No installation required.
                  </p>
                </div>

                <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-xl space-y-1">
                  <span className="font-bold text-purple-900 block flex items-center gap-1">
                    <Code className="w-3.5 h-3.5 text-purple-600" />
                    Option B: Inside Expo Go App
                  </span>
                  <p className="text-[11px] text-purple-800">
                    Wrap with <code className="bg-purple-100 px-1 rounded">react-native-webview</code> (see "Expo App.js Code" tab) to run full native.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CADASTRAL PARCEL SCANNER (For Field Officers) */}
          {activeTab === 'camera' && (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Field Cadastral Deed & Parcel QR Scanner
                </h4>
                <p className="text-xs text-slate-500">
                  Scan physical land deed QR stickers, Khasra markers, or file covers to open their live dossier.
                </p>
              </div>

              {/* Video preview / Simulated scanner area */}
              <div className="relative aspect-video w-full max-w-md mx-auto bg-slate-900 rounded-2xl overflow-hidden border-2 border-slate-700 flex items-center justify-center">
                {cameraActive ? (
                  <video
                    ref={videoRef}
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="p-6 text-center text-slate-400 space-y-3">
                    <Camera className="w-10 h-10 mx-auto text-slate-600 animate-pulse" />
                    <p className="text-xs">
                      {cameraError || 'Camera inactive. Click below to start scanning via device webcam/camera.'}
                    </p>
                    <button
                      onClick={() => setCameraActive(true)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold inline-flex items-center space-x-1.5 transition-colors"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Start Camera</span>
                    </button>
                  </div>
                )}

                {/* Reticle Overlay */}
                <div className="absolute inset-8 border-2 border-emerald-400/80 rounded-xl pointer-events-none flex items-center justify-center">
                  <div className="w-full h-0.5 bg-emerald-400/80 shadow-[0_0_12px_rgba(52,211,153,0.9)] animate-bounce" />
                </div>

                {scannedResult && (
                  <div className="absolute inset-0 bg-emerald-950/90 flex flex-col items-center justify-center text-white space-y-2 p-4">
                    <Check className="w-8 h-8 text-emerald-400" />
                    <span className="font-mono font-bold text-sm">
                      Recognized Parcel: {scannedResult}
                    </span>
                    <span className="text-xs text-emerald-200">Opening Cadastral Dossier...</span>
                  </div>
                )}
              </div>

              {/* Quick One-Click Parcel Scans for Demo / Testing */}
              <div className="space-y-2 pt-2">
                <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">
                  Or Test Scan a Registered Land Parcel:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {parcels.slice(0, 6).map((p) => (
                    <button
                      key={p.parcelId}
                      onClick={() => handleSimulateScan(p.parcelId)}
                      className="p-2.5 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 border border-slate-200 rounded-xl text-left transition-all group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900 group-hover:text-blue-700 font-mono">
                          {p.parcelId}
                        </span>
                        <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-blue-600" />
                      </div>
                      <span className="text-[10px] text-slate-500 block truncate">
                        Khasra {p.khasraNumber} ({p.district})
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: EXPO APP.JS EMBED CODE */}
          {activeTab === 'code' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">
                    Run Natively in Expo Go with WebView
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Paste this into your Expo project <code className="bg-slate-100 px-1 rounded font-mono">App.js</code>:
                  </p>
                </div>
                <button
                  onClick={handleCopyCode}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-colors ${
                    copiedCode
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-900 text-white hover:bg-black'
                  }`}
                >
                  {copiedCode ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy App.js</span>
                    </>
                  )}
                </button>
              </div>

              <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 p-4 text-[11px] font-mono text-emerald-400 max-h-72 overflow-y-auto">
                <pre>{expoCodeSnippet}</pre>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 space-y-1">
                <span className="font-bold block">Quick Run Instructions:</span>
                <ol className="list-decimal list-inside space-y-0.5 text-amber-800">
                  <li>Run <code className="bg-amber-100 px-1 rounded font-mono">npx create-expo-app bhumi-mobile</code></li>
                  <li>Run <code className="bg-amber-100 px-1 rounded font-mono">npx expo install react-native-webview</code></li>
                  <li>Replace <code className="bg-amber-100 px-1 rounded font-mono">App.js</code> with this snippet and run <code className="bg-amber-100 px-1 rounded font-mono">npx expo start</code></li>
                  <li>Scan the terminal QR code with your Expo Go app!</li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Target URL: <strong className="font-mono text-slate-700">{appUrl}</strong></span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-bold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
