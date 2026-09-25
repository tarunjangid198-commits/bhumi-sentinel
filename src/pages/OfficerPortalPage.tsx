import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Inbox,
  FolderOpen,
  RotateCcw,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Send,
  Eye,
  AlertTriangle,
  Compass,
  FileCheck,
  Check,
  User,
  ArrowRight,
  QrCode,
} from 'lucide-react';
import { AcceptFileModal } from '../components/modals/AcceptFileModal';
import { ReturnFileModal } from '../components/modals/ReturnFileModal';
import { ForwardFileModal } from '../components/modals/ForwardFileModal';
import { ResubmitFileModal } from '../components/modals/ResubmitFileModal';
import { MobileScannerModal } from '../components/common/MobileScannerModal';
import { DigitalFile } from '../types';

export const OfficerPortalPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, files, parcels, completeSurvey } = useApp();

  const [activeTab, setActiveTab] = useState<'incoming' | 'active' | 'returned' | 'completed' | 'overdue' | 'highrisk'>('incoming');
  const [selectedFileForAccept, setSelectedFileForAccept] = useState<DigitalFile | null>(null);
  const [selectedFileForReturn, setSelectedFileForReturn] = useState<DigitalFile | null>(null);
  const [selectedFileForForward, setSelectedFileForForward] = useState<DigitalFile | null>(null);
  const [selectedFileForResubmit, setSelectedFileForResubmit] = useState<DigitalFile | null>(null);
  const [showScannerModal, setShowScannerModal] = useState<boolean>(false);

  // Survey evidence form state
  const [surveyEvidenceText, setSurveyEvidenceText] = useState('DGPS coordinates verified. Pegs 1-4 anchored. Naksha Trace match certified.');
  const [completingSurveyParcelId, setCompletingSurveyParcelId] = useState<string | null>(null);

  // Filter files relevant to current user role
  const roleName = currentUser.role.toLowerCase().replace(' officer', '').trim();

  // 1. INCOMING FILES: status == 'SENT' or 'RECEIVED' directed to this officer
  const incomingFiles = files.filter(
    (f) =>
      (f.status === 'SENT' || f.status === 'RECEIVED') &&
      (currentUser.role === 'National Admin' || f.currentOfficer.toLowerCase().includes(roleName))
  );

  // 2. ACTIVE FILES: status == 'UNDER_REVIEW' or 'ACCEPTED'
  const activeFiles = files.filter(
    (f) =>
      (f.status === 'UNDER_REVIEW' || f.status === 'ACCEPTED') &&
      (currentUser.role === 'National Admin' || f.currentOfficer.toLowerCase().includes(roleName))
  );

  // 3. RETURNED / ACTION REQUIRED: status == 'RETURNED'
  const returnedFiles = files.filter(
    (f) =>
      f.status === 'RETURNED' &&
      (currentUser.role === 'National Admin' || f.currentOfficer.toLowerCase().includes(roleName))
  );

  // 4. COMPLETED FILES
  const completedFiles = files.filter(
    (f) =>
      f.status === 'COMPLETED' &&
      (currentUser.role === 'National Admin' || f.currentOfficer.toLowerCase().includes(roleName))
  );

  // 5. OVERDUE FILES
  const overdueFiles = files.filter(
    (f) =>
      new Date(f.dueDate).getTime() < Date.now() &&
      f.status !== 'COMPLETED' &&
      (currentUser.role === 'National Admin' || f.currentOfficer.toLowerCase().includes(roleName))
  );

  // 6. HIGH RISK FILES
  const highRiskFiles = files.filter(
    (f) =>
      f.risk === 'HIGH' &&
      (currentUser.role === 'National Admin' || f.currentOfficer.toLowerCase().includes(roleName))
  );

  // Survey Officer Specific parcels
  const isSurveyOfficer = currentUser.role === 'Survey Officer';
  const assignedSurveys = parcels.filter(
    (p) => p.currentStage === 'Survey' || p.currentOfficer.toLowerCase().includes('survey')
  );

  const handleSurveyComplete = async (parcelId: string) => {
    await completeSurvey(parcelId, surveyEvidenceText);
    setCompletingSurveyParcelId(null);
  };

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Officer Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-blue-500/20">
            {currentUser.name
              .split(' ')
              .map((n) => n[0])
              .slice(0, 2)
              .join('')}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono uppercase font-bold text-blue-600">Officer Portal</span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
              <span className="text-xs text-slate-500 font-medium">{currentUser.designation}</span>
            </div>
            <h1 className="text-xl font-extrabold text-slate-900 mt-0.5">
              Good day, {currentUser.name} ({currentUser.role})
            </h1>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mt-1">
              <span>{currentUser.department}</span>
              <span className="text-slate-300">•</span>
              <span className="font-mono text-slate-700 font-semibold">{currentUser.employeeId || currentUser.id}</span>
              {currentUser.district && (
                <>
                  <span className="text-slate-300">•</span>
                  <span className="text-blue-700 font-semibold">{currentUser.district} District</span>
                </>
              )}
              {currentUser.dscStatus === 'ACTIVE' && (
                <>
                  <span className="text-slate-300">•</span>
                  <span className="text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded text-[10px]">
                    DSC e-Sign Active
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Quick action buttons for demo judges & scanner */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowScannerModal(true)}
            className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors shadow-2xs"
            title="Scan physical deed QR, parcel marker, or open on Expo Go"
          >
            <QrCode className="w-4 h-4 text-emerald-600" />
            <span>Scan Deed / Mobile QR</span>
          </button>

          {currentUser.role === 'Finance Officer' && (
            <div className="p-2.5 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
              <span>
                <strong>Demo Step 7:</strong> Incoming File <strong>LA-2026-01024</strong> is ready below for <strong>[Accept File]</strong>.
              </span>
            </div>
          )}
        </div>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <button
          onClick={() => setActiveTab('incoming')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            activeTab === 'incoming'
              ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
              : 'bg-white border-slate-200 hover:border-blue-300 text-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[10px] uppercase font-bold ${activeTab === 'incoming' ? 'text-blue-100' : 'text-slate-400'}`}>
              Incoming Files
            </span>
            <Inbox className="w-4 h-4 opacity-80" />
          </div>
          <p className="text-2xl font-extrabold font-mono mt-1">{incomingFiles.length}</p>
          <span className={`text-[10px] ${activeTab === 'incoming' ? 'text-blue-100' : 'text-slate-500'}`}>
            Awaiting Acceptance
          </span>
        </button>

        <button
          onClick={() => setActiveTab('active')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            activeTab === 'active'
              ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
              : 'bg-white border-slate-200 hover:border-blue-300 text-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[10px] uppercase font-bold ${activeTab === 'active' ? 'text-blue-100' : 'text-slate-400'}`}>
              Active Files
            </span>
            <FolderOpen className="w-4 h-4 opacity-80" />
          </div>
          <p className="text-2xl font-extrabold font-mono mt-1">{activeFiles.length}</p>
          <span className={`text-[10px] ${activeTab === 'active' ? 'text-blue-100' : 'text-slate-500'}`}>
            Under Active Review
          </span>
        </button>

        <button
          onClick={() => setActiveTab('returned')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            activeTab === 'returned'
              ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
              : 'bg-white border-slate-200 hover:border-rose-300 text-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[10px] uppercase font-bold ${activeTab === 'returned' ? 'text-rose-100' : 'text-rose-600'}`}>
              Returned / Action
            </span>
            <RotateCcw className="w-4 h-4 opacity-80" />
          </div>
          <p className="text-2xl font-extrabold font-mono mt-1">{returnedFiles.length}</p>
          <span className={`text-[10px] ${activeTab === 'returned' ? 'text-rose-100' : 'text-slate-500'}`}>
            Deficiencies to fix
          </span>
        </button>

        <button
          onClick={() => setActiveTab('completed')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            activeTab === 'completed'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
              : 'bg-white border-slate-200 hover:border-emerald-300 text-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[10px] uppercase font-bold ${activeTab === 'completed' ? 'text-emerald-100' : 'text-slate-400'}`}>
              Completed
            </span>
            <CheckCircle2 className="w-4 h-4 opacity-80" />
          </div>
          <p className="text-2xl font-extrabold font-mono mt-1">{completedFiles.length}</p>
          <span className={`text-[10px] ${activeTab === 'completed' ? 'text-emerald-100' : 'text-slate-500'}`}>
            Dispatched & Cleared
          </span>
        </button>

        <button
          onClick={() => setActiveTab('overdue')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            activeTab === 'overdue'
              ? 'bg-orange-600 text-white border-orange-600 shadow-sm'
              : 'bg-white border-slate-200 hover:border-orange-300 text-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[10px] uppercase font-bold ${activeTab === 'overdue' ? 'text-orange-100' : 'text-slate-400'}`}>
              Overdue
            </span>
            <Clock className="w-4 h-4 opacity-80" />
          </div>
          <p className="text-2xl font-extrabold font-mono mt-1">{overdueFiles.length}</p>
          <span className={`text-[10px] ${activeTab === 'overdue' ? 'text-orange-100' : 'text-slate-500'}`}>
            Exceeded Target Date
          </span>
        </button>

        <button
          onClick={() => setActiveTab('highrisk')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            activeTab === 'highrisk'
              ? 'bg-red-700 text-white border-red-700 shadow-sm'
              : 'bg-white border-slate-200 hover:border-red-300 text-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[10px] uppercase font-bold ${activeTab === 'highrisk' ? 'text-red-100' : 'text-slate-400'}`}>
              High Risk
            </span>
            <ShieldAlert className="w-4 h-4 opacity-80" />
          </div>
          <p className="text-2xl font-extrabold font-mono mt-1">{highRiskFiles.length}</p>
          <span className={`text-[10px] ${activeTab === 'highrisk' ? 'text-red-100' : 'text-slate-500'}`}>
            Critical Escalations
          </span>
        </button>
      </div>

      {/* Survey Officer Special Portal Module */}
      {isSurveyOfficer && (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <Compass className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Survey Officer Demarcation Queue</h3>
              </div>
              <p className="text-xs text-slate-500">
                Execute field boundary surveys, record DGPS rover coordinates, and certify completion to advance workflow.
              </p>
            </div>
            <span className="text-xs font-mono font-bold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg">
              {assignedSurveys.length} Field Surveys
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {assignedSurveys.map((surveyParcel) => (
              <div
                key={surveyParcel.parcelId}
                className="py-3 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900 font-mono text-sm">{surveyParcel.parcelId}</span>
                    <span className="text-slate-500 font-semibold">Khasra {surveyParcel.khasraNumber}</span>
                    <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded font-mono">
                      {surveyParcel.area} ha
                    </span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        surveyParcel.delayDays > 0 ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {surveyParcel.stages.find((s) => s.stageNumber === 2)?.status || 'PENDING'}
                    </span>
                  </div>
                  <p className="text-slate-500 mt-0.5">
                    Village: {surveyParcel.village}, {surveyParcel.district} · Project: {surveyParcel.project}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => navigate(`/cases/${surveyParcel.parcelId}`)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold"
                  >
                    Inspect Parcel
                  </button>

                  {completingSurveyParcelId === surveyParcel.parcelId ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={surveyEvidenceText}
                        onChange={(e) => setSurveyEvidenceText(e.target.value)}
                        placeholder="Evidence remarks..."
                        className="text-xs p-1.5 border border-slate-300 rounded"
                      />
                      <button
                        onClick={() => handleSurveyComplete(surveyParcel.parcelId)}
                        className="px-3 py-1.5 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700"
                      >
                        Confirm Complete
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setCompletingSurveyParcelId(surveyParcel.parcelId)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-2xs transition-colors flex items-center space-x-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Complete Survey & Hand Off</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Files Table based on Active Tab */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-xs uppercase tracking-wider text-slate-700">
              {activeTab === 'incoming' && 'INCOMING FILES (Awaiting Intake Action)'}
              {activeTab === 'active' && 'ACTIVE FILES (Under Active Scrutiny)'}
              {activeTab === 'returned' && 'RETURNED FILES (Deficiency Rectification Required)'}
              {activeTab === 'completed' && 'COMPLETED FILES'}
              {activeTab === 'overdue' && 'OVERDUE FILES'}
              {activeTab === 'highrisk' && 'HIGH-RISK CASES'}
            </span>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Portal Custodian: {currentUser.name}
          </span>
        </div>

        {/* Tab 1: Incoming Files */}
        {activeTab === 'incoming' && (
          <div className="divide-y divide-slate-100 text-xs">
            {incomingFiles.length > 0 ? (
              incomingFiles.map((file) => (
                <div
                  key={file.fileId}
                  className={`p-4 hover:bg-slate-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    file.fileId === 'LA-2026-01024' ? 'bg-amber-50/60' : ''
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-sm text-slate-900">{file.fileId}</span>
                      <span className="font-mono font-bold text-blue-700">{file.parcelId}</span>
                      <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">
                        {file.currentStage}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          file.risk === 'HIGH' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {file.risk} RISK
                      </span>
                    </div>
                    <p className="text-slate-600">
                      Forwarded From: <strong>{file.previousOfficer || 'District Revenue Officer'}</strong> (
                      {file.previousDepartment || 'District Revenue Office'})
                    </p>
                    <p className="text-[11px] text-slate-400 font-mono">
                      Received: {new Date(file.receivedDate).toLocaleString()} · Statutory Due:{' '}
                      {new Date(file.dueDate).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => navigate(`/cases/${file.parcelId}`)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold flex items-center space-x-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View File</span>
                    </button>
                    <button
                      onClick={() => setSelectedFileForAccept(file)}
                      className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-md shadow-blue-500/20 flex items-center space-x-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>ACCEPT FILE</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-400 text-xs">
                No incoming files in queue for {currentUser.role}.
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Active Files */}
        {activeTab === 'active' && (
          <div className="divide-y divide-slate-100 text-xs">
            {activeFiles.length > 0 ? (
              activeFiles.map((file) => (
                <div
                  key={file.fileId}
                  className="p-4 hover:bg-slate-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-sm text-slate-900">{file.fileId}</span>
                      <span className="font-mono font-bold text-blue-700">{file.parcelId}</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                        ACTIVE INTAKE (UNDER REVIEW)
                      </span>
                    </div>
                    <p className="text-slate-600">Stage: {file.currentStage}</p>
                    <p className="text-[11px] text-slate-400 font-mono">
                      Due: {new Date(file.dueDate).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => navigate(`/cases/${file.parcelId}`)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold flex items-center space-x-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Scrutinize</span>
                    </button>
                    <button
                      onClick={() => setSelectedFileForReturn(file)}
                      className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg font-bold flex items-center space-x-1"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>RETURN / REJECT</span>
                    </button>
                    <button
                      onClick={() => setSelectedFileForForward(file)}
                      className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-xs flex items-center space-x-1"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>FORWARD TO NEXT</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-400 text-xs">
                No active files under review. Accept incoming files to begin active scrutiny.
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Returned Files */}
        {activeTab === 'returned' && (
          <div className="divide-y divide-slate-100 text-xs">
            {returnedFiles.length > 0 ? (
              returnedFiles.map((file) => (
                <div
                  key={file.fileId}
                  className="p-4 bg-rose-50/50 hover:bg-rose-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-sm text-slate-900">{file.fileId}</span>
                      <span className="font-mono font-bold text-blue-700">{file.parcelId}</span>
                      <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-full">
                        ACTION REQUIRED (RETURNED)
                      </span>
                    </div>
                    <p className="text-slate-800 font-semibold">
                      Returned by: {file.previousOfficer || 'Downstream Reviewer'}
                    </p>
                    <p className="text-rose-700 font-medium">
                      Reason: <strong>{file.returnReasonCategory || 'Data Mismatch'}</strong> · Remarks:{' '}
                      {file.returnRemarks || 'Discrepancy identified in documentation.'}
                    </p>
                    {file.requiredCorrection && (
                      <div className="bg-white p-2 rounded border border-rose-200 text-slate-800">
                        <span className="font-bold text-rose-800">Required Correction:</span> {file.requiredCorrection}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => navigate(`/cases/${file.parcelId}`)}
                      className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg font-semibold flex items-center space-x-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Open File</span>
                    </button>
                    <button
                      onClick={() => setSelectedFileForResubmit(file)}
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-md shadow-emerald-500/20 flex items-center space-x-1"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Resolve & Resubmit</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-400 text-xs">
                No returned files requiring correction in your queue.
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Completed, Overdue, High-Risk fallback views */}
        {(activeTab === 'completed' || activeTab === 'overdue' || activeTab === 'highrisk') && (
          <div className="divide-y divide-slate-100 text-xs">
            {(activeTab === 'completed' ? completedFiles : activeTab === 'overdue' ? overdueFiles : highRiskFiles).map(
              (file) => (
                <div
                  key={file.fileId}
                  className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-sm text-slate-900">{file.fileId}</span>
                      <span className="font-mono font-bold text-blue-700">{file.parcelId}</span>
                      <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded font-mono">
                        {file.currentStage}
                      </span>
                    </div>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      Current: {file.currentOfficer} ({file.currentDepartment})
                    </p>
                  </div>
                  <button
                    onClick={() => navigate(`/cases/${file.parcelId}`)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold"
                  >
                    View File
                  </button>
                </div>
              )
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {selectedFileForAccept && (
        <AcceptFileModal
          file={selectedFileForAccept}
          isOpen={true}
          onClose={() => setSelectedFileForAccept(null)}
          onSuccess={() => setActiveTab('active')}
        />
      )}

      {selectedFileForReturn && (
        <ReturnFileModal
          file={selectedFileForReturn}
          isOpen={true}
          onClose={() => setSelectedFileForReturn(null)}
          onSuccess={() => setActiveTab('returned')}
        />
      )}

      {selectedFileForForward && (
        <ForwardFileModal
          file={selectedFileForForward}
          isOpen={true}
          onClose={() => setSelectedFileForForward(null)}
          onSuccess={() => setActiveTab('active')}
        />
      )}

      {selectedFileForResubmit && (
        <ResubmitFileModal
          file={selectedFileForResubmit}
          isOpen={true}
          onClose={() => setSelectedFileForResubmit(null)}
          onSuccess={() => setActiveTab('incoming')}
        />
      )}

      {/* Cadastral & Mobile QR Scanner Modal */}
      <MobileScannerModal
        isOpen={showScannerModal}
        onClose={() => setShowScannerModal(false)}
        defaultTab="camera"
      />
    </div>
  );
};
