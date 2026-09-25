import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { CheckSquare, Search, Filter, Clock, CheckCircle2, AlertTriangle, Eye } from 'lucide-react';
import { TaskStatus } from '../types';

export const TasksPage: React.FC = () => {
  const navigate = useNavigate();
  const { tasks, updateTaskStatus } = useApp();
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [search, setSearch] = useState('');

  const filteredTasks = tasks.filter((t) => {
    if (filterStatus !== 'ALL' && t.status !== filterStatus) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        t.taskName.toLowerCase().includes(q) ||
        t.parcelId.toLowerCase().includes(q) ||
        t.assignedOfficer.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <CheckSquare className="w-5 h-5 text-blue-600" />
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Operational Acquisition Tasks
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Micro-level field execution, cadastral demarcation, legal titling, and disbursement tasks.
          </p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap gap-3 text-xs">
        <div className="relative min-w-[200px] flex-1">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks, Parcel ID, Officer..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-2 text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700"
        >
          <option value="ALL">All Task Statuses</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
          <option value="DELAYED">Delayed</option>
          <option value="NOT_STARTED">Not Started</option>
        </select>
      </div>

      {/* Tasks Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4">Task Name & Parcel</th>
                <th className="py-3 px-4">Assigned Officer</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status & SLA</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTasks.map((task) => (
                <tr key={task.taskId} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 block">{task.taskName}</span>
                    <span className="font-mono text-[11px] text-blue-700 font-semibold">{task.parcelId}</span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-800">{task.assignedOfficer}</td>
                  <td className="py-3 px-4 text-slate-500">{task.department}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded font-mono ${
                        task.priority === 'CRITICAL'
                          ? 'bg-rose-100 text-rose-700'
                          : task.priority === 'HIGH'
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {task.priority}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        task.status === 'COMPLETED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : task.status === 'DELAYED'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {task.status}
                    </span>
                    {task.delayDays > 0 && (
                      <p className="text-[10px] text-orange-600 font-semibold mt-0.5">
                        +{task.delayDays}d overdue
                      </p>
                    )}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-600">{task.dueDate}</td>
                  <td className="py-3 px-4 text-right space-x-1.5">
                    {task.status !== 'COMPLETED' && (
                      <button
                        onClick={() => updateTaskStatus(task.taskId, 'COMPLETED')}
                        className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 rounded text-xs font-bold transition-colors"
                      >
                        Complete
                      </button>
                    )}
                    <button
                      onClick={() => navigate(`/cases/${task.parcelId}`)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-semibold transition-colors"
                    >
                      Case
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
