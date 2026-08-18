import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, PlusCircle, Upload, Sparkles, Database, ArrowUpRight } from 'lucide-react';
import { adminVerbApi } from '../services/adminVerbApi';
import { Verb } from '../types/verb';

interface DashboardPageProps {
  onOpenImportModal: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onOpenImportModal }) => {
  const navigate = useNavigate();
  const [verbs, setVerbs] = useState<Verb[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const res = await adminVerbApi.getAll();
      if (res.success && res.data) {
        setVerbs(res.data);
      }
    } catch {
      // Ignored for stats view
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const totalVerbs = verbs.length;
  const regularCount = verbs.filter((v) => v.category === 'Regular').length;
  const irregularCount = verbs.filter((v) => v.category === 'Irregular').length;
  const totalExamples = verbs.reduce((acc, v) => acc + (v.examples?.length || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Welcome Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0F172A, #1E293B)',
          borderRadius: 'var(--radius-lg)',
          padding: '32px',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ backgroundColor: 'rgba(255, 140, 0, 0.2)', color: '#FF8C00', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 700 }}>
              Live Database Connected
            </span>
            <span style={{ fontSize: '13px', color: '#94A3B8' }}>SQLite dev.db</span>
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.5px' }}>
            BeKids Verb Management Console
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '14px', marginTop: '6px' }}>
            Create, update, and manage English grammar verbs with 5 conjugations, Hindi meanings, and usage rules.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={onOpenImportModal} className="btn btn-secondary" style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', borderColor: 'rgba(255,255,255,0.2)' }}>
            <Upload size={16} />
            <span>Import JSON</span>
          </button>
          <Link to="/verbs/new" className="btn btn-primary">
            <PlusCircle size={16} />
            <span>Add New Verb</span>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
            <BookOpen size={26} />
          </div>
          <div>
            <div className="stat-value">{isLoading ? '...' : totalVerbs}</div>
            <div className="stat-label">Total Verbs in Database</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: '#EFF6FF', color: '#3B82F6' }}>
            <Sparkles size={26} />
          </div>
          <div>
            <div className="stat-value">{isLoading ? '...' : regularCount}</div>
            <div className="stat-label">Regular Verbs (-ed)</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: '#FEF3C7', color: '#F59E0B' }}>
            <Sparkles size={26} />
          </div>
          <div>
            <div className="stat-value">{isLoading ? '...' : irregularCount}</div>
            <div className="stat-label">Irregular Verbs</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--success-bg)', color: 'var(--success)' }}>
            <Database size={26} />
          </div>
          <div>
            <div className="stat-value">{isLoading ? '...' : totalExamples}</div>
            <div className="stat-label">Relational Examples</div>
          </div>
        </div>
      </div>

      {/* Quick Overview & Recent Verbs */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)' }}>
              Recent Verb Records
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Active verbs stored in the SQLite database
            </p>
          </div>

          <Link to="/verbs" className="btn btn-secondary btn-sm">
            <span>View Full Catalogue</span>
            <ArrowUpRight size={14} />
          </Link>
        </div>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            Loading database records...
          </div>
        ) : verbs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            No verbs found in database. Click "Add New Verb" to create one.
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Verb</th>
                  <th>Category</th>
                  <th>Conjugations (V1 - V5)</th>
                  <th>Hindi Meaning</th>
                  <th>Examples</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {verbs.slice(0, 8).map((v) => (
                  <tr key={v.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{v.verb}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{v.phoneticEnglish}</div>
                    </td>
                    <td>
                      <span className={`badge ${v.category === 'Regular' ? 'badge-regular' : 'badge-irregular'}`}>
                        {v.category}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '13px', color: '#475569' }}>
                        <b>{v.v1}</b> → {v.v2} → {v.v3} → {v.v4} → {v.v5}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{v.hindiMeaning}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{v.hindiTransliteration}</div>
                    </td>
                    <td>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>
                        {v.examples?.length || 0} sentences
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => navigate(`/verbs/${v.id}/edit`)}
                        className="btn btn-secondary btn-sm"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
