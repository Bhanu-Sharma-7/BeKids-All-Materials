import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Save, ArrowLeft } from 'lucide-react';
import { CreateVerbPayload, VerbExample, VerbUsageRule } from '../../types/verb';

interface VerbFormProps {
  initialData?: Partial<CreateVerbPayload>;
  isEditing?: boolean;
  onSubmit: (data: CreateVerbPayload) => Promise<void>;
  isLoading?: boolean;
}

export const VerbForm: React.FC<VerbFormProps> = ({
  initialData,
  isEditing = false,
  onSubmit,
  isLoading = false,
}) => {
  const navigate = useNavigate();

  // Core Verb Info
  const [verb, setVerb] = useState(initialData?.verb || '');
  const [category, setCategory] = useState(initialData?.category || 'Regular');
  const [v1, setV1] = useState(initialData?.v1 || '');
  const [v2, setV2] = useState(initialData?.v2 || '');
  const [v3, setV3] = useState(initialData?.v3 || '');
  const [v4, setV4] = useState(initialData?.v4 || '');
  const [v5, setV5] = useState(initialData?.v5 || '');
  const [hindiMeaning, setHindiMeaning] = useState(initialData?.hindiMeaning || '');
  const [hindiTransliteration, setHindiTransliteration] = useState(initialData?.hindiTransliteration || '');
  const [phoneticEnglish, setPhoneticEnglish] = useState(initialData?.phoneticEnglish || '');
  const [explanation, setExplanation] = useState(initialData?.explanation || '');

  // Relational Tables: Examples & Usage Rules
  const [examples, setExamples] = useState<VerbExample[]>(
    initialData?.examples && initialData.examples.length > 0
      ? initialData.examples
      : [
          {
            sentence: '',
            tense: 'Simple Present (V1)',
            formType: 'V1',
            highlightWord: '',
            orderIndex: 0,
          },
        ]
  );

  const [usageRules, setUsageRules] = useState<VerbUsageRule[]>(
    initialData?.usageRules && initialData.usageRules.length > 0
      ? initialData.usageRules
      : [
          {
            form: '',
            name: 'Base Form (V1)',
            usageContext: '',
            highlighted: true,
            orderIndex: 0,
          },
        ]
  );

  const [error, setError] = useState<string | null>(null);

  // Auto-fill suggestions based on V1
  const handleV1Change = (val: string) => {
    setV1(val);
    if (!verb) setVerb(val.charAt(0).toUpperCase() + val.slice(1));
    if (!v4 && val) setV4(val.endsWith('e') ? `${val.slice(0, -1)}ing` : `${val}ing`);
    if (!v5 && val) setV5(`${val}s`);
    if (!phoneticEnglish && val) setPhoneticEnglish(`/${val}/`);
  };

  const handleAddExample = () => {
    setExamples([
      ...examples,
      {
        sentence: '',
        tense: 'Example Tense',
        formType: 'V1',
        highlightWord: '',
        orderIndex: examples.length,
      },
    ]);
  };

  const handleRemoveExample = (index: number) => {
    setExamples(examples.filter((_, i) => i !== index));
  };

  const handleExampleChange = (index: number, field: keyof VerbExample, value: any) => {
    const updated = [...examples];
    updated[index] = { ...updated[index], [field]: value };
    setExamples(updated);
  };

  const handleAddRule = () => {
    setUsageRules([
      ...usageRules,
      {
        form: v1 || '',
        name: 'Usage Rule',
        usageContext: '',
        highlighted: false,
        orderIndex: usageRules.length,
      },
    ]);
  };

  const handleRemoveRule = (index: number) => {
    setUsageRules(usageRules.filter((_, i) => i !== index));
  };

  const handleRuleChange = (index: number, field: keyof VerbUsageRule, value: any) => {
    const updated = [...usageRules];
    updated[index] = { ...updated[index], [field]: value };
    setUsageRules(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!verb.trim() || !v1.trim() || !v2.trim() || !v3.trim() || !v4.trim() || !v5.trim()) {
      setError('Please provide all 5 verb conjugations (V1 through V5)');
      return;
    }

    if (!hindiMeaning.trim() || !hindiTransliteration.trim()) {
      setError('Please provide Hindi meaning and phonetic transliteration');
      return;
    }

    const payload: CreateVerbPayload = {
      verb: verb.trim(),
      category,
      v1: v1.trim(),
      v2: v2.trim(),
      v3: v3.trim(),
      v4: v4.trim(),
      v5: v5.trim(),
      hindiMeaning: hindiMeaning.trim(),
      hindiTransliteration: hindiTransliteration.trim(),
      phoneticEnglish: phoneticEnglish.trim() || `/${v1}/`,
      explanation: explanation.trim() || `To perform the action of ${verb}.`,
      examples: examples.filter((ex) => ex.sentence.trim().length > 0),
      usageRules: usageRules.filter((rule) => rule.name.trim().length > 0),
    };

    try {
      await onSubmit(payload);
    } catch (err: any) {
      setError(err.message || 'Failed to save verb');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {error && (
        <div
          style={{
            backgroundColor: 'var(--danger-bg)',
            color: 'var(--danger)',
            padding: '14px 18px',
            borderRadius: 'var(--radius-md)',
            fontSize: '14px',
            fontWeight: 500,
            border: '1px solid #FECACA',
          }}
        >
          {error}
        </div>
      )}

      {/* 1. Core Identification Card */}
      <div className="card">
        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '18px', color: 'var(--text-main)' }}>
          1. Basic Verb Information
        </h3>

        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Display Verb Name *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Go, Swim, Study"
              value={verb}
              onChange={(e) => setVerb(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Grammar Category *</label>
            <select
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Regular">Regular Verb (-ed form)</option>
              <option value="Irregular">Irregular Verb</option>
            </select>
          </div>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Hindi Meaning (Devanagari) *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. जाना, तैरना, पढ़ना"
              value={hindiMeaning}
              onChange={(e) => setHindiMeaning(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Hindi Transliteration *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. (jaana), (tairna)"
              value={hindiTransliteration}
              onChange={(e) => setHindiTransliteration(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">English Phonetic Pronunciation (IPA)</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. /ɡoʊ/, /swɪm/"
              value={phoneticEnglish}
              onChange={(e) => setPhoneticEnglish(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Grammar Explanation & Concept *</label>
          <textarea
            className="form-textarea"
            placeholder="Describe when and how to use this verb..."
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            rows={3}
            required
          />
        </div>
      </div>

      {/* 2. Five Verb Conjugations */}
      <div className="card">
        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '18px', color: 'var(--text-main)' }}>
          2. The 5 Verb Forms (Conjugations)
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label">V1: Base Form *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. go"
              value={v1}
              onChange={(e) => handleV1Change(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">V2: Past Tense *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. went"
              value={v2}
              onChange={(e) => setV2(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">V3: Past Participle *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. gone"
              value={v3}
              onChange={(e) => setV3(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">V4: Continuous (-ing) *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. going"
              value={v4}
              onChange={(e) => setV4(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">V5: Singular (-s/-es) *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. goes"
              value={v5}
              onChange={(e) => setV5(e.target.value)}
              required
            />
          </div>
        </div>
      </div>

      {/* 3. Relational Examples (VerbExample Table) */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>
              3. Sentence Examples (Relational Records)
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Interactive example sentences showing the verb in practical context
            </p>
          </div>
          <button type="button" className="btn btn-secondary btn-sm" onClick={handleAddExample}>
            <Plus size={16} />
            <span>Add Example</span>
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {examples.map((ex, index) => (
            <div
              key={index}
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 100px 1fr auto',
                gap: '12px',
                alignItems: 'center',
                backgroundColor: 'var(--bg-main)',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
              }}
            >
              <input
                type="text"
                className="form-input"
                placeholder="Full sentence (e.g. I go to school.)"
                value={ex.sentence}
                onChange={(e) => handleExampleChange(index, 'sentence', e.target.value)}
              />
              <input
                type="text"
                className="form-input"
                placeholder="Tense label (e.g. Simple Present)"
                value={ex.tense}
                onChange={(e) => handleExampleChange(index, 'tense', e.target.value)}
              />
              <select
                className="form-select"
                value={ex.formType}
                onChange={(e) => handleExampleChange(index, 'formType', e.target.value)}
              >
                <option value="V1">V1</option>
                <option value="V2">V2</option>
                <option value="V3">V3</option>
                <option value="V4">V4</option>
                <option value="V5">V5</option>
              </select>
              <input
                type="text"
                className="form-input"
                placeholder="Word to highlight"
                value={ex.highlightWord}
                onChange={(e) => handleExampleChange(index, 'highlightWord', e.target.value)}
              />
              <button
                type="button"
                className="btn btn-icon"
                style={{ color: 'var(--danger)', background: 'transparent', border: 'none', cursor: 'pointer' }}
                onClick={() => handleRemoveExample(index)}
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Relational Usage Rules (VerbUsageRule Table) */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>
              4. Usage Rules & Grammar Guidelines
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Rules shown in the mobile Verb Usage Table
            </p>
          </div>
          <button type="button" className="btn btn-secondary btn-sm" onClick={handleAddRule}>
            <Plus size={16} />
            <span>Add Rule</span>
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {usageRules.map((rule, index) => (
            <div
              key={index}
              style={{
                display: 'grid',
                gridTemplateColumns: '120px 180px 2fr 100px auto',
                gap: '12px',
                alignItems: 'center',
                backgroundColor: 'var(--bg-main)',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
              }}
            >
              <input
                type="text"
                className="form-input"
                placeholder="Form (e.g. go)"
                value={rule.form}
                onChange={(e) => handleRuleChange(index, 'form', e.target.value)}
              />
              <input
                type="text"
                className="form-input"
                placeholder="Rule Name (e.g. Base Form)"
                value={rule.name}
                onChange={(e) => handleRuleChange(index, 'name', e.target.value)}
              />
              <input
                type="text"
                className="form-input"
                placeholder="Context description..."
                value={rule.usageContext}
                onChange={(e) => handleRuleChange(index, 'usageContext', e.target.value)}
              />
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={Boolean(rule.highlighted)}
                  onChange={(e) => handleRuleChange(index, 'highlighted', e.target.checked)}
                />
                <span>Highlight</span>
              </label>
              <button
                type="button"
                className="btn btn-icon"
                style={{ color: 'var(--danger)', background: 'transparent', border: 'none', cursor: 'pointer' }}
                onClick={() => handleRemoveRule(index)}
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Form Action Buttons */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '14px', paddingTop: '10px' }}>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate('/verbs')}
          disabled={isLoading}
        >
          <ArrowLeft size={16} />
          <span>Cancel</span>
        </button>
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          <Save size={16} />
          <span>{isLoading ? 'Saving to Database...' : isEditing ? 'Update Verb Record' : 'Create Verb Record'}</span>
        </button>
      </div>
    </form>
  );
};
