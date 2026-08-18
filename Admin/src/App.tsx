import React from 'react';
import { Routes, Route, Navigate, useOutletContext } from 'react-router-dom';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { ProtectedRoute } from './components/Layout/ProtectedRoute';
import { AdminLayout } from './components/Layout/AdminLayout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { VerbListPage } from './pages/VerbListPage';
import { AddVerbPage } from './pages/AddVerbPage';
import { EditVerbPage } from './pages/EditVerbPage';

const DashboardWrapper: React.FC = () => {
  const { onOpenImportModal } = useOutletContext<{ onOpenImportModal: () => void }>();
  return <DashboardPage onOpenImportModal={onOpenImportModal} />;
};

const VerbListWrapper: React.FC = () => {
  const { onOpenImportModal } = useOutletContext<{ onOpenImportModal: () => void }>();
  return <VerbListPage onOpenImportModal={onOpenImportModal} />;
};

export const App: React.FC = () => {
  return (
    <AdminAuthProvider>
      <Routes>
        {/* Public Login Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin/login" element={<LoginPage />} />

        {/* Protected Admin Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardWrapper />} />
          <Route path="admin/dashboard" element={<DashboardWrapper />} />
          <Route path="admin" element={<DashboardWrapper />} />

          <Route path="verbs" element={<VerbListWrapper />} />
          <Route path="admin/verbs" element={<VerbListWrapper />} />

          <Route path="verbs/new" element={<AddVerbPage />} />
          <Route path="admin/verbs/new" element={<AddVerbPage />} />

          <Route path="verbs/:id/edit" element={<EditVerbPage />} />
          <Route path="admin/verbs/:id/edit" element={<EditVerbPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AdminAuthProvider>
  );
};
