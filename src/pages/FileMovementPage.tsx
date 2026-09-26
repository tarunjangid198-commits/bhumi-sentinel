import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ArrowRightLeft, Search, Filter, Eye, Clock, CheckCircle2, RotateCcw } from 'lucide-react';

export const FileMovementPage: React.FC = () => {
  const navigate = useNavigate();
  const { files, parcels } = useApp();
  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  const safeFiles = Array.isArray(files) ? files : [];

  const filteredFiles = safeFiles.filter((f) => {
    if (!f) return false;
    if (filterDept !== 'ALL' && f.currentDepartment !== filterDept) return false;
    if (filterStatus !== 'ALL' && f.status !== filterStatus) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchFileId = typeof f.fileId === 'string' && f.fileId.toLowerCase().includes(q);
      const matchParcelId = typeof f.parcelId === 'string' && f.parcelId.toLowerCase().includes(q);
      const matchOfficer = typeof f.currentOfficer === 'string' && f.currentOfficer.toLowerCase().includes(q);
      return matchFileId || matchParcelId || matchOfficer;
    }
    return true;
  });

  const depts = Array.from(
    new Set(
      safeFiles
        .map((f) => f?.currentDepartment)
        .filter((d): d is string => typeof d === 'string' && Boolean(d.trim()))
    )
  ).sort();

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <ArrowRightLeft className="w-5 h-5 text-blue-600" />
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Inter-Departmental Digital File Movement
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit-grade tracking of files traversing Survey, Revenue, Legal, Finance, and Project Authority.
          </p>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap gap-3 text-xs">
        <div className="relative min-w-[200px] flex-1">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by File ID, Parcel ID, Officer..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-2 text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <select
          value={filterDept}
          onChange={(e) => setFilterDept(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700"
        >
          <option value="ALL">All Departments</option>
          {depts.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700"
        >
          <option value="ALL">All File Statuses</option>
          <option value="SENT">Incoming / Sent</option>
          <option value="UNDER_REVIEW">Active (Under Review)</option>
          <option value="RETURNED">Returned / Action Required</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </div>

      {/* Files Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4">File ID & Parcel</th>
                <th className="py-3 px-4">Stage</th>
                <th className="py-3 px-4">Holding Officer</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Current Status</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Movement Handoffs</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredFiles.map((file) => (
                <tr key={file.fileId} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-mono font-bold text-slate-900 block">{file.fileId}</span>
                    <span className="font-mono text-[11px] text-blue-700 font-semibold">{file.parcelId}</span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-800">{file.currentStage}</td>
                  <td className="py-3 px-4 font-medium text-slate-900">{file.currentOfficer}</td>
                  <td className="py-3 px-4 text-slate-500">{file.currentDepartment}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        file.status === 'UNDER_REVIEW'
                          ? 'bg-blue-100 text-blue-800'
                          : file.status === 'SENT'
                          ? 'bg-amber-100 text-amber-800'
                          : file.status === 'RETURNED'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {file.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-600">
                    {new Date(file.dueDate).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-500">
                    {file.movementHistory.length} Handoffs
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => navigate(`/cases/${file.parcelId}?tab=movement`)}
                      className="px-3 py-1 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 font-bold rounded-lg text-xs transition-colors inline-flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect Trail</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
