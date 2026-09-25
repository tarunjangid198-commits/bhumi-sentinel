import React, { useState } from 'react';
import { DigitalFile } from '../../types';
import { useApp } from '../../context/AppContext';
import { RotateCcw, X, AlertTriangle } from 'lucide-react';

interface ReturnFileModalProps {
  file: DigitalFile;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ReturnFileModal: React.FC<ReturnFileModalProps> = ({ file, isOpen, onClose, onSuccess }) => {
  const { returnFile, currentUser } = useApp();

  const [reasonCategory, setReasonCategory] = useState<string>('Data Mismatch');
  const [remarks, setRemarks] = useState('');
  const [requiredCorrection, setRequiredCorrection] = useState('');
  const [returnToOfficer, setReturnToOfficer] = useState(
    file.previousOfficer || 'Ashok Kumar Meena (District Officer)'
  );
  const [returnToDept, setReturnToDept] = useState(
    file.previousDepartment || 'District Revenue Office'
  );
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!remarks.trim() || !requiredCorrection.trim()) {
      alert('Please fill out all required fields: Detailed Remarks and Required Correction.');
      return;
    }

    setLoading(true);
    await returnFile(file.fileId, {
      reasonCategory,
      remarks,
      requiredCorrection,
      returnToOfficer,
      returnToDept,
    });
    setLoading(false);
    onClose();
    if (onSuccess) onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-rose-50 px-6 py-4 border-b border-rose-100 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Return File with Deficiency</h3>
              <p className="text-[11px] text-rose-700 font-medium">
                Digital File: <span className="font-mono">{file.fileId}</span> (Parcel {file.parcelId})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p>
              Returning this file will immediately move it out of your Active queue into the previous officer's{' '}
              <strong>"Returned / Action Required"</strong> portal with an escalation audit notice.
            </p>
          </div>

          {/* Reason Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              Reason Category <span className="text-rose-500">*</span>
            </label>
            <select
              value={reasonCategory}
              onChange={(e) => setReasonCategory(e.target.value)}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:bg-white focus:outline-hidden"
              required
            >
              <option value="Data Mismatch">Data Mismatch (Area, Khasra, or Name mismatch)</option>
              <option value="Missing Document">Missing Document (Mandatory statutory upload absent)</option>
              <option value="Incorrect Document">Incorrect Document (Unauthenticated or uncertified copy)</option>
              <option value="Incomplete Survey">Incomplete Survey (Demarcation pillar/coordinates incomplete)</option>
              <option value="Incorrect Valuation">Incorrect Valuation (Circle rate or solatium calculation error)</option>
              <option value="Legal Issue">Legal Issue (Judicial stay or pending civil partition claim)</option>
              <option value="Other">Other Administrative Deficiency</option>
            </select>
          </div>

          {/* Return To Officer */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Return Target Officer <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={returnToOfficer}
                onChange={(e) => setReturnToOfficer(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Department
              </label>
              <input
                type="text"
                value={returnToDept}
                onChange={(e) => setReturnToDept(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden"
                required
              />
            </div>
          </div>

          {/* Required Correction */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              Required Specific Correction <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={requiredCorrection}
              onChange={(e) => setRequiredCorrection(e.target.value)}
              placeholder="e.g. Upload corrected Jamabandi / reconcile 2.40 ha deed area with 2.10 ha record"
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
              required
            />
          </div>

          {/* Detailed Remarks */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              Detailed Scrutiny Remarks <span className="text-rose-500">*</span>
            </label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Detail the exact finding, discrepancy numbers, and statutory clause requirements..."
              rows={3}
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
              required
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex justify-end space-x-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-lg text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-600/20 transition-all flex items-center space-x-1.5"
            >
              {loading ? <span>Returning...</span> : <span>Return File with Deficiency</span>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
