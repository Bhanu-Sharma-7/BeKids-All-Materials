import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Upload, Edit, Trash2, RefreshCw, AlertCircle } from 'lucide-react';
import { adminVerbApi } from '../services/adminVerbApi';
import { Verb } from '../types/verb';
import { ConfirmDialog } from '../components/Common/ConfirmDialog';

interface VerbListPageProps {
  onOpenImportModal: () => void;
}

export const VerbListPage: React.FC<VerbListPageProps> = ({ onOpenImportModal }) => {
  const navigate = useNavigate();
  const [verbs, setVerbs] = useState<Verb[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Deletion Dialog State
  const [verbToDelete, setVerbToDelete] = useState<Verb | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const loadVerbs = async (search?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await adminVerbApi.getAll(search);
      if (res.success && res.data) {
        setVerbs(res.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch verbs from database');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadVerbs();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadVerbs(searchQuery);
  };

  const handleConfirmDelete = async () => {
    if (!verbToDelete) return;

    setIsDeleting(true);
    try {
      const res = await adminVerbApi.delete(verbToDelete.id);
      if (res.success) {
        setVerbToDelete(null);
        await loadVerbs(searchQuery);
      }
    } catch (err: any) {
      alert(`Failed to delete verb: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-main)' }}>
            Verb Catalogue ({verbs.length} records)
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            View, edit, or delete existing English verbs stored in the SQLite database
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={onOpenImportModal} className="btn btn-secondary btn-sm">
            <Upload size={16} />
            <span>Import JSON</span>
          </button>
          <button onClick={() => navigate('/verbs/new')} className="btn btn-primary btn-sm">
            <Plus size={16} />
            <span>Add New Verb</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="card" style={{ padding: '16px 20px' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '12px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} style={{ position: 'absolute', left: '14px', top: '12px', color: 'var(--text-light)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '40px' }}
              placeholder="Search by verb, V1..V5, Hindi meaning, transliteration..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '0 20px' }}>
            Search
          </button>
          {searchQuery && (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => {
                setSearchQuery('');
                loadVerbs('');
              }}
            >
              Clear
            </button>
          )}
        </form>
      </div>

      {/* Error state */}
      {error && (
        <div
          style={{
            backgroundColor: 'var(--danger-bg)',
            color: 'var(--danger)',
            padding: '14px 18px',
            borderRadius: 'var(--radius-md)',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Verbs Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Verb Name</th>
              <th>V1 (Base)</th>
              <th>V2 (Past)</th>
              <th>V3 (Participle)</th>
              <th>V4 (-ing)</th>
              <th>V5 (-s/-es)</th>
              <th>Category</th>
              <th>Hindi Meaning</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  <RefreshCw size={20} className="spin-animation" style={{ display: 'inline-block', marginBottom: '8px' }} />
                  <div>Loading verbs from database...</div>
                </td>
              </tr>
            ) : verbs.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  No verbs found matching your search.
                </td>
              </tr>
            ) : (
              verbs.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '15px' }}>{item.verb}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.phoneticEnglish}</div>
                  </td>
                  <td><code style={{ background: '#F1F5F9', padding: '2px 6px', borderRadius: '4px' }}>{item.v1}</code></td>
                  <td><code style={{ background: '#F1F5F9', padding: '2px 6px', borderRadius: '4px' }}>{item.v2}</code></td>
                  <td><code style={{ background: '#F1F5F9', padding: '2px 6px', borderRadius: '4px' }}>{item.v3}</code></td>
                  <td><code style={{ background: '#F1F5F9', padding: '2px 6px', borderRadius: '4px' }}>{item.v4}</code></td>
                  <td><code style={{ background: '#F1F5F9', padding: '2px 6px', borderRadius: '4px' }}>{item.v5}</code></td>
                  <td>
                    <span className={`badge ${item.category === 'Regular' ? 'badge-regular' : 'badge-irregular'}`}>
                      {item.category}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{item.hindiMeaning}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.hindiTransliteration}</div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => navigate(`/verbs/${item.id}/edit`)}
                        className="btn btn-secondary btn-sm"
                        title="Edit Verb"
                      >
                        <Edit size={14} />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => setVerbToDelete(item)}
                        className="btn btn-danger btn-sm"
                        style={{ padding: '6px 10px' }}
                        title="Delete Verb"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(verbToDelete)}
        title="Delete Verb"
        message={`Are you sure you want to permanently delete the verb "${verbToDelete?.verb}"? This will also cascade delete all its ${verbToDelete?.examples?.length || 0} relational examples and usage rules from the SQLite database.`}
        confirmText="Delete Verb"
        cancelText="Cancel"
        isDestructive
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setVerbToDelete(null)}
      />

      <style>{`
        .spin-animation {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
