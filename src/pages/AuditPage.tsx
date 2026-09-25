import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { History, Search, ShieldCheck } from 'lucide-react';

export const AuditPage: React.FC = () => {
  const { auditLogs } = useApp();
  const [search, setSearch] = useState('');

  const filteredLogs = auditLogs.filter((log) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        log.action.toLowerCase().includes(q) ||
        (log.parcelId && log.parcelId.toLowerCase().includes(q)) ||
        log.user.toLowerCase().includes(q) ||
        log.remarks.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <History className="w-5 h-5 text-blue-600" />
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Immutable Governance Audit Log
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Cryptographic ledger tracking all file acceptances, returns, forwarding, and reconciliation decisions.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by action, parcel ID, officer, or remark..."
          className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Log list */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs divide-y divide-slate-100 overflow-hidden">
        {filteredLogs.map((log) => (
          <div key={log.id} className="p-4 hover:bg-slate-50 transition-colors text-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-slate-900 text-sm">{log.action}</span>
                <span className="font-mono text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded">
                  {log.parcelId}
                </span>
                <span className="text-slate-400 text-[11px]">
                  by <strong className="text-slate-700">{log.user}</strong> ({log.role})
                </span>
              </div>
              <p className="text-slate-600 font-sans">{log.remarks}</p>
            </div>
            <span className="font-mono text-slate-400 text-[11px] shrink-0">
              {new Date(log.timestamp).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
