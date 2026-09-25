import React, { useState } from 'react';
import { CaseDocument, Parcel } from '../../types';
import { useApp } from '../../context/AppContext';
import { AlertOctagon, CheckCircle, X, FileText, ArrowRight, ShieldAlert } from 'lucide-react';

interface DocumentMismatchModalProps {
  document: CaseDocument;
  parcel: Parcel;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const DocumentMismatchModal: React.FC<DocumentMismatchModalProps> = ({
  document,
  parcel,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { resolveDocumentMismatch } = useApp();
  const [resolvedArea, setResolvedArea] = useState<number>(parcel.area);
  const [remarks, setRemarks] = useState(
    'Reconciled against verified Village Record of Rights (Jamabandi) & DGPS Cadastral Survey. Database value of 2.10 ha confirmed correct; excess 0.30 ha in physical deed pertained to non-acquired abutting canal buffer.'
  );
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const mismatches = document.mismatches || [
    {
      field: 'Area (Hectares)',
      documentValue: `${document.extractedData?.areaHa || 2.4} ha`,
      databaseValue: `${parcel.area} ha`,
      discrepancy: `+0.30 ha difference`,
      severity: 'CRITICAL' as const,
    },
  ];

  const handleReconcile = async () => {
    setLoading(true);
    await resolveDocumentMismatch(document.id, resolvedArea, remarks);
    setLoading(false);
    onClose();
    if (onSuccess) onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Banner */}
        <div className="bg-gradient-to-r from-rose-600 to-red-600 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center">
              <AlertOctagon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold tracking-wide uppercase">Document Mismatch Detected</h3>
              <p className="text-[11px] text-rose-100 font-mono">
                AI Cadastral Extraction vs Land Registry Database
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white p-1 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="text-xs text-slate-600">
            Document: <strong className="text-slate-900">{document.fileName}</strong> ({document.title}) for{' '}
            <strong className="text-blue-700">Parcel {parcel.parcelId} (Khasra {parcel.khasraNumber})</strong>.
          </div>

          {/* Side-by-side comparison */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 divide-y divide-slate-200">
            {mismatches.map((m, idx) => (
              <div key={idx} className="py-2 first:pt-0 last:pb-0 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span>Field: {m.field}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-rose-100 text-rose-700 font-mono">
                    {m.severity}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-3 rounded-lg border border-rose-200">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                      Extracted Document Value
                    </span>
                    <span className="text-base font-extrabold text-rose-600 font-mono">
                      {m.documentValue}
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-blue-200">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                      Database Recorded Value
                    </span>
                    <span className="text-base font-extrabold text-blue-700 font-mono">
                      {m.databaseValue}
                    </span>
                  </div>
                </div>
                <div className="text-[11px] text-rose-700 font-semibold bg-rose-50 px-2.5 py-1.5 rounded-md flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                  <span>Variance: {m.discrepancy}</span>
                </div>
              </div>
            ))}
          </div>

          {/* AI Decision recommendation */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900">
            <span className="font-bold block mb-1">AI Cadastral Advisory:</span>
            DGPS field survey coordinates corroborate 2.10 hectares. The 2.40 ha figure on the 2014 sale deed
            includes non-notified roadway set-back. Reconciling prevents statutory award overpayment of
            approx ₹30.3 Lakhs.
          </div>

          {/* Resolution Options */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-800">
              Validated Official Area (Hectares) to Certify:
            </label>
            <input
              type="number"
              step="0.01"
              value={resolvedArea}
              onChange={(e) => setResolvedArea(parseFloat(e.target.value) || 0)}
              className="w-full text-xs font-mono font-bold p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              Statutory Reconcile Justification (For Audit Log)
            </label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              rows={3}
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex justify-end space-x-2 border-t border-slate-100">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Close
            </button>
            <button
              onClick={handleReconcile}
              disabled={loading}
              className="px-5 py-2 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 flex items-center space-x-1.5"
            >
              {loading ? <span>Reconciling...</span> : <span>Reconcile Mismatch & Verify</span>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
