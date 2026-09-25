import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Search,
  Filter,
  Eye,
  FileSpreadsheet,
  AlertTriangle,
  ArrowRight,
  Clock,
  Download,
  CheckCircle2,
} from 'lucide-react';
import { STAGE_NAMES } from '../data/seedData';

export const CasesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { parcels, projects } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState(searchParams.get('project') || 'ALL');
  const [selectedDistrict, setSelectedDistrict] = useState(searchParams.get('district') || 'ALL');
  const [selectedStage, setSelectedStage] = useState(searchParams.get('stage') || 'ALL');
  const [selectedStatus, setSelectedStatus] = useState(searchParams.get('status') || 'ALL');
  const [selectedRisk, setSelectedRisk] = useState(searchParams.get('risk') || 'ALL');

  // Filter logic
  const filteredParcels = useMemo(() => {
    return parcels.filter((p) => {
      if (selectedProject !== 'ALL' && p.projectId !== selectedProject) return false;
      if (selectedDistrict !== 'ALL' && p.district !== selectedDistrict) return false;
      if (selectedStage !== 'ALL' && p.currentStage !== selectedStage) return false;
      if (selectedStatus !== 'ALL' && p.status !== selectedStatus) return false;
      if (selectedRisk !== 'ALL' && p.riskLevel !== selectedRisk) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          p.parcelId.toLowerCase().includes(q) ||
          p.khasraNumber.toLowerCase().includes(q) ||
          p.village.toLowerCase().includes(q) ||
          p.currentOfficer.toLowerCase().includes(q) ||
          p.ownerReference.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [parcels, selectedProject, selectedDistrict, selectedStage, selectedStatus, selectedRisk, searchQuery]);

  const districts = useMemo(() => {
    return Array.from(new Set(parcels.map((p) => p.district))).sort();
  }, [parcels]);

  // CSV Export helper
  const handleExportCSV = () => {
    const headers = [
      'Parcel ID',
      'Khasra',
      'District',
      'Village',
      'Project',
      'Area (Ha)',
      'Stage',
      'Progress %',
      'Status',
      'Risk',
      'Delay (Days)',
      'Current Officer',
    ];
    const rows = filteredParcels.map((p) => [
      p.parcelId,
      p.khasraNumber,
      p.district,
      p.village,
      `"${p.project}"`,
      p.area,
      p.currentStage,
      p.progress,
      p.status,
      p.riskLevel,
      p.delayDays,
      `"${p.currentOfficer}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `bhumi_sentinel_parcels_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <FileSpreadsheet className="w-5 h-5 text-blue-600" />
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Land Acquisition Cases</h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Complete database of {parcels.length} surveyed land parcels with active stage tracking.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigate('/cases/P-1024')}
            className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow-2xs transition-colors"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Open Demo Case P-1024</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center space-x-1.5 shadow-2xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 text-xs">
          {/* Search box */}
          <div className="relative sm:col-span-2">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Parcel ID, Khasra, Owner..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-2 text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white"
            />
          </div>

          {/* Project */}
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-700 focus:outline-hidden"
          >
            <option value="ALL">All Projects ({projects.length})</option>
            {projects.map((p) => (
              <option key={p.projectId} value={p.projectId}>
                {p.code}
              </option>
            ))}
          </select>

          {/* District */}
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-700 focus:outline-hidden"
          >
            <option value="ALL">All Districts</option>
            {districts.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          {/* Stage */}
          <select
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-700 focus:outline-hidden"
          >
            <option value="ALL">All 11 Stages</option>
            {STAGE_NAMES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          {/* Risk */}
          <select
            value={selectedRisk}
            onChange={(e) => setSelectedRisk(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-700 focus:outline-hidden"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="HIGH">High Risk</option>
            <option value="MEDIUM">Medium Risk</option>
            <option value="LOW">Low Risk</option>
          </select>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
          <span>
            Showing <strong className="text-slate-800">{filteredParcels.length}</strong> matching parcels
          </span>
          {(selectedProject !== 'ALL' ||
            selectedDistrict !== 'ALL' ||
            selectedStage !== 'ALL' ||
            selectedStatus !== 'ALL' ||
            selectedRisk !== 'ALL' ||
            searchQuery) && (
            <button
              onClick={() => {
                setSelectedProject('ALL');
                setSelectedDistrict('ALL');
                setSelectedStage('ALL');
                setSelectedStatus('ALL');
                setSelectedRisk('ALL');
                setSearchQuery('');
              }}
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Cases Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4">Parcel ID & Khasra</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Project</th>
                <th className="py-3 px-4">Area (Ha)</th>
                <th className="py-3 px-4">Current Stage & Progress</th>
                <th className="py-3 px-4">Status & Delay</th>
                <th className="py-3 px-4">Risk Level</th>
                <th className="py-3 px-4">Current Custody</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredParcels.length > 0 ? (
                filteredParcels.map((parcel) => (
                  <tr
                    key={parcel.parcelId}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      parcel.parcelId === 'P-1024' ? 'bg-amber-50/40' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-2">
                        <span className="font-extrabold text-slate-900 font-mono text-xs">
                          {parcel.parcelId}
                        </span>
                        {parcel.parcelId === 'P-1024' && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded font-bold bg-amber-400 text-slate-900">
                            Demo Case
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium">Khasra: {parcel.khasraNumber}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-800">{parcel.village}</p>
                      <p className="text-[11px] text-slate-500">{parcel.district}</p>
                    </td>

                    <td className="py-3.5 px-4 max-w-[180px]">
                      <p className="font-medium text-slate-800 truncate" title={parcel.project}>
                        {parcel.project}
                      </p>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {parcel.area.toFixed(2)}
                    </td>

                    <td className="py-3.5 px-4 min-w-[160px]">
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="font-semibold text-slate-900 truncate max-w-[120px]">
                          {parcel.currentStage}
                        </span>
                        <span className="font-mono font-bold text-blue-700">{parcel.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-blue-600 h-full rounded-full"
                          style={{ width: `${parcel.progress}%` }}
                        />
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          parcel.status === 'ACQUIRED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : parcel.status === 'DELAYED'
                            ? 'bg-orange-100 text-orange-800'
                            : parcel.status === 'DISPUTED'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {parcel.status}
                      </span>
                      {parcel.delayDays > 0 && (
                        <p className="text-[10px] text-orange-600 font-semibold mt-0.5">
                          +{parcel.delayDays}d overdue
                        </p>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-1">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            parcel.riskLevel === 'HIGH'
                              ? 'bg-rose-600'
                              : parcel.riskLevel === 'MEDIUM'
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                        />
                        <span
                          className={`font-bold ${
                            parcel.riskLevel === 'HIGH'
                              ? 'text-rose-700'
                              : parcel.riskLevel === 'MEDIUM'
                              ? 'text-amber-700'
                              : 'text-emerald-700'
                          }`}
                        >
                          {parcel.riskLevel}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">({parcel.riskScore})</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 max-w-[160px]">
                      <p className="font-semibold text-slate-900 truncate">{parcel.currentOfficer}</p>
                      <p className="text-[10px] text-slate-500 truncate">{parcel.currentDepartment}</p>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => navigate(`/cases/${parcel.parcelId}`)}
                        className="px-3 py-1.5 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 font-bold rounded-lg text-xs transition-all inline-flex items-center gap-1 shadow-2xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    No land acquisition cases match your selected filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
