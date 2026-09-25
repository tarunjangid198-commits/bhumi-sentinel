import React, { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  FileText,
  Clock,
  ArrowRightLeft,
  CheckCircle2,
  AlertTriangle,
  Coins,
  BrainCircuit,
  History,
  ShieldAlert,
  Calendar,
  Building,
  MapPin,
  Scale,
  Eye,
  Check,
  AlertOctagon,
  RotateCcw,
  Send,
  ExternalLink,
} from 'lucide-react';
import { AcceptFileModal } from '../components/modals/AcceptFileModal';
import { ReturnFileModal } from '../components/modals/ReturnFileModal';
import { ForwardFileModal } from '../components/modals/ForwardFileModal';
import { ResubmitFileModal } from '../components/modals/ResubmitFileModal';
import { DocumentMismatchModal } from '../components/modals/DocumentMismatchModal';
import { CaseDocument } from '../types';

export const CaseDetailPage: React.FC = () => {
  const { parcelId } = useParams<{ parcelId: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';

  const {
    getParcel,
    getFile,
    documents,
    tasks,
    auditLogs,
    currentUser,
    completeSurvey,
  } = useApp();

  const parcel = getParcel(parcelId || 'P-1024');
  const file = parcel ? getFile(parcel.digitalFileId) : undefined;

  // Modals state
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [showForwardModal, setShowForwardModal] = useState(false);
  const [showResubmitModal, setShowResubmitModal] = useState(false);
  const [selectedMismatchDoc, setSelectedMismatchDoc] = useState<CaseDocument | null>(null);

  if (!parcel) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Parcel Not Found</h2>
        <p className="text-xs text-slate-500">The requested land parcel identifier "{parcelId}" does not exist.</p>
        <button
          onClick={() => navigate('/cases')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold"
        >
          Return to All Cases
        </button>
      </div>
    );
  }

  const parcelDocs = documents.filter((d) => d.parcelId === parcel.parcelId);
  const parcelTasks = tasks.filter((t) => t.parcelId === parcel.parcelId);
  const parcelAudit = auditLogs.filter((a) => a.parcelId === parcel.parcelId);

  // Mismatch document if any
  const mismatchDoc = parcelDocs.find(
    (d) => d.mismatches && d.mismatches.length > 0 && d.status !== 'VERIFIED'
  );

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Eye },
    { id: 'timeline', label: 'Acquisition Timeline', icon: Clock },
    {
      id: 'documents',
      label: 'Documents',
      icon: FileText,
      badge: mismatchDoc ? 'Mismatch' : undefined,
    },
    { id: 'tasks', label: 'Tasks', icon: CheckCircle2 },
    { id: 'movement', label: 'File Movement', icon: ArrowRightLeft },
    { id: 'disputes', label: 'Disputes', icon: Scale },
    { id: 'compensation', label: 'Compensation', icon: Coins },
    { id: 'copilot', label: 'AI Analysis', icon: BrainCircuit },
    { id: 'audit', label: 'Audit Trail', icon: History },
  ];

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5">
              <span className="font-mono text-xl font-extrabold text-slate-900">{parcel.parcelId}</span>
              <span className="text-xs font-semibold text-slate-500">Khasra {parcel.khasraNumber}</span>
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
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  parcel.riskLevel === 'HIGH'
                    ? 'bg-rose-100 text-rose-700'
                    : parcel.riskLevel === 'MEDIUM'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-emerald-100 text-emerald-700'
                }`}
              >
                {parcel.riskLevel} RISK (Score: {parcel.riskScore}/10)
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Village: <strong className="text-slate-800">{parcel.village}</strong> · Tehsil:{' '}
              <strong className="text-slate-800">{parcel.tehsil}</strong> · District:{' '}
              <strong className="text-slate-800">{parcel.district}</strong> · Project:{' '}
              <strong className="text-blue-700">{parcel.project}</strong>
            </p>
          </div>

          {/* Quick Action Buttons for the file */}
          {file && (
            <div className="flex flex-wrap items-center gap-2">
              {file.status === 'SENT' && (
                <button
                  onClick={() => setShowAcceptModal(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-md shadow-blue-500/20 flex items-center space-x-1.5 transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Accept Incoming File</span>
                </button>
              )}

              {file.status === 'UNDER_REVIEW' && (
                <>
                  <button
                    onClick={() => setShowReturnModal(true)}
                    className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold flex items-center space-x-1 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Return File</span>
                  </button>
                  <button
                    onClick={() => setShowForwardModal(true)}
                    className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center space-x-1 shadow-sm transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Forward to Next Officer</span>
                  </button>
                </>
              )}

              {file.status === 'RETURNED' && (
                <button
                  onClick={() => setShowResubmitModal(true)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-md shadow-emerald-500/20 flex items-center space-x-1.5 transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Resolve & Resubmit File</span>
                </button>
              )}

              <button
                onClick={() => navigate(`/map?parcelId=${parcel.parcelId}`)}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span>Locate on GIS Map</span>
              </button>
            </div>
          )}
        </div>

        {/* Progress & SLA Summary Bar */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Current Stage</span>
            <p className="font-extrabold text-blue-900 mt-0.5">{parcel.currentStage}</p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Calculated Progress</span>
            <div className="flex items-center space-x-2 mt-0.5">
              <div className="flex-1 bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full" style={{ width: `${parcel.progress}%` }} />
              </div>
              <span className="font-mono font-bold text-slate-900">{parcel.progress}%</span>
            </div>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Current Custodian</span>
            <p className="font-bold text-slate-900 mt-0.5 truncate">{parcel.currentOfficer}</p>
            <p className="text-[10px] text-slate-500 truncate">{parcel.currentDepartment}</p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Schedule Status</span>
            <p className="mt-0.5">
              {parcel.delayDays > 0 ? (
                <span className="text-orange-600 font-bold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Delayed by {parcel.delayDays} days
                </span>
              ) : (
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> On Schedule
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Cadastral Mismatch Alert Banner if detected */}
        {mismatchDoc && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start space-x-3">
              <AlertOctagon className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-rose-900 uppercase">
                  Document Mismatch Detected (AI Cadastral Scrutiny)
                </h4>
                <p className="text-xs text-rose-800 mt-0.5">
                  Physical Deed states <strong>2.40 ha</strong> while revenue database records <strong>2.10 ha</strong>{' '}
                  (+0.30 ha difference). Requires formal reconciliation before financial sanction.
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedMismatchDoc(mismatchDoc)}
              className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shrink-0 shadow-sm transition-all"
            >
              Review Mismatch
            </button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto space-x-1 border-b border-slate-200 pt-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isCurrent = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSearchParams({ tab: tab.id })}
                className={`flex items-center space-x-2 px-3.5 py-2.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
                  isCurrent
                    ? 'border-blue-600 text-blue-600 bg-blue-50/40 rounded-t-lg'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="text-[9px] bg-rose-500 text-white px-1.5 py-0.5 rounded-full font-bold">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Land Specs */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Land Parcel Identification
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block">Khasra Number</span>
                  <span className="font-bold text-slate-900 font-mono text-sm">{parcel.khasraNumber}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Total Area</span>
                  <span className="font-bold text-slate-900 font-mono text-sm">{parcel.area} Hectares</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Land Tenure / Owner Type</span>
                  <span className="font-semibold text-slate-800">{parcel.ownerType}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Owner Reference</span>
                  <span className="font-medium text-slate-800">{parcel.ownerReference}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Digital Case File</span>
                  <span className="font-mono font-bold text-blue-700">{parcel.digitalFileId}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Last Activity Logged</span>
                  <span className="font-medium text-slate-700">
                    {new Date(parcel.lastUpdated).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Delay Details */}
            {parcel.delayDays > 0 && (
              <div className="bg-orange-50 border border-orange-200 p-4 rounded-xl text-xs space-y-1">
                <div className="flex items-center space-x-1.5 font-bold text-orange-900">
                  <Clock className="w-4 h-4 text-orange-600" />
                  <span>Stated Administrative Delay Reason:</span>
                </div>
                <p className="text-orange-900 leading-relaxed font-medium">
                  {parcel.delayReason || 'Department review exceeded SLA due to inter-departmental backlog.'}
                </p>
              </div>
            )}

            {/* Summary Stages Pipeline Preview */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Acquisition Stage Pipeline
                </h3>
                <button
                  onClick={() => setSearchParams({ tab: 'timeline' })}
                  className="text-xs text-blue-600 hover:underline font-semibold"
                >
                  View Full Timeline →
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {parcel.stages.map((stg) => (
                  <div
                    key={stg.id}
                    className={`p-2.5 rounded-lg border text-xs flex flex-col justify-between ${
                      stg.status === 'COMPLETED'
                        ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                        : stg.status === 'IN_PROGRESS'
                        ? 'bg-blue-50 border-blue-200 text-blue-900'
                        : stg.status === 'DELAYED'
                        ? 'bg-orange-50 border-orange-200 text-orange-900'
                        : 'bg-slate-50 border-slate-200 text-slate-500'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-bold">Stage {stg.stageNumber}</span>
                      <span className="text-[9px] font-bold">{stg.status}</span>
                    </div>
                    <span className="font-semibold text-slate-800 mt-1 truncate">{stg.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Risk Determinants & File status */}
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Transparent Risk Factors ({parcel.riskScore}/10)
              </h3>
              {parcel.riskReasons && parcel.riskReasons.length > 0 ? (
                <ul className="space-y-2">
                  {parcel.riskReasons.map((reason, idx) => (
                    <li
                      key={idx}
                      className="p-2.5 rounded-lg bg-rose-50/80 border border-rose-100 text-xs text-rose-800 flex items-start gap-2"
                    >
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>No active high-risk indicators detected on this parcel.</span>
                </div>
              )}
            </div>

            {/* Current File Custody Card */}
            {file && (
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3 text-xs">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Digital Case File Tracker
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">File Reference:</span>
                    <span className="font-mono font-bold text-slate-900">{file.fileId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">File Status:</span>
                    <span className="font-bold text-blue-700">{file.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Current Officer:</span>
                    <span className="font-semibold text-slate-900">{file.currentOfficer}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Department:</span>
                    <span className="text-slate-700">{file.currentDepartment}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Statutory Due:</span>
                    <span className="font-mono text-slate-800">{new Date(file.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSearchParams({ tab: 'movement' })}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-bold text-xs transition-colors"
                >
                  View Movement Chain
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Acquisition Timeline (11 Stages) */}
      {activeTab === 'timeline' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                11-Stage Statutory Land Acquisition Workflow
              </h3>
              <p className="text-xs text-slate-500">
                Strict adherence to Right to Fair Compensation and Transparency in Land Acquisition (RFCTLARR Act)
              </p>
            </div>
            <div className="flex items-center space-x-3 text-xs">
              <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Completed
              </span>
              <span className="flex items-center gap-1 text-blue-700 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span> In Progress
              </span>
              <span className="flex items-center gap-1 text-orange-700 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span> Delayed
              </span>
            </div>
          </div>

          {/* Vertical Timeline */}
          <div className="relative border-l-2 border-slate-200 ml-4 pl-6 space-y-8">
            {parcel.stages.map((stage) => {
              const isCompleted = stage.status === 'COMPLETED';
              const isInProgress = stage.status === 'IN_PROGRESS';
              const isDelayed = stage.status === 'DELAYED';

              return (
                <div key={stage.id} className="relative group">
                  {/* Status Circle */}
                  <span
                    className={`absolute -left-[33px] top-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                      isCompleted
                        ? 'bg-emerald-600'
                        : isInProgress
                        ? 'bg-blue-600 animate-pulse'
                        : isDelayed
                        ? 'bg-orange-600'
                        : 'bg-slate-300'
                    }`}
                  >
                    {isCompleted ? <Check className="w-3.5 h-3.5" /> : stage.stageNumber}
                  </span>

                  <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 text-xs space-y-2 group-hover:border-blue-300 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-extrabold text-sm text-slate-900">
                          {stage.stageNumber}. {stage.name}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isCompleted
                              ? 'bg-emerald-100 text-emerald-800'
                              : isInProgress
                              ? 'bg-blue-100 text-blue-800'
                              : isDelayed
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {stage.status}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">
                        Due: {new Date(stage.dueDate).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600 pt-1">
                      <div>
                        <span className="text-slate-400">Assigned Officer: </span>
                        <strong className="text-slate-800">{stage.assignedOfficer}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400">Department: </span>
                        <span className="text-slate-700">{stage.assignedDepartment}</span>
                      </div>
                    </div>

                    {isDelayed && stage.delayReason && (
                      <div className="p-2 bg-orange-100/70 border border-orange-200 rounded text-orange-900 font-medium">
                        Delay: {stage.delayReason} (+{stage.delayDays} days)
                      </div>
                    )}

                    {stage.remarks && (
                      <p className="text-[11px] text-slate-500 italic">"{stage.remarks}"</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Documents */}
      {activeTab === 'documents' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Statutory Acquisition Documents ({parcelDocs.length})</h3>
              <p className="text-xs text-slate-500">
                Uploaded cadastral certificates, sale deeds, Gazette notifications, and valuation awards.
              </p>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {parcelDocs.map((doc) => (
              <div key={doc.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span className="font-bold text-slate-900 text-sm">{doc.title}</span>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        doc.status === 'VERIFIED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : doc.status === 'UNDER_VERIFICATION'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {doc.status}
                    </span>
                  </div>
                  <p className="text-slate-500 font-mono text-[11px]">
                    {doc.fileName} · {doc.fileSize} · Uploaded by {doc.uploadedBy}
                  </p>

                  {/* AI Extraction Data */}
                  {doc.extractedData && (
                    <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-[11px] flex flex-wrap gap-x-4 gap-y-1 mt-1 font-mono text-slate-700">
                      {doc.extractedData.ownerName && <span>Owner: {doc.extractedData.ownerName}</span>}
                      {doc.extractedData.khasraNumber && <span>Khasra: {doc.extractedData.khasraNumber}</span>}
                      {doc.extractedData.areaHa !== undefined && (
                        <span className={doc.mismatches?.length ? 'text-rose-600 font-bold' : ''}>
                          Area: {doc.extractedData.areaHa} ha
                        </span>
                      )}
                      {doc.extractedData.village && <span>Village: {doc.extractedData.village}</span>}
                    </div>
                  )}

                  {doc.mismatches && doc.mismatches.length > 0 && doc.status !== 'VERIFIED' && (
                    <div className="text-rose-700 text-xs font-semibold bg-rose-50 border border-rose-200 p-2 rounded flex items-center gap-1.5">
                      <AlertOctagon className="w-4 h-4" />
                      <span>
                        Document Mismatch: {doc.mismatches[0].discrepancy} (Document:{' '}
                        {doc.mismatches[0].documentValue} vs Database: {doc.mismatches[0].databaseValue})
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  {doc.mismatches && doc.mismatches.length > 0 && doc.status !== 'VERIFIED' && (
                    <button
                      onClick={() => setSelectedMismatchDoc(doc)}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-xs transition-colors"
                    >
                      Review Mismatch
                    </button>
                  )}
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      alert(`Downloading official certified copy of ${doc.fileName}...`);
                    }}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold text-xs transition-colors"
                  >
                    Download PDF
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Tasks */}
      {activeTab === 'tasks' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Assigned Operational Tasks ({parcelTasks.length})</h3>
              <p className="text-xs text-slate-500">Micro-tasks assigned to field surveyors, revenue officers, and accountants.</p>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {parcelTasks.map((t) => (
              <div key={t.taskId} className="py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900 text-sm">{t.taskName}</span>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        t.priority === 'CRITICAL'
                          ? 'bg-red-100 text-red-800'
                          : t.priority === 'HIGH'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {t.priority}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        t.status === 'COMPLETED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : t.status === 'DELAYED'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>
                  <p className="text-slate-500">
                    Assigned: <strong className="text-slate-700">{t.assignedOfficer}</strong> ({t.department}) · Due: {t.dueDate}
                  </p>
                  {t.delayDays > 0 && (
                    <p className="text-orange-600 font-medium">Overdue by {t.delayDays} days: {t.delayReason}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: File Movement */}
      {activeTab === 'movement' && file && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Digital Case File Movement Chain: {file.fileId}
              </h3>
              <p className="text-xs text-slate-500">
                Chain of custody across Tehsil, Survey, Revenue, Legal, Finance, and Project Authority.
              </p>
            </div>
            <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg">
              Status: {file.status}
            </span>
          </div>

          {/* Current Custody box */}
          <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Current Officer</span>
              <p className="font-extrabold text-blue-900 text-sm mt-0.5">{file.currentOfficer}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Holding Department</span>
              <p className="font-semibold text-slate-800 mt-0.5">{file.currentDepartment}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Intake / Due Date</span>
              <p className="font-mono text-slate-700 mt-0.5">
                {new Date(file.receivedDate).toLocaleDateString()} → {new Date(file.dueDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Movement Chain */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Inter-Departmental Handoff Log
            </h4>
            <div className="relative border-l-2 border-blue-200 ml-3 pl-6 space-y-6">
              {file.movementHistory.map((step) => (
                <div key={step.stepId} className="relative text-xs space-y-1">
                  <span className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-blue-600 border-2 border-white"></span>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">
                      {step.fromOfficer} → {step.toOfficer}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(step.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-blue-700 font-semibold">{step.purpose}</p>
                  {step.remarks && <p className="text-slate-600 italic">"{step.remarks}"</p>}
                  {step.returnReason && (
                    <div className="p-2 bg-rose-50 border border-rose-200 rounded text-rose-800 font-medium">
                      Returned for: {step.returnReason}. Required Correction: {step.requiredCorrection}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Disputes */}
      {activeTab === 'disputes' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Judicial Disputes & Objections</h3>
          {parcel.dispute ? (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-5 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-rose-900 text-sm">{parcel.dispute.caseNumber}</span>
                <span className="px-2 py-0.5 rounded font-bold bg-rose-600 text-white font-mono">
                  {parcel.dispute.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-slate-700">
                <div>
                  <span className="text-slate-400 block">Forum / Bench</span>
                  <span className="font-semibold text-slate-900">{parcel.dispute.courtOrForum}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Petitioner</span>
                  <span className="font-semibold text-slate-900">{parcel.dispute.petitioner}</span>
                </div>
              </div>
              <p className="text-rose-900 leading-relaxed font-medium">{parcel.dispute.summary}</p>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs">
              No judicial disputes or stay petitions registered for this land parcel. Clear title verified.
            </div>
          )}
        </div>
      )}

      {/* Tab 7: Compensation */}
      {activeTab === 'compensation' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
          <h3 className="text-sm font-bold text-slate-900">Statutory Compensation & Valuation Matrix</h3>
          <p className="text-xs text-slate-500">
            Calculated under RFCTLARR Act 2013 (Market Value × Multiplication Factor + 100% Solatium). Prototype calculations for demonstration.
          </p>

          {parcel.compensation ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 block">Base Rate / Ha</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    ₹{parcel.compensation.baseRatePerHa} Lakhs
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Multiplication Factor</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    {parcel.compensation.multiplicationFactor}x (Rural)
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">100% Solatium</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    ₹{parcel.compensation.solatiumLakhs} Lakhs
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Total Final Award</span>
                  <span className="font-mono font-extrabold text-blue-700 text-base">
                    ₹{parcel.compensation.totalAwardLakhs} Lakhs
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Direct Benefit Transfer (DBT) Beneficiary Shares
                </h4>
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                  {parcel.compensation.beneficiaries.map((b, i) => (
                    <div key={i} className="p-3 text-xs flex items-center justify-between bg-white hover:bg-slate-50">
                      <div>
                        <p className="font-bold text-slate-900">{b.name}</p>
                        <p className="text-[11px] text-slate-500 font-mono">
                          Account: {b.bankAccountMasked} · Share: {b.sharePercentage}%
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono font-bold text-slate-900 text-sm">₹{b.amountLakhs} Lakhs</p>
                        <span className="text-[10px] font-bold text-emerald-700">{b.kycStatus}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400">Compensation computation scheduled upon Stage 7 Valuation completion.</p>
          )}
        </div>
      )}

      {/* Tab 8: AI Copilot Analysis */}
      {activeTab === 'copilot' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center space-x-2">
            <BrainCircuit className="w-5 h-5 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">AI Decision Intelligence Case Diagnostic</h3>
          </div>
          <div className="bg-indigo-50/70 border border-indigo-200 p-5 rounded-xl space-y-3 text-xs leading-relaxed text-indigo-950 font-sans">
            <h4 className="font-bold text-sm text-indigo-900">Grounded Diagnostic for Parcel {parcel.parcelId}</h4>
            <p>
              Parcel <strong>{parcel.parcelId}</strong> is held at <strong>{parcel.currentStage}</strong> (Holding Duration: {parcel.delayDays} days overdue).
            </p>
            <div className="space-y-1">
              <span className="font-bold block">Primary Risk Determinants:</span>
              <ul className="list-disc pl-5 space-y-0.5">
                {parcel.riskReasons.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
            <div className="bg-white p-3 rounded-lg border border-indigo-200 text-slate-800">
              <span className="font-bold text-indigo-900 block mb-0.5">Recommended Next Action:</span>
              Verify physical sale deed area discrepancy (2.40 ha vs 2.10 ha recorded in database) before final compensation approval. If physical area includes non-notified roadway buffer, record formal reconcile note and release file to Treasury.
            </div>
            <p className="text-[11px] text-indigo-700 italic">
              Decision support only. Final administrative/legal decisions remain with authorized officials.
            </p>
          </div>
        </div>
      )}

      {/* Tab 9: Audit Trail */}
      {activeTab === 'audit' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Immutable Audit Trail</h3>
          <div className="divide-y divide-slate-100 text-xs">
            {parcelAudit.map((log) => (
              <div key={log.id} className="py-3 flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900">{log.action}</span>
                    <span className="text-[10px] text-slate-400">by {log.user} ({log.role})</span>
                  </div>
                  <p className="text-slate-600 mt-0.5">{log.remarks}</p>
                </div>
                <span className="text-[10px] text-slate-400 font-mono shrink-0">
                  {new Date(log.timestamp).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Workflow Modals */}
      {file && (
        <>
          <AcceptFileModal
            file={file}
            isOpen={showAcceptModal}
            onClose={() => setShowAcceptModal(false)}
          />
          <ReturnFileModal
            file={file}
            isOpen={showReturnModal}
            onClose={() => setShowReturnModal(false)}
          />
          <ForwardFileModal
            file={file}
            isOpen={showForwardModal}
            onClose={() => setShowForwardModal(false)}
          />
          <ResubmitFileModal
            file={file}
            isOpen={showResubmitModal}
            onClose={() => setShowResubmitModal(false)}
          />
        </>
      )}

      {selectedMismatchDoc && (
        <DocumentMismatchModal
          document={selectedMismatchDoc}
          parcel={parcel}
          isOpen={true}
          onClose={() => setSelectedMismatchDoc(null)}
        />
      )}
    </div>
  );
};
