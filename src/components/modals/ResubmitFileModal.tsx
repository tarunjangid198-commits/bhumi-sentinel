import React, { useState } from 'react';
import { DigitalFile } from '../../types';
import { useApp } from '../../context/AppContext';
import { Send, X, CheckCircle, AlertTriangle } from 'lucide-react';

interface ResubmitFileModalProps {
  file: DigitalFile;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ResubmitFileModal: React.FC<ResubmitFileModalProps> = ({ file, isOpen, onClose, onSuccess }) => {
  const { resubmitFile } = useApp();
  const [remarks, setRemarks] = useState(
    'Discrepancy reconciled against village Jamabandi register. Corrected schedule and revenue extract attached.'
  );
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!remarks.trim()) {
      alert('Please specify the resolution remarks.');
      return;
    }
    setLoading(true);
    await resubmitFile(file.fileId, { remarks });
    setLoading(false);
    onClose();
    if (onSuccess) onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-emerald-50 px-6 py-4 border-b border-emerald-100 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Resolve Deficiency & Resubmit File</h3>
              <p className="text-[11px] text-emerald-700 font-medium">
                File: <span className="font-mono">{file.fileId}</span> (Parcel {file.parcelId})
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-500">Returned By:</span>
              <span className="font-semibold text-slate-900">{file.previousOfficer || 'Returning Officer'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Reason Category:</span>
              <span className="font-bold text-rose-600">{file.returnReasonCategory || 'Data Mismatch'}</span>
            </div>
            {file.requiredCorrection && (
              <div className="pt-1 border-t border-slate-200">
                <span className="text-slate-500 block">Stated Correction Required:</span>
                <span className="font-medium text-slate-800 italic">{file.requiredCorrection}</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              Resolution Remarks & Attached Rectifications <span className="text-emerald-600">*</span>
            </label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="State what correction was executed (e.g., corrected area calculation sheet, revised Jamabandi, or boundary surveyor sign-off)..."
              rows={4}
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              required
            />
          </div>

          {/* Footer */}
          <div className="pt-2 flex justify-end space-x-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-500/20 flex items-center space-x-1.5"
            >
              {loading ? <span>Resubmitting...</span> : <span>Confirm & Resubmit File</span>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
