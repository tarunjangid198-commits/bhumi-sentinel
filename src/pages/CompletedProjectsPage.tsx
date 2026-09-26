import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { COMPLETED_PROJECTS } from '../data/completedProjectsData';
import { CompletedProject } from '../types';
import {
  CheckCircle2,
  Building,
  UserCheck,
  FileCheck2,
  ShieldCheck,
  Coins,
  MapPin,
  Calendar,
  Search,
  Filter,
  ArrowRight,
  ArrowLeft,
  Download,
  FolderGit2,
  FileText,
  BadgeCheck,
  Award,
  ExternalLink,
  ChevronRight,
  X,
  FileSpreadsheet,
} from 'lucide-react';

export const CompletedProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAgencyFilter, setSelectedAgencyFilter] = useState('ALL');
  const [selectedDistrictFilter, setSelectedDistrictFilter] = useState('ALL');
  const [selectedProjectForModal, setSelectedProjectForModal] = useState<CompletedProject | null>(null);

  // Extract distinct agencies and districts
  const agencies = useMemo(() => {
    return Array.from(new Set(COMPLETED_PROJECTS.map((p) => p.executingAgency)));
  }, []);

  const allDistricts = useMemo(() => {
    const dSet = new Set<string>();
    COMPLETED_PROJECTS.forEach((p) => p.districts.forEach((d) => dSet.add(d)));
    return Array.from(dSet);
  }, []);

  // Filtered completed projects
  const filteredProjects = useMemo(() => {
    return COMPLETED_PROJECTS.filter((p) => {
      if (selectedAgencyFilter !== 'ALL' && p.executingAgency !== selectedAgencyFilter) {
        return false;
      }
      if (selectedDistrictFilter !== 'ALL' && !p.districts.includes(selectedDistrictFilter)) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesCode = p.code.toLowerCase().includes(q);
        const matchesOfficer = p.custodianOfficer.toLowerCase().includes(q);
        const matchesDept = p.custodianDepartment.toLowerCase().includes(q);
        const matchesAgency = p.executingAgency.toLowerCase().includes(q);
        const matchesDistrict = p.districts.some((d) => d.toLowerCase().includes(q));
        return matchesName || matchesCode || matchesOfficer || matchesDept || matchesAgency || matchesDistrict;
      }
      return true;
    });
  }, [searchQuery, selectedAgencyFilter, selectedDistrictFilter]);

  // Aggregate Stats
  const totalCompletedProjects = COMPLETED_PROJECTS.length;
  const totalAreaHa = COMPLETED_PROJECTS.reduce((sum, p) => sum + p.totalAreaHa, 0);
  const totalBudgetDisbursed = COMPLETED_PROJECTS.reduce((sum, p) => sum + p.disbursedCr, 0);
  const totalParcelsAcquired = COMPLETED_PROJECTS.reduce((sum, p) => sum + p.acquiredParcels, 0);
  const totalBeneficiaries = COMPLETED_PROJECTS.reduce((sum, p) => sum + p.beneficiariesSettled, 0);

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* 1. Quick Navigation Breadcrumb & Back Bar */}
      <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-2xs">
        <div className="flex items-center space-x-2 text-xs">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-lg font-bold border border-slate-200 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Command Center</span>
          </button>
          <span className="text-slate-300">/</span>
          <button
            onClick={() => navigate('/projects')}
            className="text-slate-500 hover:text-slate-800 transition-colors hidden sm:inline"
          >
            Active Projects
          </button>
          <span className="text-slate-300 hidden sm:inline">/</span>
          <span className="font-bold text-slate-800">Completed Projects Archive</span>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            to="/projects"
            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-semibold px-2 py-1 rounded hover:bg-blue-50 transition-colors"
          >
            <FolderGit2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">View Active Portfolios →</span>
          </Link>
        </div>
      </div>

      {/* 2. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Completed Infrastructure Projects Archive
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Archival repository of completed statutory land acquisitions: 100% parcels acquired, full compensation disbursed, and custody handed over to executing agencies.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const csvContent =
                'data:text/csv;charset=utf-8,' +
                ['Project Code,Project Name,Custodian Officer,Department,Executing Agency,Districts,Area (Ha),Parcels,Disbursed (Cr),Handover Deed,Completion Date']
                  .concat(
                    COMPLETED_PROJECTS.map(
                      (p) =>
                        `"${p.code}","${p.name}","${p.custodianOfficer}","${p.custodianDepartment}","${p.executingAgency}","${p.districts.join(
                          ';'
                        )}",${p.totalAreaHa},${p.acquiredParcels},${p.disbursedCr},"${p.handoverDeedNumber}","${p.completionDate}"`
                    )
                  )
                  .join('\n');
              const encodedUri = encodeURI(csvContent);
              const link = document.createElement('a');
              link.setAttribute('href', encodedUri);
              link.setAttribute('download', `Completed_Projects_Register_${Date.now()}.csv`);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-200 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span>Export Archive Registry (CSV)</span>
          </button>
        </div>
      </div>

      {/* 3. Aggregate Statistical Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
        {/* Total Completed */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold">Completed Projects</span>
            <FolderGit2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
            {totalCompletedProjects}
          </p>
          <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">
            100% Acquired & Closed
          </span>
        </div>

        {/* Total Land Handed Over */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold">Land Handed Over</span>
            <MapPin className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-blue-700 font-mono">
            {totalAreaHa.toFixed(1)} <span className="text-sm font-bold text-slate-500">Ha</span>
          </p>
          <span className="text-[10px] text-slate-500">
            Across {totalParcelsAcquired} parcels
          </span>
        </div>

        {/* Total Compensation Disbursed */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold">Compensation Paid</span>
            <Coins className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-700 font-mono">
            ₹{totalBudgetDisbursed.toLocaleString()} <span className="text-sm font-bold text-slate-500">Cr</span>
          </p>
          <span className="text-[10px] text-slate-500">
            100% Disbursed with solatium
          </span>
        </div>

        {/* Beneficiaries Settled */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold">Beneficiaries Settled</span>
            <UserCheck className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-purple-700 font-mono">
            {totalBeneficiaries.toLocaleString()}
          </p>
          <span className="text-[10px] text-slate-500">
            Direct treasury transfers
          </span>
        </div>

        {/* C&AG Audit Clearance */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-1 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold">Audit Clearance</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-600 font-mono">
            100%
          </p>
          <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">
            C&AG & Vigilance Cleared
          </span>
        </div>
      </div>

      {/* 4. Filter and Search Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by project name, custodian officer, code, agency..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-500 text-slate-800"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Agency Filter */}
          <select
            value={selectedAgencyFilter}
            onChange={(e) => setSelectedAgencyFilter(e.target.value)}
            className="py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden text-slate-700 cursor-pointer"
          >
            <option value="ALL">All Executing Agencies</option>
            {agencies.map((agency) => (
              <option key={agency} value={agency}>
                {agency}
              </option>
            ))}
          </select>

          {/* District Filter */}
          <select
            value={selectedDistrictFilter}
            onChange={(e) => setSelectedDistrictFilter(e.target.value)}
            className="py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden text-slate-700 cursor-pointer"
          >
            <option value="ALL">All Districts</option>
            {allDistricts.map((dist) => (
              <option key={dist} value={dist}>
                {dist}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 5. Completed Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div
            key={project.projectId}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:border-emerald-400 flex flex-col justify-between space-y-4 transition-all"
          >
            <div className="space-y-3">
              {/* Badge Bar */}
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded">
                  {project.code}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>100% Acquired</span>
                </span>
              </div>

              {/* Title & Districts */}
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm leading-snug">
                  {project.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Districts: <strong className="text-slate-700">{project.districts.join(', ')}</strong> ({project.state})
                </p>
                <p className="text-[11px] text-blue-700 font-semibold mt-0.5">
                  Agency: {project.executingAgency}
                </p>
              </div>

              {/* Custodian Officer Info Box (KIS KE PAAS HAI) */}
              <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl space-y-1.5">
                <span className="text-[10px] font-mono font-bold text-emerald-800 flex items-center gap-1">
                  <UserCheck className="w-3 h-3" />
                  <span>CURRENT CUSTODIAN OFFICER (KIS KE PAAS HAI):</span>
                </span>
                <p className="text-xs font-extrabold text-slate-900 leading-tight">
                  {project.custodianOfficer}
                </p>
                <p className="text-[11px] text-slate-600 leading-tight">
                  {project.custodianDepartment}
                </p>
                <div className="pt-1 text-[10px] text-slate-500 flex justify-between border-t border-emerald-100/60">
                  <span>Deed: <strong className="font-mono text-slate-700">{project.handoverDeedNumber}</strong></span>
                  <span>Handed: <strong className="text-emerald-800">{project.possessionHandoverDate}</strong></span>
                </div>
              </div>

              {/* Metrics Highlights */}
              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div className="p-2 bg-slate-50 border border-slate-100 rounded-lg">
                  <span className="text-[10px] text-slate-400 block font-mono">TOTAL AREA</span>
                  <strong className="text-slate-800 font-mono text-sm">{project.totalAreaHa} Ha</strong>
                  <span className="text-[10px] text-slate-500 block">({project.acquiredParcels} Parcels)</span>
                </div>
                <div className="p-2 bg-slate-50 border border-slate-100 rounded-lg">
                  <span className="text-[10px] text-slate-400 block font-mono">COMPENSATION DISBURSED</span>
                  <strong className="text-emerald-700 font-mono text-sm">₹{project.disbursedCr} Cr</strong>
                  <span className="text-[10px] text-slate-500 block">({project.beneficiariesSettled} Owners)</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => setSelectedProjectForModal(project)}
                className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <FileCheck2 className="w-3.5 h-3.5" />
                <span>Inspect Handover Dossier</span>
              </button>

              <button
                onClick={() => navigate('/cases')}
                className="py-2 px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold border border-slate-200 transition-colors cursor-pointer"
                title="View All Land Cases"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 6. Handover Dossier Modal */}
      {selectedProjectForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 text-slate-800 relative">
            <button
              onClick={() => setSelectedProjectForModal(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-800 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                  {selectedProjectForModal.code}
                </span>
                <h2 className="text-lg font-black text-slate-900 leading-snug">
                  {selectedProjectForModal.name}
                </h2>
                <p className="text-xs text-slate-500">
                  Executing Agency: {selectedProjectForModal.executingAgency}
                </p>
              </div>
            </div>

            {/* Custodian & Holding Officer Card (KIS KE PAAS HAI) */}
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-emerald-700" />
                  <span>Current Custody & Asset Officer (Kis ke paas hai)</span>
                </span>
                <span className="font-mono text-[10px] bg-emerald-200/60 text-emerald-900 px-2 py-0.5 rounded font-bold">
                  ACTIVE CUSTODIAN
                </span>
              </div>
              <p className="text-sm font-extrabold text-slate-900">
                {selectedProjectForModal.custodianOfficer}
              </p>
              <p className="text-xs text-slate-700">
                {selectedProjectForModal.custodianDepartment}
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-emerald-200/80">
                <div>
                  <span className="text-[10px] text-slate-500 block font-mono">SUBMITTING AUTHORITY:</span>
                  <span className="font-bold text-slate-800">{selectedProjectForModal.submittingAuthority}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block font-mono">HANDOVER DEED NUMBER:</span>
                  <span className="font-mono font-bold text-emerald-800">{selectedProjectForModal.handoverDeedNumber}</span>
                </div>
              </div>
            </div>

            {/* Audit & Legal Clearance Details */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-0.5">
                <span className="text-[10px] text-slate-400 block font-mono">C&AG AUDIT STATUS</span>
                <span className="font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> CLEARED & AUDITED
                </span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-0.5">
                <span className="text-[10px] text-slate-400 block font-mono">VIGILANCE CLEARANCE</span>
                <span className="font-mono font-bold text-slate-800">
                  {selectedProjectForModal.vigilanceNOC}
                </span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-0.5">
                <span className="text-[10px] text-slate-400 block font-mono">POSSESSION DATE</span>
                <span className="font-mono font-bold text-emerald-700">
                  {selectedProjectForModal.possessionHandoverDate}
                </span>
              </div>
            </div>

            {/* Disbursal & Beneficiaries */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block font-mono">COMPENSATION DISBURSED</span>
                <span className="text-xl font-black text-emerald-700 font-mono">
                  ₹{selectedProjectForModal.disbursedCr} Cr
                </span>
                <span className="text-[11px] text-slate-500 block">
                  100% solatium paid under RFCTLARR 2013
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block font-mono">BENEFICIARIES SETTLED</span>
                <span className="text-xl font-black text-slate-900 font-mono">
                  {selectedProjectForModal.beneficiariesSettled}
                </span>
                <span className="text-[11px] text-emerald-600 font-bold block">
                  Zero Outstanding Disputes
                </span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedProjectForModal(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setSelectedProjectForModal(null);
                  navigate('/cases');
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1.5 cursor-pointer"
              >
                <span>Explore Land Registry</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
