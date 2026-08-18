import React from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { ShieldCheck } from 'lucide-react';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle, actions }) => {
  const { admin } = useAdminAuth();

  return (
    <header className="admin-header">
      <div className="header-left">
        <div>
          {title && <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-main)' }}>{title}</h1>}
          {subtitle && <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{subtitle}</p>}
        </div>
      </div>

      <div className="header-right">
        {actions && <div>{actions}</div>}

        <div className="admin-user-pill">
          <div className="admin-avatar">
            {admin?.name?.charAt(0) || 'A'}
          </div>
          <div style={{ lineHeight: 1.2 }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)' }}>
              {admin?.name || 'Administrator'}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ShieldCheck size={12} color="var(--primary)" />
              {admin?.email || 'admin@bekids.com'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
