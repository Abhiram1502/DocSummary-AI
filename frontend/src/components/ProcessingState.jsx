import React from 'react';

const ProcessingState = ({ stage }) => {
  const stageLabels = {
    uploading: 'Uploading document...',
    extracting: 'Extracting text from document...',
    ocr: 'Running OCR image text recognition...',
    analyzing: 'Analyzing document structure...',
    generating: 'Generating summary and key insights...',
  };

  const currentLabel = stageLabels[stage] || 'Processing document...';

  return (
    <div className="card-panel" style={{ textAlign: 'center', padding: '3.5rem 2rem' }}>
      <div style={{
        width: '44px',
        height: '44px',
        border: '3px solid var(--surface-light)',
        borderTopColor: 'var(--primary)',
        borderRadius: '50%',
        margin: '0 auto 1.5rem',
        animation: 'spin 0.9s linear infinite'
      }} />

      <h3 style={{ color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.4rem' }}>
        {currentLabel}
      </h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
        Please wait while your document is being processed.
      </p>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ProcessingState;
