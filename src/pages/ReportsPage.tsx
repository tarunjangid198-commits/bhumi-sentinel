import React from 'react';
import { useApp } from '../context/AppContext';
import { FileText, Download, CheckCircle2, FileSpreadsheet, ShieldCheck } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const { parcels, projects, files } = useApp();

  const handleExportParcelsCSV = () => {
    const headers = [
      'ParcelID',
      'Khasra',
      'District',
      'Village',
      'Project',
      'AreaHa',
      'Stage',
      'ProgressPct',
      'Status',
      'RiskLevel',
      'DelayDays',
      'CurrentOfficer',
    ];
    const rows = parcels.map((p) => [
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
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `bhumi_sentinel_statutory_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportFilesJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(files, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `digital_file_movement_ledger_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <FileSpreadsheet className="w-5 h-5 text-blue-600" />
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Statutory Reports & Regulatory Export Center
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Download certified audit exports for NITI Aayog, Ministry of Road Transport, and State Revenue Boards.
          </p>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
              CSV Export
            </span>
            <h3 className="font-bold text-base text-slate-900">National Land Acquisition Master Sheet</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Complete tabular census of all {parcels.length} surveyed land parcels with current stage progress,
              delays, and officer custodians.
            </p>
          </div>
          <button
            onClick={handleExportParcelsCSV}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center justify-center space-x-2 shadow-sm transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download Master CSV</span>
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
              JSON Ledger
            </span>
            <h3 className="font-bold text-base text-slate-900">Digital File Movement Chain Ledger</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Machine-readable audit trail of every inter-departmental handoff, return remark, and acceptance
              timestamp.
            </p>
          </div>
          <button
            onClick={handleExportFilesJSON}
            className="w-full py-2.5 bg-slate-900 hover:bg-black text-white rounded-lg text-xs font-bold flex items-center justify-center space-x-2 shadow-sm transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export Movement Ledger (JSON)</span>
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
              Audit Ready
            </span>
            <h3 className="font-bold text-base text-slate-900">Dispute & Litigation Risk Log</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Digest of pending High Court stay petitions, Section 15 objections, and cadastral deed mismatches.
            </p>
          </div>
          <button
            onClick={handleExportParcelsCSV}
            className="w-full py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 rounded-lg text-xs font-bold flex items-center justify-center space-x-2 transition-colors"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export Litigation Log (CSV)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
