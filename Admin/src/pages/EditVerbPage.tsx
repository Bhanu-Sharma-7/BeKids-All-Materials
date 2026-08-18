import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { VerbForm } from '../components/Verbs/VerbForm';
import { adminVerbApi } from '../services/adminVerbApi';
import { Verb, CreateVerbPayload } from '../types/verb';

export const EditVerbPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [verbData, setVerbData] = useState<Verb | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadVerb = async () => {
      if (!id) return;
      setIsLoading(true);
      setError(null);
      try {
        const res = await adminVerbApi.getById(id);
        if (res.success && res.data) {
          setVerbData(res.data);
        }
      } catch (err: any) {
        setError(err.message || `Failed to fetch verb details for '${id}'`);
      } finally {
        setIsLoading(false);
      }
    };

    loadVerb();
  }, [id]);

  const handleUpdateVerb = async (data: CreateVerbPayload) => {
    if (!id) return;
    setIsSaving(true);
    try {
      const res = await adminVerbApi.update(id, data);
      if (res.success) {
        navigate('/verbs');
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
        <RefreshCw size={24} className="spin-animation" style={{ display: 'inline-block', marginBottom: '12px' }} />
        <div>Loading verb record from SQLite database...</div>
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
  }

  if (error || !verbData) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
        <AlertCircle size={36} color="var(--danger)" style={{ display: 'inline-block', marginBottom: '12px' }} />
        <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--danger)', marginBottom: '8px' }}>
          Failed to Load Verb
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '20px' }}>
          {error || 'Verb record was not found.'}
        </p>
        <button onClick={() => navigate('/verbs')} className="btn btn-secondary btn-sm">
          Return to Verb Catalogue
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-main)' }}>
          Edit Verb: {verbData.verb} ({verbData.id})
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          Update database records, relational examples, and usage guidelines
        </p>
      </div>

      <VerbForm
        initialData={verbData}
        onSubmit={handleUpdateVerb}
        isLoading={isSaving}
        isEditing={true}
      />
    </div>
  );
};
