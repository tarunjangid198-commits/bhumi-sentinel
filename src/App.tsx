/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { AppLayout } from './components/layout/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
import { MapPage } from './pages/MapPage';
import { CasesPage } from './pages/CasesPage';
import { CaseDetailPage } from './pages/CaseDetailPage';
import { OfficerPortalPage } from './pages/OfficerPortalPage';
import { FileMovementPage } from './pages/FileMovementPage';
import { TasksPage } from './pages/TasksPage';
import { BottlenecksPage } from './pages/BottlenecksPage';
import { SimulatorPage } from './pages/SimulatorPage';
import { CopilotPage } from './pages/CopilotPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { CompletedProjectsPage } from './pages/CompletedProjectsPage';
import { OfficersPage } from './pages/OfficersPage';
import { ReportsPage } from './pages/ReportsPage';
import { AuditPage } from './pages/AuditPage';
import { LoginPage } from './pages/LoginPage';
import { LogoutPage } from './pages/LogoutPage';
import { LandRatesPage } from './pages/LandRatesPage';
import { RefreshCw, RotateCcw, ShieldAlert, LogIn } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class AppErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('AppErrorBoundary caught an unhandled error:', error, errorInfo);
  }

  handleResetState = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {}
    window.location.href = '/#/dashboard';
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 text-center shadow-2xl relative overflow-hidden">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mx-auto flex items-center justify-center">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-xl font-bold text-white">System Recovered Safely</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                A component encounter was intercepted. You can reload the page or reset to the fresh official demonstration state below.
              </p>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 text-left font-mono text-[11px] text-amber-300 overflow-x-auto max-h-24">
              {this.state.error?.message || 'Application state recovery triggered.'}
            </div>
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.reload();
                }}
                className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reload Platform</span>
              </button>
              <button
                onClick={this.handleResetState}
                className="flex-1 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-xl text-xs font-bold transition-all border border-slate-700 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Demo State</span>
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

/**
 * Route protector: requires officer login/registration before entering portal
 */
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useApp();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect unauthenticated visitors to login/register as their first page
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default function App() {
  return (
    <AppErrorBoundary>
      <AppProvider>
        <Router>
          <Routes>
            {/* Public Auth Routes: Login, Create Account & Register, Logout */}
            <Route path="/login" element={<LoginPage initialTab="login" />} />
            <Route path="/register" element={<LoginPage initialTab="register" />} />
            <Route path="/logout" element={<LogoutPage />} />

            {/* Protected App Routes - First-time visitors must authenticate first */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardPage />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="map" element={<MapPage />} />
              <Route path="land-rates" element={<LandRatesPage />} />
              <Route path="cases" element={<CasesPage />} />
              <Route path="cases/:parcelId" element={<CaseDetailPage />} />
              <Route path="portal" element={<OfficerPortalPage />} />
              <Route path="movement" element={<FileMovementPage />} />
              <Route path="files" element={<FileMovementPage />} />
              <Route path="tasks" element={<TasksPage />} />
              <Route path="bottlenecks" element={<BottlenecksPage />} />
              <Route path="simulator" element={<SimulatorPage />} />
              <Route path="copilot" element={<CopilotPage />} />
              <Route path="projects" element={<ProjectsPage />} />
              <Route path="completed-projects" element={<CompletedProjectsPage />} />
              <Route path="officers" element={<OfficersPage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="audit" element={<AuditPage />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Routes>
        </Router>
      </AppProvider>
    </AppErrorBoundary>
  );
}
