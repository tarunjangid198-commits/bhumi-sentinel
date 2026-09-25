import React, { useState } from 'react';
import { DigitalFile } from '../../types';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, X, AlertCircle } from 'lucide-react';

interface AcceptFileModalProps {
  file: DigitalFile;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AcceptFileModal: React.FC<AcceptFileModalProps> = ({ file, isOpen, onClose, onSuccess }) => {
  const { acceptFile, currentUser } = useApp();
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setLoading(true);
    await acceptFile(file.fileId, remarks);
    setLoading(false);
    onClose();
    if (onSuccess) onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Accept Incoming File?</h3>
              <p className="text-[11px] text-slate-500">Official Case File Intake</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-3.5 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Digital File ID:</span>
              <span className="font-mono font-bold text-slate-900">{file.fileId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Parcel Target:</span>
              <span className="font-bold text-blue-700">{file.parcelId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Current Stage:</span>
              <span className="font-semibold text-slate-900">{file.currentStage}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Forwarded From:</span>
              <span className="text-slate-800 font-medium">
                {file.previousOfficer || 'District Revenue Officer'}
              </span>
            </div>
          </div>

          <div className="flex items-start space-x-2 text-xs text-slate-600">
            <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p>
              By accepting, you certify custody of this acquisition file. The file will transition from{' '}
              <strong className="text-slate-900">Incoming Files</strong> to your{' '}
              <strong className="text-blue-700">Active Files</strong> queue.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Receipt Remarks (Optional)
            </label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="e.g., File received with all annexures. Assigned for active scrutiny."
              rows={2}
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex justify-end space-x-2">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="px-5 py-2 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all flex items-center space-x-1.5"
          >
            {loading ? <span>Processing...</span> : <span>Confirm Acceptance</span>}
          </button>
        </div>
      </div>
    </div>
  );
};
