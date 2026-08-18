import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { VerbForm } from '../components/Verbs/VerbForm';
import { adminVerbApi } from '../services/adminVerbApi';
import { CreateVerbPayload } from '../types/verb';

export const AddVerbPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const handleCreateVerb = async (data: CreateVerbPayload) => {
    setIsSaving(true);
    try {
      const res = await adminVerbApi.create(data);
      if (res.success) {
        navigate('/verbs');
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-main)' }}>
          Create New English Verb
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          Add a new verb to the SQLite database with 5 conjugations, Hindi meaning, phonetics, and relational usage rules
        </p>
      </div>

      <VerbForm
        onSubmit={handleCreateVerb}
        isLoading={isSaving}
        isEditing={false}
      />
    </div>
  );
};
