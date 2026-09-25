import React, { useState } from 'react';
import { DigitalFile } from '../../types';
import { useApp } from '../../context/AppContext';
import { ArrowRight, X, Calendar, UserCheck } from 'lucide-react';

interface ForwardFileModalProps {
  file: DigitalFile;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ForwardFileModal: React.FC<ForwardFileModalProps> = ({ file, isOpen, onClose, onSuccess }) => {
  const { forwardFile, allUsers } = useApp();

  const [nextOfficer, setNextOfficer] = useState('Col. Sanjeev Nair (Project Authority)');
  const [nextDepartment, setNextDepartment] = useState('NHAI Project Office');
  const [purpose, setPurpose] = useState('Final statutory compensation sanction and possession handover');
  const [remarks, setRemarks] = useState('');
  const [dueDate, setDueDate] = useState('2026-10-15');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!purpose.trim()) {
      alert('Please state the purpose for forwarding.');
      return;
    }
    setLoading(true);
    await forwardFile(file.fileId, {
      nextOfficer,
      nextDepartment,
      purpose,
      remarks,
      dueDate,
    });
    setLoading(false);
    onClose();
    if (onSuccess) onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-blue-50 px-6 py-4 border-b border-blue-100 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
              <ArrowRight className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Forward File to Downstream Officer</h3>
              <p className="text-[11px] text-blue-700 font-medium">
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
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              Recipient Officer <span className="text-blue-600">*</span>
            </label>
            <select
              value={nextOfficer}
              onChange={(e) => {
                setNextOfficer(e.target.value);
                if (e.target.value.includes('Project')) setNextDepartment('NHAI Project Office');
                else if (e.target.value.includes('Finance')) setNextDepartment('District Finance & Treasury');
                else if (e.target.value.includes('Legal')) setNextDepartment('Revenue Legal Cell');
                else if (e.target.value.includes('District')) setNextDepartment('District Revenue Office');
              }}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              required
            >
              {allUsers.map((u) => (
                <option key={u.id} value={`${u.name} (${u.role})`}>
                  {u.name} — {u.role} ({u.department})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">Department</label>
            <input
              type="text"
              value={nextDepartment}
              onChange={(e) => setNextDepartment(e.target.value)}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              Purpose / Statutory Action Requested <span className="text-blue-600">*</span>
            </label>
            <input
              type="text"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="e.g., Final compensation sanction and possession handover"
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">Target Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">File Priority</label>
              <input
                type="text"
                readOnly
                value={file.priority}
                className="w-full text-xs p-2.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-600 font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">Forwarding Remarks</label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Notes on verified documents, clearances, and next steps..."
              rows={2}
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
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
              className="px-5 py-2 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 flex items-center space-x-1.5"
            >
              {loading ? <span>Forwarding...</span> : <span>Confirm & Forward File</span>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
