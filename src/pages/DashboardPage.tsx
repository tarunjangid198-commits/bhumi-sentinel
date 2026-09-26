import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderGit2,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldAlert,
  Coins,
  ArrowRight,
  TrendingUp,
  Building2,
  FileText,
  AlertOctagon,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { parcels, projects, files } = useApp();

  // Dynamic calculations from dataset with full null-safety
  const safeParcels = Array.isArray(parcels) ? parcels : [];
  const safeProjects = Array.isArray(projects) ? projects : [];
  const totalProjects = safeProjects.length;
  const totalParcels = safeParcels.length;

  const onTrackCount = safeParcels.filter(
    (p) => Boolean(p && (p.status === 'IN_PROGRESS' || p.status === 'ACQUIRED') && p.riskLevel === 'LOW' && (p.delayDays ?? 0) === 0)
  ).length;
  const atRiskCount = safeParcels.filter((p) => Boolean(p && (p.riskLevel === 'HIGH' || p.riskLevel === 'MEDIUM'))).length;
  const delayedCount = safeParcels.filter((p) => Boolean(p && ((p.delayDays && p.delayDays > 0) || p.status === 'DELAYED'))).length;
  const disputedCount = safeParcels.filter((p) => Boolean(p && p.status === 'DISPUTED')).length;
  const compensationPendingCount = safeParcels.filter(
    (p) => Boolean(p && (p.currentStage === 'Compensation Approval' || p.currentStage === 'Payment'))
  ).length;
  const handoverPendingCount = safeParcels.filter(
    (p) => Boolean(p && (p.currentStage === 'Acquisition' || p.currentStage === 'Handover'))
  ).length;

  // Chart data: Stage-wise pending cases
  const stageCounts: Record<string, number> = {};
  safeParcels.forEach((p) => {
    if (p && p.status !== 'ACQUIRED') {
      const stageKey = p.currentStage || 'Pending Review';
      stageCounts[stageKey] = (stageCounts[stageKey] || 0) + 1;
    }
  });

  const stageChartData = Object.keys(stageCounts).map((stage) => ({
    name: stage && stage.length > 14 ? stage.slice(0, 12) + '..' : (stage || 'Stage'),
    fullName: stage,
    count: stageCounts[stage],
  }));

  // Chart data: District bottleneck chart
  const districtCounts: Record<string, { delayed: number; total: number }> = {};
  safeParcels.forEach((p) => {
    if (p) {
      const distKey = p.district || 'General';
      if (!districtCounts[distKey]) {
        districtCounts[distKey] = { delayed: 0, total: 0 };
      }
      districtCounts[distKey].total += 1;
      if ((p.delayDays && p.delayDays > 0) || p.riskLevel === 'HIGH') {
        districtCounts[distKey].delayed += 1;
      }
    }
  });

  const districtChartData = Object.keys(districtCounts).map((dist) => ({
    district: dist,
    delayed: districtCounts[dist].delayed,
    onTrack: Math.max(0, districtCounts[dist].total - districtCounts[dist].delayed),
  }));

  // Status pie chart
  const pieData = [
    { name: 'On Track', value: onTrackCount, color: '#16a34a' },
    { name: 'At Risk', value: atRiskCount, color: '#ca8a04' },
    { name: 'Delayed', value: delayedCount, color: '#ea580c' },
    { name: 'Disputed', value: disputedCount, color: '#dc2626' },
  ];

  // Top Bottlenecks with clickable navigation
  const topBottlenecks = [
    {
      title: 'Compensation Approval',
      stage: 'Compensation Approval',
      dept: 'District Finance & Treasury',
      count: parcels.filter((p) => p.currentStage === 'Compensation Approval').length,
      delayed: parcels.filter((p) => p.currentStage === 'Compensation Approval' && p.delayDays > 0).length,
      severity: 'CRITICAL',
      sampleCase: 'P-1024',
    },
    {
      title: 'Objection Review & Disputes',
      stage: 'Objection Review',
      dept: 'Revenue Legal Cell',
      count: parcels.filter((p) => p.currentStage === 'Objection Review').length,
      delayed: parcels.filter((p) => p.currentStage === 'Objection Review' && p.delayDays > 0).length,
      severity: 'HIGH',
      sampleCase: 'P-1077',
    },
    {
      title: 'Cadastral Survey & Demarcation',
      stage: 'Survey',
      dept: 'Directorate of Land Records',
      count: parcels.filter((p) => p.currentStage === 'Survey').length,
      delayed: parcels.filter((p) => p.currentStage === 'Survey' && p.delayDays > 0).length,
      severity: 'MEDIUM',
      sampleCase: 'P-1015',
    },
    {
      title: 'Document Verification',
      stage: 'Document Verification',
      dept: 'District Revenue Office',
      count: parcels.filter((p) => p.currentStage === 'Document Verification').length,
      delayed: parcels.filter((p) => p.currentStage === 'Document Verification' && p.delayDays > 0).length,
      severity: 'MEDIUM',
      sampleCase: 'P-1042',
    },
  ];

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Page Title & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center space-x-2.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              NATIONAL ACQUISITION CONTROL CENTER
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            AI-Augmented Land Acquisition Lifecycle Monitoring & Risk Prediction
          </p>
        </div>

        {/* Action button */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigate('/map')}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-all"
          >
            <MapPin className="w-4 h-4" />
            <span>Open Real GIS Map</span>
          </button>
          <button
            onClick={() => navigate('/cases/P-1024')}
            className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-all"
          >
            <span>Focus Demo Case (P-1024)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Top 8 KPI Statistic Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {/* Total Projects */}
        <div
          onClick={() => navigate('/projects')}
          className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs hover:border-blue-400 cursor-pointer transition-all"
        >
          <span className="text-[10px] uppercase font-bold text-slate-400 block truncate">Total Projects</span>
          <p className="text-xl font-extrabold text-slate-900 font-mono mt-1">{totalProjects}</p>
          <span className="text-[10px] text-blue-600 font-semibold flex items-center gap-0.5 mt-1">
            Active <ArrowRight className="w-2.5 h-2.5" />
          </span>
        </div>

        {/* Total Land Parcels */}
        <div
          onClick={() => navigate('/cases')}
          className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs hover:border-blue-400 cursor-pointer transition-all"
        >
          <span className="text-[10px] uppercase font-bold text-slate-400 block truncate">Total Parcels</span>
          <p className="text-xl font-extrabold text-slate-900 font-mono mt-1">{totalParcels}</p>
          <span className="text-[10px] text-slate-500 font-medium mt-1 block">Live Tracking</span>
        </div>

        {/* On Track */}
        <div
          onClick={() => navigate('/cases?status=IN_PROGRESS')}
          className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs hover:border-emerald-400 cursor-pointer transition-all"
        >
          <span className="text-[10px] uppercase font-bold text-emerald-600 block truncate">On Track</span>
          <p className="text-xl font-extrabold text-emerald-700 font-mono mt-1">{onTrackCount}</p>
          <span className="text-[10px] text-emerald-600 font-medium mt-1 block">Within SLA</span>
        </div>

        {/* At Risk */}
        <div
          onClick={() => navigate('/cases?risk=HIGH')}
          className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs hover:border-amber-400 cursor-pointer transition-all"
        >
          <span className="text-[10px] uppercase font-bold text-amber-600 block truncate">At Risk</span>
          <p className="text-xl font-extrabold text-amber-700 font-mono mt-1">{atRiskCount}</p>
          <span className="text-[10px] text-amber-600 font-medium mt-1 block">Flagged Risk</span>
        </div>

        {/* Delayed */}
        <div
          onClick={() => navigate('/cases?status=DELAYED')}
          className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs hover:border-orange-400 cursor-pointer transition-all"
        >
          <span className="text-[10px] uppercase font-bold text-orange-600 block truncate">Delayed</span>
          <p className="text-xl font-extrabold text-orange-700 font-mono mt-1">{delayedCount}</p>
          <span className="text-[10px] text-orange-600 font-medium mt-1 block">Exceeded SLA</span>
        </div>

        {/* Disputed */}
        <div
          onClick={() => navigate('/cases?status=DISPUTED')}
          className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs hover:border-rose-400 cursor-pointer transition-all"
        >
          <span className="text-[10px] uppercase font-bold text-rose-600 block truncate">Disputed</span>
          <p className="text-xl font-extrabold text-rose-700 font-mono mt-1">{disputedCount}</p>
          <span className="text-[10px] text-rose-600 font-medium mt-1 block">Legal/Stay</span>
        </div>

        {/* Compensation Pending */}
        <div
          onClick={() => navigate('/cases?stage=Compensation+Approval')}
          className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs hover:border-blue-400 cursor-pointer transition-all"
        >
          <span className="text-[10px] uppercase font-bold text-slate-500 block truncate">Compensation</span>
          <p className="text-xl font-extrabold text-slate-900 font-mono mt-1">{compensationPendingCount}</p>
          <span className="text-[10px] text-slate-400 font-medium mt-1 block">Pending Award</span>
        </div>

        {/* Handover Pending */}
        <div
          onClick={() => navigate('/cases?stage=Handover')}
          className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs hover:border-blue-400 cursor-pointer transition-all"
        >
          <span className="text-[10px] uppercase font-bold text-slate-500 block truncate">Handover</span>
          <p className="text-xl font-extrabold text-slate-900 font-mono mt-1">{handoverPendingCount}</p>
          <span className="text-[10px] text-slate-400 font-medium mt-1 block">Possession Ready</span>
        </div>
      </div>

      {/* Star Case Spotlight Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-5 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-blue-700/40">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded bg-rose-500/80 text-white text-[10px] font-bold uppercase tracking-wider font-mono">
              Live Hackathon Demo Target
            </span>
            <span className="text-xs text-blue-200 font-mono">PARCEL P-1024 · Khasra 124/3</span>
          </div>
          <h2 className="text-base sm:text-lg font-bold">
            Document Area Mismatch Flagged on Highway Expansion Project
          </h2>
          <p className="text-xs text-blue-200 max-w-2xl leading-relaxed">
            Physical Deed specifies <strong>2.40 ha</strong> vs Database Record <strong>2.10 ha</strong> (+0.30 ha
            discrepancy). Current file is in Finance Officer's Incoming queue awaiting formal acceptance,
            document verification, or return.
          </p>
        </div>
        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={() => navigate('/portal')}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg text-xs transition-colors"
          >
            Open Officer Intake
          </button>
          <button
            onClick={() => navigate('/cases/P-1024')}
            className="px-4 py-2 bg-white text-slate-900 hover:bg-blue-50 font-bold rounded-lg text-xs transition-colors"
          >
            Inspect Case P-1024
          </button>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stage-wise Pending Cases Bar Chart */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Stage-wise Active Parcels Distribution</h3>
              <p className="text-xs text-slate-500">Parcels currently active across the 11 statutory stages</p>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">11 Lifecycle Stages</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stageChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-25} textAnchor="end" />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-slate-900 text-white p-2.5 rounded-lg text-xs shadow-md">
                          <p className="font-bold">{payload[0].payload.fullName}</p>
                          <p className="text-blue-300 font-mono">Active Cases: {payload[0].value}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Breakdown Pie Chart */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Risk & SLA Health</h3>
              <p className="text-xs text-slate-500">Real-time status breakdown</p>
            </div>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-center text-xs">
            <div className="bg-slate-50 p-2 rounded-lg">
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Average Delay</span>
              <p className="font-bold text-slate-900 font-mono">4.2 Days</p>
            </div>
            <div className="bg-slate-50 p-2 rounded-lg">
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Litigation Rate</span>
              <p className="font-bold text-rose-600 font-mono">3.8%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Bottlenecks Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center space-x-2">
              <AlertOctagon className="w-5 h-5 text-rose-600" />
              <h3 className="text-sm font-bold text-slate-900">Top Institutional Bottlenecks</h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Stages with highest inter-departmental holding duration. Click any row to view affected parcels.
            </p>
          </div>
          <button
            onClick={() => navigate('/bottlenecks')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <span>Full Dependency Analytics</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {topBottlenecks.map((b, idx) => (
            <div
              key={idx}
              onClick={() => navigate(`/cases?stage=${encodeURIComponent(b.stage)}`)}
              className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-blue-50/50 hover:border-blue-300 cursor-pointer transition-all group"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className={`text-[9px] font-extrabold px-2 py-0.5 rounded font-mono ${
                    b.severity === 'CRITICAL'
                      ? 'bg-red-100 text-red-700'
                      : b.severity === 'HIGH'
                      ? 'bg-orange-100 text-orange-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {b.severity} FRICTION
                </span>
                <span className="text-[10px] text-slate-400 font-mono">{b.count} cases</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                {b.title}
              </h4>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">{b.dept}</p>

              <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                <span className="text-orange-600 font-semibold">{b.delayed} delayed cases</span>
                <span className="text-blue-600 font-bold group-hover:underline flex items-center gap-0.5">
                  Filter Cases <ArrowRight className="w-2.5 h-2.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
