import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import AppLayout from './components/layout/AppLayout';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import EmployeeManagement from './pages/admin/EmployeeManagement';
import VisitTrackingAdmin from './pages/admin/VisitTrackingAdmin';
import OrderManagementAdmin from './pages/admin/OrderManagementAdmin';
import DailySummaryAdmin from './pages/admin/DailySummaryAdmin';

// Employee Pages
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import VisitActionPage from './pages/employee/VisitActionPage';
import EmployeeVisitsPage from './pages/employee/EmployeeVisitsPage';
import EmployeeOrdersPage from './pages/employee/EmployeeOrdersPage';
import EmployeeDailySummary from './pages/employee/EmployeeDailySummary';
import EmployeeProfile from './pages/employee/EmployeeProfile';

// Shared Settings Page
import AccountSettings from './pages/common/AccountSettings';

/**
 * Role-Based Route Guard Component
 */
function ProtectedRoleRoute({ allowedRole, children }) {
  const { isAuthenticated, currentUser } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (currentUser?.role !== allowedRole) {
    // If Admin attempts to access Employee page or vice versa, redirect to respective home
    const fallback = currentUser?.role === 'admin' ? '/admin/dashboard' : '/employee/dashboard';
    return <Navigate to={fallback} replace />;
  }

  return children;
}

export default function AppRouter() {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <Routes>
      {/* Public Login Route */}
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to={isAdmin ? '/admin/dashboard' : '/employee/dashboard'} replace />
          ) : (
            <LoginPage />
          )
        }
      />

      {/* Main Authenticated Layout */}
      <Route path="/" element={<AppLayout />}>
        {/* Default redirect to appropriate dashboard */}
        <Route
          index
          element={
            <Navigate
              to={isAdmin ? '/admin/dashboard' : '/employee/dashboard'}
              replace
            />
          }
        />

        {/* ADMIN ROUTES */}
        <Route
          path="admin/dashboard"
          element={
            <ProtectedRoleRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoleRoute>
          }
        />
        <Route
          path="admin/employees"
          element={
            <ProtectedRoleRoute allowedRole="admin">
              <EmployeeManagement />
            </ProtectedRoleRoute>
          }
        />
        <Route
          path="admin/visits"
          element={
            <ProtectedRoleRoute allowedRole="admin">
              <VisitTrackingAdmin />
            </ProtectedRoleRoute>
          }
        />
        <Route
          path="admin/orders"
          element={
            <ProtectedRoleRoute allowedRole="admin">
              <OrderManagementAdmin />
            </ProtectedRoleRoute>
          }
        />
        <Route
          path="admin/daily-summary"
          element={
            <ProtectedRoleRoute allowedRole="admin">
              <DailySummaryAdmin />
            </ProtectedRoleRoute>
          }
        />
        <Route
          path="admin/settings"
          element={
            <ProtectedRoleRoute allowedRole="admin">
              <AccountSettings />
            </ProtectedRoleRoute>
          }
        />

        {/* SALES EMPLOYEE ROUTES */}
        <Route
          path="employee/dashboard"
          element={
            <ProtectedRoleRoute allowedRole="sales_rep">
              <EmployeeDashboard />
            </ProtectedRoleRoute>
          }
        />
        <Route
          path="employee/visit-action"
          element={
            <ProtectedRoleRoute allowedRole="sales_rep">
              <VisitActionPage />
            </ProtectedRoleRoute>
          }
        />
        <Route
          path="employee/visits"
          element={
            <ProtectedRoleRoute allowedRole="sales_rep">
              <EmployeeVisitsPage />
            </ProtectedRoleRoute>
          }
        />
        <Route
          path="employee/orders"
          element={
            <ProtectedRoleRoute allowedRole="sales_rep">
              <EmployeeOrdersPage />
            </ProtectedRoleRoute>
          }
        />
        <Route
          path="employee/daily-summary"
          element={
            <ProtectedRoleRoute allowedRole="sales_rep">
              <EmployeeDailySummary />
            </ProtectedRoleRoute>
          }
        />
        <Route
          path="employee/profile"
          element={
            <ProtectedRoleRoute allowedRole="sales_rep">
              <EmployeeProfile />
            </ProtectedRoleRoute>
          }
        />
        <Route
          path="employee/settings"
          element={
            <ProtectedRoleRoute allowedRole="sales_rep">
              <AccountSettings />
            </ProtectedRoleRoute>
          }
        />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
