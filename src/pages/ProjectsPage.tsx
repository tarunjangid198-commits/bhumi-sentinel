import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Project } from '../types';
import { ProjectDetailModal } from '../components/projects/ProjectDetailModal';
import { COMPLETED_PROJECTS } from '../data/completedProjectsData';
import {
  FolderGit2,
  ArrowRight,
  ArrowLeft,
  Building,
  CheckCircle2,
  AlertTriangle,
  Clock,
  UserCheck,
  Layers,
  MapPin,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  ShieldAlert,
  Award,
} from 'lucide-react';

export const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const { projects, parcels } = useApp();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [modalInitialTab, setModalInitialTab] = useState<'all' | 'delayed' | 'accepted' | 'inprogress' | 'disputed'>('all');

  const safeProjects = Array.isArray(projects) ? projects : [];
  const safeParcels = Array.isArray(parcels) ? parcels : [];

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
          <span className="font-bold text-slate-800">National Infrastructure Projects</span>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            to="/completed-projects"
            className="flex items-center gap-1 text-xs text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 font-bold px-3 py-1 rounded-lg transition-colors shadow-2xs"
          >
            <Award className="w-3.5 h-3.5 text-emerald-600" />
            <span>Completed Projects Archive ({COMPLETED_PROJECTS.length}) →</span>
          </Link>
        </div>
      </div>

      {/* 2. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <FolderGit2 className="w-4 h-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              National Infrastructure Projects
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Active land acquisition portfolios under statutory monitoring across all state and national corridors. Click any project to inspect its specific delay files, accepted files, officer custody, and 11-stage milestone graph.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/completed-projects')}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Archived Handover Dossiers</span>
          </button>
        </div>
      </div>

      {/* 3. Projects Grid with Enhanced Interactive Inspection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {safeProjects.map((project) => {
          if (!project) return null;

          // Find parcels for this specific project
          const projectParcels = safeParcels.filter((p) => {
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

          // Accurate dynamic counts for this specific project
          const acceptedCount =
            projectParcels.length > 0
              ? projectParcels.filter((p) => Boolean(p && p.status === 'ACQUIRED')).length
              : (project.acquiredParcels ?? 0);

          const delayedCount =
            projectParcels.length > 0
              ? projectParcels.filter(
                  (p) => Boolean(p && ((typeof p.delayDays === 'number' && p.delayDays > 0) || p.status === 'DELAYED'))
                ).length
              : (project.delayedParcels ?? 0);

          const inProgressCount =
            projectParcels.length > 0
              ? projectParcels.filter(
                  (p) =>
                    Boolean(
                      p &&
                        (p.status === 'IN_PROGRESS' ||
                          (!p.delayDays && p.status !== 'ACQUIRED' && p.status !== 'DISPUTED'))
                    )
                ).length
              : (project.inProgressParcels ?? 0);

          const disputedCount =
            projectParcels.length > 0
              ? projectParcels.filter((p) => Boolean(p && p.status === 'DISPUTED')).length
              : (project.disputedParcels ?? 0);

          const totalParcelsCount = Math.max(1, Number(project.totalParcels) || projectParcels.length || 1);
          const calculatedProgress = Math.min(
            100,
            Math.max(0, Math.round((acceptedCount / totalParcelsCount) * 100))
          );

          // Get unique officers holding files specifically for this project
          const uniqueOfficers = Array.from(
            new Set(
              projectParcels
                .map((p) => p?.currentOfficer)
                .filter((off): off is string => typeof off === 'string' && Boolean(off.trim()))
            )
          ).slice(0, 3);

          return (
            <div
              key={project.projectId || Math.random().toString()}
              onClick={() => {
                setModalInitialTab('all');
                setSelectedProject(project);
              }}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:border-blue-400 hover:shadow-md flex flex-col justify-between space-y-4 transition-all group cursor-pointer"
            >
              <div className="space-y-3">
                {/* Header Badge */}
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                    {project.code || 'PRJ'}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    National Portfolio
                  </span>
                </div>

                {/* Project Title */}
                <div>
                  <h3
                    onClick={(e) => {
                      e.stopPropagation();
                      setModalInitialTab('all');
                      setSelectedProject(project);
                    }}
                    className="font-extrabold text-slate-900 text-sm leading-snug cursor-pointer group-hover:text-blue-700 transition-colors"
                  >
                    {project.name || 'Statutory Infrastructure Project'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    State: {project.state || 'Rajasthan'} · Districts:{' '}
                    {Array.isArray(project.districts) && project.districts.length > 0
                      ? project.districts.join(', ')
                      : 'Corridor Nodes'}{' '}
                    · Budget: ₹{project.budgetCr ?? 0} Cr
                  </p>
                </div>

                {/* File Breakdown Badges (Accepted, Delayed, Active, Disputed) */}
                <div className="grid grid-cols-4 gap-1 text-[11px] pt-1">
                  {/* Accepted Files */}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setModalInitialTab('accepted');
                      setSelectedProject(project);
                    }}
                    className="p-1.5 bg-emerald-50/80 border border-emerald-200 hover:bg-emerald-100 rounded-lg text-center cursor-pointer transition-colors"
                    title="Click to view Accepted & Acquired Files"
                  >
                    <span className="text-[9px] text-emerald-700 font-bold block">ACCEPTED</span>
                    <span className="font-mono font-black text-emerald-800 text-xs">
                      {acceptedCount}
                    </span>
                  </div>

                  {/* Delayed Files */}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setModalInitialTab('delayed');
                      setSelectedProject(project);
                    }}
                    className="p-1.5 bg-rose-50/80 border border-rose-200 hover:bg-rose-100 rounded-lg text-center cursor-pointer transition-colors"
                    title="Click to view Delayed / Overdue Files"
                  >
                    <span className="text-[9px] text-rose-700 font-bold block flex items-center justify-center gap-0.5">
                      {delayedCount > 0 && <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>}
                      DELAY
                    </span>
                    <span className="font-mono font-black text-rose-800 text-xs">
                      {delayedCount}
                    </span>
                  </div>

                  {/* In Progress */}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setModalInitialTab('inprogress');
                      setSelectedProject(project);
                    }}
                    className="p-1.5 bg-blue-50/80 border border-blue-200 hover:bg-blue-100 rounded-lg text-center cursor-pointer transition-colors"
                    title="Click to view Active In-Progress Files"
                  >
                    <span className="text-[9px] text-blue-700 font-bold block">ACTIVE</span>
                    <span className="font-mono font-black text-blue-800 text-xs">
                      {inProgressCount}
                    </span>
                  </div>

                  {/* Disputed */}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setModalInitialTab('disputed');
                      setSelectedProject(project);
                    }}
                    className="p-1.5 bg-amber-50/80 border border-amber-200 hover:bg-amber-100 rounded-lg text-center cursor-pointer transition-colors"
                    title="Click to view Court / Boundary Disputes"
                  >
                    <span className="text-[9px] text-amber-700 font-bold block">DISPUTE</span>
                    <span className="font-mono font-black text-amber-800 text-xs">
                      {disputedCount}
                    </span>
                  </div>
                </div>

                {/* Holding Officers Preview (Kis officer ke pass hai) */}
                <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <span className="font-mono font-semibold">OFFICER CUSTODY PREVIEW</span>
                    <span>{uniqueOfficers.length > 0 ? `${uniqueOfficers.length} Officers` : 'Desk Assigned'}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    {uniqueOfficers.length > 0 ? (
                      <>
                        <div className="flex -space-x-1.5 overflow-hidden">
                          {uniqueOfficers.map((off, idx) => {
                            const initial =
                              typeof off === 'string' && off.trim().length > 0 ? off.trim().charAt(0) : 'O';
                            return (
                              <div
                                key={idx}
                                title={typeof off === 'string' ? off : 'Officer'}
                                className="w-5 h-5 rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white shrink-0"
                              >
                                {initial}
                              </div>
                            );
                          })}
                        </div>
                        <span className="text-[11px] text-slate-700 font-medium truncate">
                          {typeof uniqueOfficers[0] === 'string' && uniqueOfficers[0].trim().length > 0
                            ? uniqueOfficers[0].split('(')[0]
                            : 'Revenue Desk'}
                        </span>
                      </>
                    ) : (
                      <span className="text-[11px] text-slate-600 font-medium">
                        Revenue Collectorate & Corridor Authority
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress Bar & Milestone Info */}
                <div className="space-y-1.5 pt-1 text-xs">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-500">Corridor Acquisition Progress</span>
                    <span className="font-mono font-bold text-blue-700">{calculatedProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full transition-all"
                      style={{ width: `${calculatedProgress}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-500 pt-0.5">
                    <span>Target: {project.targetCompletionDate || 'Dec 2026'}</span>
                    <span className="font-bold text-slate-800 font-mono">
                      {project.totalParcels ?? totalParcelsCount} Total Parcels
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                {/* Primary Button: Inspect File Custody, Delay breakdown & Graph */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setModalInitialTab('all');
                    setSelectedProject(project);
                  }}
                  className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <FolderGit2 className="w-3.5 h-3.5" />
                  <span>Inspect Files, Custody & Graph →</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/cases?project=${project.projectId}`);
                    }}
                    className="py-1.5 px-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold rounded-lg text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>Cases ({projectParcels.length || project.totalParcels})</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/map`);
                    }}
                    className="py-1.5 px-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold rounded-lg text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <MapPin className="w-3 h-3 text-blue-600" />
                    <span>GIS Map</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Project Detail & Milestone Inspector Modal (Mounted conditionally) */}
      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          isOpen={!!selectedProject}
          initialTab={modalInitialTab}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
};
