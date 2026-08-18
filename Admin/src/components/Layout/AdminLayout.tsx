import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { JsonImportModal } from '../Verbs/JsonImportModal';

export const AdminLayout: React.FC = () => {
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleImportSuccess = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <Sidebar onOpenImportModal={() => setIsImportModalOpen(true)} />

      {/* Main Container */}
      <div className="admin-main">
        <Header />

        <main className="admin-content">
          <Outlet key={refreshKey} context={{ onOpenImportModal: () => setIsImportModalOpen(true) }} />
        </main>
      </div>

      {/* Global JSON Import Modal */}
      <JsonImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onSuccess={handleImportSuccess}
      />
    </div>
  );
};
