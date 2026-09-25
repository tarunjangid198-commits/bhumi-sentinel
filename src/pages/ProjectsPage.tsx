import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { FolderGit2, ArrowRight, Building, CheckCircle2 } from 'lucide-react';

export const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const { projects, parcels } = useApp();

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <FolderGit2 className="w-5 h-5 text-blue-600" />
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              National Infrastructure Projects
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Portfolios under active statutory land acquisition monitoring across participating states.
          </p>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => {
          const projectParcels = parcels.filter((p) => p.projectId === project.projectId);
          const acquiredCount = projectParcels.filter((p) => p.status === 'ACQUIRED').length;
          const delayedCount = projectParcels.filter((p) => p.delayDays > 0).length;
          const calculatedProgress = Math.round(
            ((project.acquiredParcels || acquiredCount) / (project.totalParcels || projectParcels.length || 1)) * 100
          );

          return (
            <div
              key={project.projectId}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:border-blue-400 flex flex-col justify-between space-y-4 transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                    {project.code}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    Active Portfolio
                  </span>
                </div>

                <h3 className="font-extrabold text-slate-900 text-sm leading-snug">{project.name}</h3>
                <p className="text-xs text-slate-500 line-clamp-2">
                  State: {project.state} · Districts: {project.districts.join(', ')} · Budget: ₹{project.budgetCr} Cr
                </p>
              </div>

              {/* Progress */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-500">Acquisition Progress</span>
                  <span className="font-mono font-bold text-blue-700">{calculatedProgress}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all"
                    style={{ width: `${calculatedProgress}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[11px] text-slate-500 pt-1">
                  <span>Target: {project.targetCompletionDate}</span>
                  <span className="font-bold text-slate-800 font-mono">
                    {projectParcels.length || project.totalParcels} Total Parcels
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => navigate(`/cases?project=${project.projectId}`)}
                  className="py-1.5 px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold rounded-lg text-xs transition-colors"
                >
                  View Parcels ({projectParcels.length})
                </button>
                <button
                  onClick={() => navigate(`/map`)}
                  className="py-1.5 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-lg text-xs flex items-center justify-center gap-1 transition-colors"
                >
                  <span>Open GIS</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
