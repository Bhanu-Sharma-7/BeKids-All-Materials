import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BookOpen, PlusCircle, Upload, LogOut } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

interface SidebarProps {
  onOpenImportModal?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenImportModal }) => {
  const { logout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to sign out of the Admin Portal?')) {
      await logout();
      navigate('/login');
    }
  };

  return (
    <aside className="admin-sidebar">
      {/* Brand Header */}
      <div className="sidebar-header">
        <div className="brand-badge">B</div>
        <div>
          <div className="brand-title">BeKids</div>
          <div className="brand-subtitle">Admin Portal</div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-nav">
        <NavLink
          to="/"
          end
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/verbs"
          end
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <BookOpen size={18} />
          <span>Verb Catalogue</span>
        </NavLink>

        <NavLink
          to="/verbs/new"
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <PlusCircle size={18} />
          <span>Add New Verb</span>
        </NavLink>

        {onOpenImportModal && (
          <button
            onClick={onOpenImportModal}
            className="nav-link"
            style={{ width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
          >
            <Upload size={18} />
            <span>Import JSON</span>
          </button>
        )}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <button
          onClick={handleLogout}
          className="nav-link"
          style={{
            width: '100%',
            background: 'transparent',
            border: 'none',
            color: '#EF4444',
            cursor: 'pointer',
          }}
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
