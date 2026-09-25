/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
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
import { OfficersPage } from './pages/OfficersPage';
import { ReportsPage } from './pages/ReportsPage';
import { AuditPage } from './pages/AuditPage';
import { LoginPage } from './pages/LoginPage';
import { LogoutPage } from './pages/LogoutPage';
import { LandRatesPage } from './pages/LandRatesPage';

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
            <Route path="officers" element={<OfficersPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="audit" element={<AuditPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </Router>
    </AppProvider>
  );
}
