import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, RefreshCw, X } from 'lucide-react';
import { adminVerbApi } from '../../services/adminVerbApi';
import { ImportSummary } from '../../types/verb';

interface JsonImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const JsonImportModal: React.FC<JsonImportModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<any[] | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState<boolean>(false);
  const [importSummary, setImportSummary] = useState<ImportSummary | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setParseError(null);
    setParsedData(null);
    setImportSummary(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const json = JSON.parse(text);

        const verbsArray = Array.isArray(json) ? json : json.verbs || json.VERBS_DATA;

        if (!Array.isArray(verbsArray) || verbsArray.length === 0) {
          setParseError('The JSON file must contain an array of verb objects or a "verbs" property.');
          return;
        }

        setParsedData(verbsArray);
      } catch (err: any) {
        setParseError(`JSON parsing error: ${err.message || 'Invalid JSON syntax'}`);
      }
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (!parsedData || parsedData.length === 0) return;

    setIsImporting(true);
    try {
      const res = await adminVerbApi.importJson(parsedData);
      if (res.success && res.summary) {
        setImportSummary(res.summary);
        onSuccess();
      }
    } catch (err: any) {
      setParseError(err.message || 'Import request failed');
    } finally {
      setIsImporting(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setParsedData(null);
    setParseError(null);
    setImportSummary(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '680px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: 'var(--primary-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)',
              }}
            >
              <Upload size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Import Verbs from JSON</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Bulk upload verb catalogue data into SQLite</p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-light)' }}
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* File Upload Drop Area */}
          {!importSummary && (
            <>
              <input
                type="file"
                ref={fileInputRef}
                accept=".json,application/json"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: '2px dashed var(--border-color)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '32px 20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: selectedFile ? '#F8FAFC' : 'white',
                  transition: 'all 0.15s ease',
                  marginBottom: '16px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--primary-light)',
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <FileText size={24} />
                  </div>
                </div>
                <div style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px' }}>
                  {selectedFile ? selectedFile.name : 'Click to browse or drop JSON file'}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  Supports exported BeKids verb schema or array of verb objects
                </div>
              </div>

              {/* Parsing Error */}
              {parseError && (
                <div
                  style={{
                    backgroundColor: 'var(--danger-bg)',
                    color: 'var(--danger)',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '13px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '16px',
                  }}
                >
                  <AlertCircle size={18} style={{ flexShrink: 0 }} />
                  <span>{parseError}</span>
                </div>
              )}

              {/* Data Preview */}
              {parsedData && (
                <div style={{ backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)', padding: '16px', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>
                      JSON Validation Preview ({parsedData.length} records detected)
                    </span>
                    <span className="badge badge-regular">Valid Structure</span>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', maxHeight: '120px', overflowY: 'auto' }}>
                    {parsedData.slice(0, 15).map((item, idx) => (
                      <span
                        key={idx}
                        style={{
                          backgroundColor: 'white',
                          border: '1px solid var(--border-color)',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 500,
                        }}
                      >
                        {item.verb || item.id || `Item ${idx + 1}`}
                      </span>
                    ))}
                    {parsedData.length > 15 && (
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)', alignSelf: 'center' }}>
                        +{parsedData.length - 15} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Import Summary Results */}
          {importSummary && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--success-bg)',
                    color: 'var(--success)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '10px',
                  }}
                >
                  <CheckCircle2 size={32} />
                </div>
                <h4 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)' }}>Import Finished</h4>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Backend database records processed</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
                <div style={{ backgroundColor: 'var(--success-bg)', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--success)' }}>{importSummary.created}</div>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--success)', textTransform: 'uppercase' }}>Created</div>
                </div>
                <div style={{ backgroundColor: 'var(--warning-bg)', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--warning)' }}>{importSummary.skipped}</div>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--warning)', textTransform: 'uppercase' }}>Skipped (Duplicates)</div>
                </div>
                <div style={{ backgroundColor: 'var(--danger-bg)', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--danger)' }}>{importSummary.rejected}</div>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--danger)', textTransform: 'uppercase' }}>Rejected</div>
                </div>
              </div>

              {/* Details log */}
              <div style={{ maxHeight: '160px', overflowY: 'auto', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '12px' }}>
                {importSummary.details.map((detail, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      borderBottom: '1px solid var(--border-color)',
                      backgroundColor: idx % 2 === 0 ? '#F8FAFC' : 'white',
                    }}
                  >
                    <span style={{ fontWeight: 600 }}>{detail.verb}</span>
                    <span
                      style={{
                        color:
                          detail.status === 'CREATED'
                            ? 'var(--success)'
                            : detail.status === 'SKIPPED'
                            ? 'var(--warning)'
                            : 'var(--danger)',
                        fontWeight: 600,
                      }}
                    >
                      {detail.status} {detail.reason ? `(${detail.reason})` : ''}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          {!importSummary ? (
            <>
              <button type="button" className="btn btn-secondary btn-sm" onClick={onClose} disabled={isImporting}>
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={handleImport}
                disabled={!parsedData || isImporting}
              >
                {isImporting ? (
                  <>
                    <RefreshCw size={14} className="spin-animation" />
                    <span>Importing into Database...</span>
                  </>
                ) : (
                  `Confirm Import (${parsedData?.length || 0} Verbs)`
                )}
              </button>
            </>
          ) : (
            <>
              <button type="button" className="btn btn-secondary btn-sm" onClick={handleReset}>
                Import Another File
              </button>
              <button type="button" className="btn btn-primary btn-sm" onClick={onClose}>
                Done
              </button>
            </>
          )}
        </div>
      </div>
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
