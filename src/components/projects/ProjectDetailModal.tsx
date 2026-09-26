import React, { useState, useMemo, useEffect, Component, ErrorInfo, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Project, Parcel } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  X,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Send,
  MapPin,
  Search,
  BarChart3,
  Layers,
  ShieldAlert,
  ExternalLink,
  ChevronRight,
  Info,
  Calendar,
  Building,
  UserCheck,
} from 'lucide-react';

interface ProjectDetailModalProps {
  project: Project | null;
  isOpen: boolean;
  initialTab?: 'all' | 'delayed' | 'accepted' | 'inprogress' | 'disputed';
  onClose: () => void;
}

// React Error Boundary to catch any unforeseen rendering errors and prevent white screens
interface ErrorBoundaryProps {
  children: ReactNode;
  onClose: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ModalErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ProjectDetailModal caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 text-slate-800 space-y-4 shadow-2xl">
            <div className="flex items-center space-x-3 text-rose-600">
              <AlertTriangle className="w-8 h-8 shrink-0" />
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Project View Recovered</h3>
                <p className="text-xs text-slate-500">The system prevented a page crash and recovered safely.</p>
              </div>
            </div>
            <p className="text-xs bg-slate-50 p-3 rounded-xl border border-slate-200 text-slate-600 font-mono">
              {this.state.error?.message || 'Unexpected data structure in project files.'}
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => this.setState({ hasError: false, error: null })}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-500 transition-colors cursor-pointer"
              >
                Retry View
              </button>
              <button
                onClick={this.props.onClose}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-300 transition-colors cursor-pointer"
              >
                Close Modal
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Statutory 11 Stages of the Land Acquisition Pipeline (RFCTLARR Act 2013)
export const STATUTORY_STAGES = [
  { step: 1, name: 'Land Identification', shortName: '1. Identification', actClause: 'Sec. 3(x) Cadastral Alignment' },
  { step: 2, name: 'Section 4 Notification', shortName: '2. Sec 4 Notif.', actClause: 'Sec. 4(1) Social Impact Notice' },
  { step: 3, name: 'Social Impact Assessment', shortName: '3. SIA Report', actClause: 'Sec. 7 SIA Appraisal Committee' },
  { step: 4, name: 'Cadastral Survey', shortName: '4. Survey/GIS', actClause: 'Sec. 8 DGPS Ground Demarcation' },
  { step: 5, name: 'Section 11 Preliminary Notification', shortName: '5. Sec 11 Notif.', actClause: 'Sec. 11(1) Preliminary Gazette' },
  { step: 6, name: 'Section 15 Hearing of Objections', shortName: '6. Sec 15 Hearing', actClause: 'Sec. 15(2) Collector Scrutiny' },
  { step: 7, name: 'Section 19 Declaration', shortName: '7. Sec 19 Decl.', actClause: 'Sec. 19(1) Final Acquisition Dec.' },
  { step: 8, name: 'Land Valuation', shortName: '8. Valuation', actClause: 'Sec. 26 Circle Rate & Multiplier' },
  { step: 9, name: 'Section 23 Award Inquiry', shortName: '9. Award Inquiry', actClause: 'Sec. 23 Solatium & Claims Inquiry' },
  { step: 10, name: 'Compensation Approval', shortName: '10. Compensation', actClause: 'Sec. 31 Treasury Escrow Sanction' },
  { step: 11, name: 'Handover', shortName: '11. Possession', actClause: 'Sec. 38 Possession & Mutation' },
];

// Helper to synthesize project-tailored parcels if a project has no parcels in state
function createCorridorParcels(project: Project): Parcel[] {
  const prjDistricts = Array.isArray(project.districts) && project.districts.length > 0 ? project.districts : ['Jaipur'];
  const count = Math.max(8, Math.min(24, Number(project.totalParcels) || 12));
  const generated: Parcel[] = [];

  const villageMap: Record<string, string[]> = {
    Jaipur: ['Mansarovar Link', 'Sanganer Feeder', 'Sitapura Extension', 'Bassi North', 'Kukas Industrial'],
    Dausa: ['Bhandarej Corridor', 'Sikandra Toll Bypass', 'Dausa Rural', 'Lalsot Feeder'],
    Alwar: ['Bhiwadi Integrated SEZ', 'Neemrana Japanese Zone', 'Tapukara Industrial Hub', 'Behror South'],
    Ajmer: ['Kishangarh Logistics Node', 'Gaggal Feeder', 'Ajmer Bypass Link', 'Pushkar Road'],
    Kota: ['Sangod Spur Corridor', 'Chambal River Bypass', 'Borbaad Industrial', 'Talwandi Connector'],
    Bundi: ['Bundi North Feeder', 'Hindoli Junction', 'Keshoraipatan Road'],
    Jodhpur: ['Bap Solar Link', 'Bhadla Feeder Hub', 'Phalodi Spur', 'Osian Rural Corridor'],
    Bikaner: ['Kolayat Ultra Park', 'Nokha Grid Link', 'Bikaner Outer Belt', 'Khajuwala Link'],
  };

  const authorityMap: Record<string, { officer: string; dept: string }> = {
    'PRJ-101': { officer: 'Col. Sanjeev Nair (Project Director)', dept: 'NHAI Project Office, Jaipur' },
    'PRJ-102': { officer: 'Rajesh Aggarwal (Chief Project Manager, DFCCIL)', dept: 'DFCCIL Western Dedicated Freight Corridor Unit' },
    'PRJ-103': { officer: 'Sunil Godha (General Manager Land & Civil, JMRC)', dept: 'Jaipur Metro Rail Corporation Land Directorate' },
    'PRJ-104': { officer: 'D.K. Chaturvedi (Project Director, NHAI)', dept: 'NHAI Corridor PIU Kota Unit' },
    'PRJ-105': { officer: 'Dr. Mahendra Bishnoi (Nodal Officer Renewable Energy)', dept: 'Rajasthan Renewable Energy Corp & MNRE' },
    'PRJ-106': { officer: 'Harish Chandra Yadav (Senior Regional Manager)', dept: 'RIICO NCR Logistics Zone Authority' },
  };

  const projectAuth = authorityMap[project.projectId] || {
    officer: `${project.code} Nodal Officer`,
    dept: `${project.name} Project Directorate`,
  };

  for (let i = 1; i <= count; i++) {
    const dist = prjDistricts[(i - 1) % prjDistricts.length];
    const vlgPool = villageMap[dist] || ['Industrial Feeder', 'Corridor Rural Zone', 'Outer Bypass'];
    const vlg = vlgPool[(i - 1) % vlgPool.length];
    const pId = `P-${project.code}-${100 + i}`;
    const khasra = `${100 + (i * 13) % 400}/${1 + (i % 5)}`;
    const area = Number((0.85 + (i * 0.23) % 4.2).toFixed(2));

    let status: Parcel['status'] = 'IN_PROGRESS';
    let completedStages = (i * 2) % 12;
    let delayDays = 0;
    let delayReason: string | undefined = undefined;
    let riskLevel: Parcel['riskLevel'] = 'LOW';
    let riskScore = 0;

    if (i <= Math.round(count * 0.45) || completedStages >= 11) {
      status = 'ACQUIRED';
      completedStages = 11;
    } else if (i % 7 === 0) {
      status = 'DISPUTED';
      riskLevel = 'HIGH';
      riskScore = 8;
      delayDays = 21;
      delayReason = 'Title suit & share partition dispute before Sub-Divisional Revenue Court.';
    } else if (i % 4 === 0) {
      status = 'DELAYED';
      isDelayedParcel(i);
      delayDays = 5 + (i % 14);
      riskLevel = delayDays > 10 ? 'HIGH' : 'MEDIUM';
      riskScore = delayDays > 10 ? 6 : 4;
      delayReason = `Statutory SLA overdue by ${delayDays} days awaiting departmental vetting.`;
    }

    const stageIdx = Math.min(10, completedStages);
    const stageName = STATUTORY_STAGES[stageIdx].name as any;

    // Generate stages array
    const stages = STATUTORY_STAGES.map((st, idx) => {
      let stStatus: 'COMPLETED' | 'IN_PROGRESS' | 'DELAYED' | 'NOT_STARTED' = 'NOT_STARTED';
      if (idx < completedStages) {
        stStatus = 'COMPLETED';
      } else if (idx === stageIdx) {
        stStatus = delayDays > 0 ? 'DELAYED' : 'IN_PROGRESS';
      }

      return {
        id: `STG-${st.step}-${pId}`,
        stageNumber: st.step,
        name: st.name as any,
        status: stStatus,
        assignedOfficer: idx === 10 ? projectAuth.officer : `Revenue Desk Officer (${dist})`,
        assignedDepartment: idx === 10 ? projectAuth.dept : `District Revenue Office, ${dist}`,
        startDate: idx <= stageIdx ? '2025-02-01' : undefined,
        dueDate: '2025-05-30',
        completedDate: stStatus === 'COMPLETED' ? '2025-04-15' : undefined,
        delayDays: idx === stageIdx ? delayDays : 0,
        delayReason: idx === stageIdx ? delayReason : undefined,
      };
    });

    generated.push({
      parcelId: pId,
      khasraNumber: khasra,
      district: dist,
      tehsil: `${dist} Sadar`,
      village: vlg,
      project: project.name,
      projectId: project.projectId,
      area,
      latitude: 26.8 + (i * 0.015),
      longitude: 75.8 + (i * 0.012),
      status,
      currentStage: stageName,
      riskLevel,
      riskScore,
      riskReasons: delayReason ? [delayReason] : [],
      ownerReference: `SYN-OWN-${project.code}-${i} (${['Kalu Ram', 'Devi Singh', 'Babu Lal', 'Smt. Prem Devi', 'Shaitan Ram'][i % 5]})`,
      ownerType: i % 10 === 0 ? 'Government Land' : i % 5 === 0 ? 'Joint Family' : 'Private Individual',
      currentOfficer: stageIdx === 10 ? projectAuth.officer : `Revenue Desk Officer (${dist})`,
      currentDepartment: stageIdx === 10 ? projectAuth.dept : `District Revenue Office, ${dist}`,
      digitalFileId: `LA-2026-${pId}`,
      progress: Number(((completedStages / 11) * 100).toFixed(1)),
      delayDays,
      delayReason,
      lastUpdated: '2026-09-24T10:00:00Z',
      stages,
    });
  }

  return generated;
}

function isDelayedParcel(i: number) {
  return i % 4 === 0;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  isOpen,
  initialTab = 'all',
  onClose,
}) => {
  const navigate = useNavigate();
  const { parcels } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'delayed' | 'accepted' | 'inprogress' | 'disputed'>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOfficerFilter, setSelectedOfficerFilter] = useState('ALL');

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, project]);

  // Safe filter parcels belonging specifically to this project
  const safeParcels = Array.isArray(parcels) ? parcels : [];

  const projectParcels = useMemo(() => {
    if (!project) return [];

    const matched = safeParcels.filter((p) => {
      if (!p) return false;
      const matchesId = Boolean(p.projectId && project.projectId && p.projectId === project.projectId);
      const matchesCode = Boolean(
        project.code && typeof p.project === 'string' && p.project.toLowerCase().includes(project.code.toLowerCase())
      );
      const matchesName = Boolean(
        project.name &&
          typeof p.project === 'string' &&
          (p.project.toLowerCase() === project.name.toLowerCase() ||
            p.project.toLowerCase().includes(project.name.toLowerCase()) ||
            project.name.toLowerCase().includes(p.project.toLowerCase()))
      );
      return matchesId || matchesCode || matchesName;
    });

    // If state contains parcels for this project, return them.
    // If none exist in state (e.g. fresh session or custom project), generate dedicated corridor-tailored parcels!
    if (matched.length > 0) {
      return matched;
    }

    return createCorridorParcels(project);
  }, [safeParcels, project]);

  const effectiveParcels = projectParcels;

  // Compute breakdown stats with comprehensive null-safety
  const delayedParcels = useMemo(() => {
    return effectiveParcels.filter(
      (p) => Boolean(p && ((typeof p.delayDays === 'number' && p.delayDays > 0) || p.status === 'DELAYED'))
    );
  }, [effectiveParcels]);

  const acceptedParcels = useMemo(() => {
    return effectiveParcels.filter((p) => Boolean(p && p.status === 'ACQUIRED'));
  }, [effectiveParcels]);

  const disputedParcels = useMemo(() => {
    return effectiveParcels.filter((p) => Boolean(p && p.status === 'DISPUTED'));
  }, [effectiveParcels]);

  const inProgressParcels = useMemo(() => {
    return effectiveParcels.filter(
      (p) =>
        Boolean(
          p &&
            (p.status === 'IN_PROGRESS' ||
              (!p.delayDays && p.status !== 'ACQUIRED' && p.status !== 'DISPUTED'))
        )
    );
  }, [effectiveParcels]);

  // Distinct officers holding files in THIS specific project
  const holdingOfficers = useMemo(() => {
    return Array.from(
      new Set(
        effectiveParcels
          .map((p) => p?.currentOfficer)
          .filter((off): off is string => typeof off === 'string' && Boolean(off.trim()))
      )
    );
  }, [effectiveParcels]);

  // Calculate 11-Stage Statutory Funnel Distribution dynamically for THIS project
  const stageDistribution = useMemo(() => {
    const totalCount = Math.max(1, effectiveParcels.length);

    return STATUTORY_STAGES.map((st) => {
      const stepIdx = st.step - 1; // 0-indexed step
      const targetName = (st.name || '').toLowerCase();
      const targetShort = (st.shortName || '').toLowerCase().replace(/^\d+\.\s*/, '');

      // 1. Parcels currently active/delayed at this statutory stage
      const atStageCount = effectiveParcels.filter((p) => {
        if (!p) return false;

        // Direct stage array check
        if (Array.isArray(p.stages) && p.stages[stepIdx]) {
          const s = p.stages[stepIdx];
          if (s.status === 'IN_PROGRESS' || s.status === 'DELAYED') {
            return true;
          }
        }

        // Current stage string fallback check
        const pStage = typeof p.currentStage === 'string' ? p.currentStage.toLowerCase() : '';
        if (pStage) {
          if (targetName && pStage.includes(targetName)) return true;
          if (targetShort && pStage.includes(targetShort)) return true;
          if (targetName.includes(pStage)) return true;
        }

        return false;
      }).length;

      // 2. Parcels that have completed or passed this statutory stage (or are fully acquired)
      const passedStageCount = effectiveParcels.filter((p) => {
        if (!p) return false;
        if (p.status === 'ACQUIRED') return true;

        if (Array.isArray(p.stages) && p.stages[stepIdx]) {
          if (p.stages[stepIdx].status === 'COMPLETED') {
            return true;
          }
        }

        // Percentage progress fallback
        if (typeof p.progress === 'number' && p.progress >= (st.step / 11) * 100) {
          return true;
        }

        return false;
      }).length;

      const totalReached = atStageCount + (st.step <= 10 ? passedStageCount : 0);
      const progressPercent = Math.min(100, Math.round((totalReached / totalCount) * 100));

      return {
        ...st,
        currentCount: atStageCount,
        passedCount: passedStageCount,
        totalReached,
        progressPercent,
      };
    });
  }, [effectiveParcels]);

  // Overall calculated progress percentage
  const totalParcelsCount = Math.max(1, effectiveParcels.length);
  const overallProgress = Math.min(
    100,
    Math.max(0, Math.round((acceptedParcels.length / totalParcelsCount) * 100))
  );

  // Filtered files for table view
  const filteredParcels = useMemo(() => {
    return effectiveParcels.filter((p) => {
      if (!p) return false;

      // Tab filter
      if (activeTab === 'delayed' && (!p.delayDays || p.delayDays <= 0) && p.status !== 'DELAYED') return false;
      if (activeTab === 'accepted' && p.status !== 'ACQUIRED') return false;
      if (activeTab === 'disputed' && p.status !== 'DISPUTED') return false;
      if (
        activeTab === 'inprogress' &&
        (p.status === 'ACQUIRED' || p.status === 'DISPUTED' || (typeof p.delayDays === 'number' && p.delayDays > 0))
      ) {
        return false;
      }

      // Officer filter
      if (selectedOfficerFilter !== 'ALL' && p.currentOfficer !== selectedOfficerFilter) {
        return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesKhasra = typeof p.khasraNumber === 'string' && p.khasraNumber.toLowerCase().includes(query);
        const matchesParcel = typeof p.parcelId === 'string' && p.parcelId.toLowerCase().includes(query);
        const matchesVillage = typeof p.village === 'string' && p.village.toLowerCase().includes(query);
        const matchesOfficer = typeof p.currentOfficer === 'string' && p.currentOfficer.toLowerCase().includes(query);
        const matchesOwner = typeof p.ownerReference === 'string' && p.ownerReference.toLowerCase().includes(query);
        const matchesFile = typeof p.digitalFileId === 'string' && p.digitalFileId.toLowerCase().includes(query);
        return matchesKhasra || matchesParcel || matchesVillage || matchesOfficer || matchesOwner || matchesFile;
      }

      return true;
    });
  }, [effectiveParcels, activeTab, selectedOfficerFilter, searchQuery]);

  // Return null only after all hooks have been executed unconditionally
  if (!isOpen || !project) return null;

  return (
    <ModalErrorBoundary onClose={onClose}>
      <div
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-white border border-slate-200 rounded-3xl max-w-6xl w-full my-auto shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        >
          {/* Modal Top Header */}
          <div className="bg-slate-900 text-white p-5 sm:p-6 flex items-start justify-between border-b border-slate-800 shrink-0">
            <div className="space-y-1.5 pr-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-bold text-blue-300 bg-blue-500/20 border border-blue-500/40 px-2.5 py-0.5 rounded-full">
                  {project.code || 'PRJ-PORTFOLIO'}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  National Statutory Portfolio
                </span>
                <span className="text-xs text-slate-400">
                  Districts:{' '}
                  <strong className="text-slate-200">
                    {Array.isArray(project.districts) && project.districts.length > 0
                      ? project.districts.join(', ')
                      : 'State Corridor'}
                  </strong>{' '}
                  ({project.state || 'Rajasthan'})
                </span>
              </div>
              <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight leading-snug">
                {project.name || 'Statutory Project Portfolio'}
              </h2>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
                <span>
                  Budget: <strong className="text-white font-mono">₹{project.budgetCr ?? 0} Cr</strong>
                </span>
                <span>
                  Disbursed:{' '}
                  <strong className="text-emerald-400 font-mono">₹{project.disbursedCr ?? 0} Cr</strong>
                </span>
                <span>
                  Total Corridor Area:{' '}
                  <strong className="text-white font-mono">{project.totalAreaHa ?? 0} Ha</strong>
                </span>
                <span>
                  Statutory Target:{' '}
                  <strong className="text-amber-300 font-mono">
                    {project.targetCompletionDate || 'Under Review'}
                  </strong>
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer shrink-0"
              title="Close Inspector"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Scrollable Body */}
          <div className="overflow-y-auto p-5 sm:p-6 space-y-6 flex-1 bg-slate-50/50">
            {/* 1. Summary Metrics Cards (Accepted, Delayed, In-progress, Disputed) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {/* Accepted Files */}
              <div
                onClick={() => setActiveTab('accepted')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  activeTab === 'accepted'
                    ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-emerald-300 shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-600">Accepted & Acquired</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-emerald-700 font-mono">
                    {acceptedParcels.length}
                  </span>
                  <span className="text-xs text-emerald-600 font-bold">
                    ({Math.round((acceptedParcels.length / totalParcelsCount) * 100)}%)
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Possession & awards cleared</p>
              </div>

              {/* Delayed Files */}
              <div
                onClick={() => setActiveTab('delayed')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  activeTab === 'delayed'
                    ? 'bg-rose-50 border-rose-500 ring-2 ring-rose-500/20 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-rose-300 shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-rose-700">Delayed Files (Overdue)</span>
                  <AlertTriangle className="w-4 h-4 text-rose-600 animate-pulse" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-rose-700 font-mono">
                    {delayedParcels.length}
                  </span>
                  <span className="text-xs text-rose-600 font-bold">
                    ({Math.round((delayedParcels.length / totalParcelsCount) * 100)}%)
                  </span>
                </div>
                <p className="text-[11px] text-rose-600 font-medium mt-1">Pending statutory resolution</p>
              </div>

              {/* In Progress Files */}
              <div
                onClick={() => setActiveTab('inprogress')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  activeTab === 'inprogress'
                    ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500/20 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-blue-300 shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-600">In Active Workflow</span>
                  <Clock className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-blue-700 font-mono">
                    {inProgressParcels.length}
                  </span>
                  <span className="text-xs text-blue-600 font-bold">
                    ({Math.round((inProgressParcels.length / totalParcelsCount) * 100)}%)
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Desk review & valuation</p>
              </div>

              {/* Disputed Files */}
              <div
                onClick={() => setActiveTab('disputed')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  activeTab === 'disputed'
                    ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-500/20 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-amber-300 shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-600">Disputes & Litigations</span>
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-amber-700 font-mono">
                    {disputedParcels.length}
                  </span>
                  <span className="text-xs text-amber-600 font-bold">
                    ({Math.round((disputedParcels.length / totalParcelsCount) * 100)}%)
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Revenue / court hearing</p>
              </div>
            </div>

            {/* 2. Visual 11-Stage Statutory Milestone Funnel Graph */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm">
                      11-Stage Statutory Milestone Funnel Graph ({project.code})
                    </h3>
                    <p className="text-xs text-slate-500">
                      Real-time statutory funnel tracking across RFCTLARR Act 2013 acquisition checkpoints for this corridor
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                  <span className="text-slate-500">Corridor Acquisition Progress:</span>
                  <strong className="text-blue-700 font-mono text-sm">{overallProgress}%</strong>
                  <div className="w-24 bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full transition-all" style={{ width: `${overallProgress}%` }} />
                  </div>
                </div>
              </div>

              {/* Horizontal Milestone Funnel Stages (1 to 11) */}
              <div className="space-y-2">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                  {stageDistribution.slice(0, 6).map((st) => (
                    <div
                      key={st.step}
                      className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5"
                    >
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="font-bold text-slate-700 truncate" title={st.name}>
                          {st.shortName}
                        </span>
                        <span className="font-mono text-blue-700 font-extrabold text-xs">
                          {st.totalReached} files
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-blue-600 h-full rounded-full transition-all"
                          style={{ width: `${st.progressPercent}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>Step {st.step}/11</span>
                        <span className="text-slate-600 font-semibold">{st.currentCount} at desk</span>
                      </div>
                      <div className="text-[9px] text-slate-400 truncate font-mono">
                        {st.actClause}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                  {stageDistribution.slice(6, 11).map((st) => {
                    const isFinal = st.step === 11;
                    return (
                      <div
                        key={st.step}
                        className={`p-2.5 rounded-xl border space-y-1.5 ${
                          isFinal ? 'bg-emerald-50/70 border-emerald-300' : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="flex justify-between items-center text-[11px]">
                          <span
                            className={`font-bold truncate ${isFinal ? 'text-emerald-800' : 'text-slate-700'}`}
                            title={st.name}
                          >
                            {st.shortName}
                          </span>
                          <span
                            className={`font-mono font-extrabold text-xs ${
                              isFinal ? 'text-emerald-700' : 'text-blue-700'
                            }`}
                          >
                            {isFinal ? acceptedParcels.length : st.totalReached} files
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              isFinal ? 'bg-emerald-600' : 'bg-blue-600'
                            }`}
                            style={{
                              width: `${isFinal ? overallProgress : st.progressPercent}%`,
                            }}
                          />
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-400">
                          <span>Step {st.step}/11</span>
                          <span
                            className={isFinal ? 'text-emerald-700 font-bold' : 'text-slate-600 font-semibold'}
                          >
                            {isFinal ? `${overallProgress}% Handed Over` : `${st.currentCount} at desk`}
                          </span>
                        </div>
                        <div className={`text-[9px] truncate font-mono ${isFinal ? 'text-emerald-600' : 'text-slate-400'}`}>
                          {st.actClause}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 3. Detailed Files Registry & Officer Custody Directory Table */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span>Officer Custody & Submission Directory ({project.code})</span>
                    <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-mono font-semibold">
                      {filteredParcels.length} Files
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Real-time file custody: tracking which officer currently holds each file and who submitted it across this corridor.
                  </p>
                </div>

                {/* Quick Navigation actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      onClose();
                      navigate(`/cases?project=${project.projectId}`);
                    }}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open Full Cases Page</span>
                  </button>
                  <button
                    onClick={() => {
                      onClose();
                      navigate(`/map`);
                    }}
                    className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>View on GIS Map</span>
                  </button>
                </div>
              </div>

              {/* Filter Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* Status Tabs */}
                <div className="flex flex-wrap rounded-xl bg-slate-100 p-1 text-xs gap-1">
                  <button
                    onClick={() => setActiveTab('all')}
                    className={`py-1.5 px-3 rounded-lg font-bold transition-all cursor-pointer ${
                      activeTab === 'all'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    All ({effectiveParcels.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('delayed')}
                    className={`py-1.5 px-3 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      activeTab === 'delayed'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'text-rose-700 hover:bg-rose-100'
                    }`}
                  >
                    <AlertTriangle className="w-3 h-3" />
                    <span>Delayed ({delayedParcels.length})</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('accepted')}
                    className={`py-1.5 px-3 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      activeTab === 'accepted'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-emerald-700 hover:bg-emerald-100'
                    }`}
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Accepted ({acceptedParcels.length})</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('inprogress')}
                    className={`py-1.5 px-3 rounded-lg font-bold transition-all cursor-pointer ${
                      activeTab === 'inprogress'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-blue-700 hover:bg-blue-100'
                    }`}
                  >
                    In Progress ({inProgressParcels.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('disputed')}
                    className={`py-1.5 px-3 rounded-lg font-bold transition-all cursor-pointer ${
                      activeTab === 'disputed'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'text-amber-700 hover:bg-amber-100'
                    }`}
                  >
                    Disputed ({disputedParcels.length})
                  </button>
                </div>

                {/* Search & Officer Select */}
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search khasra, officer, file..."
                      className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-blue-500 w-44 sm:w-56"
                    />
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  </div>

                  <select
                    value={selectedOfficerFilter}
                    onChange={(e) => setSelectedOfficerFilter(e.target.value)}
                    className="py-1.5 px-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden text-slate-700 cursor-pointer max-w-[170px]"
                  >
                    <option value="ALL">All Holding Officers ({holdingOfficers.length})</option>
                    {holdingOfficers.map((off) => (
                      <option key={off} value={off}>
                        {off}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <th className="py-2.5 px-3.5">File ID & Khasra</th>
                      <th className="py-2.5 px-3.5">Current Officer Custody (Kis ke pass hai)</th>
                      <th className="py-2.5 px-3.5">Submitted By (Kis ke pass se submit hue)</th>
                      <th className="py-2.5 px-3.5">Current Stage (Kha tak pahuche)</th>
                      <th className="py-2.5 px-3.5">Status & Delay</th>
                      <th className="py-2.5 px-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredParcels.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-400">
                          No files matching the selected filters.
                        </td>
                      </tr>
                    ) : (
                      filteredParcels.map((parcel) => {
                        const initialStage = Array.isArray(parcel?.stages) ? parcel.stages[0] : null;
                        const submittedByOfficer =
                          initialStage?.assignedOfficer || 'Vikram Singh (Survey Officer)';
                        const submittingAgency =
                          initialStage?.assignedDepartment || 'Directorate of Land Records';
                        const rawDate = initialStage?.startDate;
                        const submissionDate =
                          typeof rawDate === 'string' && rawDate.includes('T')
                            ? rawDate.split('T')[0]
                            : typeof rawDate === 'string' && rawDate.length > 0
                            ? rawDate
                            : '2025-01-15';

                        const isDelayed =
                          (typeof parcel.delayDays === 'number' && parcel.delayDays > 0) ||
                          parcel.status === 'DELAYED';
                        const isAcquired = parcel.status === 'ACQUIRED';
                        const isDisputed = parcel.status === 'DISPUTED';

                        const officerInitial =
                          typeof parcel?.currentOfficer === 'string' && parcel.currentOfficer.trim().length > 0
                            ? parcel.currentOfficer.trim().charAt(0)
                            : 'O';

                        return (
                          <tr key={parcel.parcelId || Math.random().toString()} className="hover:bg-slate-50/80 transition-colors">
                            {/* File ID & Parcel */}
                            <td className="py-3 px-3.5">
                              <div className="font-mono font-bold text-blue-700 flex items-center gap-1.5">
                                <span>{parcel.digitalFileId || `LA-${parcel.parcelId || 'FILE'}`}</span>
                              </div>
                              <div className="text-slate-800 font-semibold mt-0.5">
                                Khasra {parcel.khasraNumber || 'N/A'} · {parcel.village || 'N/A'}
                              </div>
                              <div className="text-[10px] text-slate-500">
                                {parcel.area ?? 0} Ha · {parcel.ownerReference || 'Khatedar Land'}
                              </div>
                            </td>

                            {/* Current Officer Custody */}
                            <td className="py-3 px-3.5">
                              <div className="flex items-center space-x-2">
                                <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0">
                                  {officerInitial}
                                </div>
                                <div>
                                  <span className="font-bold text-slate-900 block leading-tight">
                                    {parcel.currentOfficer || 'Revenue Desk Officer'}
                                  </span>
                                  <span className="text-[10px] text-slate-500 block leading-tight">
                                    {parcel.currentDepartment || 'District Administration'}
                                  </span>
                                </div>
                              </div>
                            </td>

                            {/* Submitted By (Origin) */}
                            <td className="py-3 px-3.5">
                              <div className="flex items-center space-x-1.5 text-slate-800">
                                <Send className="w-3 h-3 text-slate-400 shrink-0" />
                                <span className="font-semibold text-slate-900">{submittedByOfficer}</span>
                              </div>
                              <div className="text-[10px] text-slate-500 pl-4.5">
                                Dept: {submittingAgency}
                              </div>
                              <div className="text-[10px] text-slate-400 pl-4.5 font-mono">
                                Date: {submissionDate}
                              </div>
                            </td>

                            {/* Current Stage */}
                            <td className="py-3 px-3.5">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                                <Layers className="w-3 h-3 text-blue-600" />
                                <span>{parcel.currentStage || 'Statutory Stage'}</span>
                              </span>
                              <div className="text-[10px] text-slate-400 mt-1">
                                Progress:{' '}
                                <strong className="text-slate-700 font-mono">
                                  {parcel.progress ?? 0}%
                                </strong>
                              </div>
                            </td>

                            {/* Status & Delay */}
                            <td className="py-3 px-3.5">
                              {isDelayed ? (
                                <div className="space-y-0.5">
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                                    <AlertTriangle className="w-2.5 h-2.5 text-rose-600" />
                                    <span>DELAYED: {parcel.delayDays ?? 0} Days</span>
                                  </span>
                                  {parcel.delayReason && (
                                    <p
                                      className="text-[10px] text-rose-600 line-clamp-1 max-w-[160px]"
                                      title={parcel.delayReason}
                                    >
                                      {parcel.delayReason}
                                    </p>
                                  )}
                                </div>
                              ) : isAcquired ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                  <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                                  <span>Accepted & Acquired</span>
                                </span>
                              ) : isDisputed ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                                  <ShieldAlert className="w-2.5 h-2.5 text-amber-600" />
                                  <span>Disputed / Stay</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                                  <Clock className="w-2.5 h-2.5 text-slate-500" />
                                  <span>In Active Review</span>
                                </span>
                              )}
                            </td>

                            {/* Actions */}
                            <td className="py-3 px-3.5 text-right">
                              <button
                                onClick={() => {
                                  onClose();
                                  navigate(`/cases/${parcel.parcelId}`);
                                }}
                                className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 text-blue-700 rounded-lg text-[11px] font-bold transition-colors inline-flex items-center gap-1 cursor-pointer"
                                title="Inspect Full Land Case"
                              >
                                <span>View</span>
                                <ChevronRight className="w-3 h-3" />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="bg-slate-50 border-t border-slate-200 p-4 px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
            <div className="flex items-center space-x-2 text-xs text-slate-500">
              <Info className="w-4 h-4 text-blue-600 shrink-0" />
              <span>
                Real-time synchronization with {project.name} Land Acquisition & Cadastral Database.
              </span>
            </div>

            <div className="flex items-center space-x-2 justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Close Inspector
              </button>
              <button
                onClick={() => {
                  onClose();
                  navigate(`/cases?project=${project.projectId}`);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex items-center gap-1.5 cursor-pointer"
              >
                <span>Explore All {project.code} Parcels</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </ModalErrorBoundary>
  );
};
