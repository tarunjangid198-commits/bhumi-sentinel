import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  AlertTriangle,
  ArrowRight,
  GitBranch,
  ShieldAlert,
  Clock,
  FileWarning,
  Building,
  Layers,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export const BottlenecksPage: React.FC = () => {
  const navigate = useNavigate();
  const { parcels, files } = useApp();

  // Simulating dependency blocking stage
  const [blockedStage, setBlockedStage] = useState<string>('Document Verification');

  const dependencyStages = [
    { name: 'Ownership Verification', dept: 'Revenue Office', step: 3 },
    { name: 'Document Verification', dept: 'Revenue Office', step: 4 },
    { name: 'Valuation', dept: 'Finance / DLC', step: 7 },
    { name: 'Compensation Approval', dept: 'District Finance', step: 8 },
    { name: 'Payment', dept: 'Treasury DBT', step: 9 },
    { name: 'Handover', dept: 'Project Authority (NHAI)', step: 11 },
  ];

  const blockedIndex = dependencyStages.findIndex((s) => s.name === blockedStage);

  // Identify cases approaching deadlines (<= 3 days)
  const approachingDeadlineCases = files.filter((f) => {
    const diffDays = (new Date(f.dueDate).getTime() - Date.now()) / (1000 * 3600 * 24);
    return diffDays >= 0 && diffDays <= 5 && f.status !== 'COMPLETED';
  });

  // Cases with document mismatches
  const mismatchCases = parcels.filter(
    (p) => p.riskReasons.some((r) => r.toLowerCase().includes('mismatch')) || p.parcelId === 'P-1024'
  );

  // Cases with repeated returns
  const returnedCases = files.filter((f) => f.status === 'RETURNED' || f.movementHistory.length > 2);

  // Department workload distribution
  const deptWorkload: Record<string, number> = {};
  parcels.forEach((p) => {
    if (p.status !== 'ACQUIRED') {
      deptWorkload[p.currentDepartment] = (deptWorkload[p.currentDepartment] || 0) + 1;
    }
  });

  const deptChartData = Object.keys(deptWorkload).map((dept) => ({
    name: dept.replace('District ', '').replace('Directorate of ', ''),
    fullName: dept,
    cases: deptWorkload[dept],
  }));

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Institutional Bottlenecks & Critical Path Diagnostics
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Identify cascading schedule risks, inter-departmental stalls, and documentary bottlenecks.
          </p>
        </div>
      </div>

      {/* CORE FEATURE: Statutory Workflow Dependency Graph */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center space-x-2">
              <GitBranch className="w-5 h-5 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Statutory Linear Dependency Graph & Ripple Effect
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              Downstream stages are legally prohibited from executing until prior stage sign-off is certified.
            </p>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-slate-500 font-semibold">Simulate Stall At:</span>
            <select
              value={blockedStage}
              onChange={(e) => setBlockedStage(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-800"
            >
              {dependencyStages.slice(0, -1).map((s) => (
                <option key={s.name} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Visual Workflow Chain */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 pt-2">
          {dependencyStages.map((stage, idx) => {
            const isBlocked = idx === blockedIndex;
            const isDownstreamImpacted = idx > blockedIndex;
            const isClear = idx < blockedIndex;

            return (
              <div
                key={stage.name}
                className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all ${
                  isBlocked
                    ? 'bg-rose-50 border-rose-400 text-rose-900 ring-2 ring-rose-500/20 shadow-md'
                    : isDownstreamImpacted
                    ? 'bg-orange-50/60 border-orange-300 text-orange-900 opacity-90'
                    : 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-[10px] font-bold">Step {stage.step}</span>
                    {isBlocked ? (
                      <XCircle className="w-4 h-4 text-rose-600" />
                    ) : isDownstreamImpacted ? (
                      <AlertTriangle className="w-3.5 h-3.5 text-orange-600" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    )}
                  </div>
                  <h4 className="font-bold text-xs leading-snug">{stage.name}</h4>
                  <p className="text-[10px] opacity-80 mt-1">{stage.dept}</p>
                </div>

                <div className="mt-3 pt-2 border-t border-black/10 text-[10px] font-bold uppercase tracking-wider">
                  {isBlocked && '❌ Stalled / Bottleneck'}
                  {isDownstreamImpacted && '⚠️ Cascade Delayed'}
                  {isClear && '✓ Cleared'}
                </div>
              </div>
            );
          })}
        </div>

        {/* Impact summary box */}
        <div className="p-3.5 bg-orange-50 border border-orange-200 rounded-xl text-xs text-orange-950 flex items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-orange-600 shrink-0" />
            <p>
              <strong>Potential Downstream Impact Detected:</strong> A stall at{' '}
              <strong className="text-rose-700">{blockedStage}</strong> directly halts{' '}
              <strong>{dependencyStages.length - blockedIndex - 1} downstream stages</strong>, freezing
              possession handover and incurring an estimated{' '}
              <strong className="text-orange-900 font-mono">₹4.8 Lakhs / week</strong> in idling construction
              penalties.
            </p>
          </div>
          <button
            onClick={() => navigate(`/cases?stage=${encodeURIComponent(blockedStage)}`)}
            className="px-3 py-1.5 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 shrink-0 transition-colors"
          >
            Filter Stalled Parcels
          </button>
        </div>
      </div>

      {/* Grid of Bottleneck Sub-Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Workload Bar Chart */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
            Departmental Active File Loads
          </h3>
          <p className="text-xs text-slate-500 mb-4">Current backlog across administrative departments</p>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptChartData} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 10 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 9 }} width={80} />
                <Tooltip />
                <Bar dataKey="cases" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Document Mismatches Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileWarning className="w-4 h-4 text-rose-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Cadastral Mismatch Cases ({mismatchCases.length})
              </h3>
            </div>
            <span className="text-[10px] text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded">
              Critical Risk
            </span>
          </div>
          <p className="text-xs text-slate-500">Parcels where physical deeds contradict land registry databases.</p>

          <div className="space-y-2 overflow-y-auto max-h-56">
            {mismatchCases.map((p) => (
              <div
                key={p.parcelId}
                onClick={() => navigate(`/cases/${p.parcelId}?tab=documents`)}
                className="p-2.5 rounded-lg border border-slate-200 hover:border-blue-400 bg-slate-50/70 hover:bg-blue-50/40 cursor-pointer transition-all text-xs"
              >
                <div className="flex justify-between items-center font-bold">
                  <span className="text-slate-900 font-mono">{p.parcelId}</span>
                  <span className="text-rose-600 text-[10px]">Area Variance</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Khasra: {p.khasraNumber} · {p.village} ({p.district})
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Approaching Deadlines Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-amber-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Approaching Deadlines ({approachingDeadlineCases.length})
              </h3>
            </div>
            <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded">
              Within 5 Days
            </span>
          </div>
          <p className="text-xs text-slate-500">Cases at risk of statutory delay breach within 120 hours.</p>

          <div className="space-y-2 overflow-y-auto max-h-56">
            {approachingDeadlineCases.map((f) => (
              <div
                key={f.fileId}
                onClick={() => navigate(`/cases/${f.parcelId}`)}
                className="p-2.5 rounded-lg border border-slate-200 hover:border-amber-400 bg-slate-50/70 hover:bg-amber-50/40 cursor-pointer transition-all text-xs"
              >
                <div className="flex justify-between items-center font-bold">
                  <span className="text-slate-900 font-mono">{f.fileId}</span>
                  <span className="text-orange-600 font-mono text-[10px]">
                    Due: {new Date(f.dueDate).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                  Holding: {f.currentOfficer} ({f.currentStage})
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
