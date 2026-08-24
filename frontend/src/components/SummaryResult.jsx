import React from 'react';

const SummaryResult = ({ summaryText }) => {
  return (
    <div className="card-panel" style={{ marginBottom: '1.5rem' }}>
      <div style={{
        marginBottom: '1rem',
        borderBottom: '1px solid var(--border)',
        paddingBottom: '0.75rem'
      }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          SUMMARY
        </h3>
      </div>

      <p style={{
        color: 'var(--text-primary)',
        lineHeight: '1.75',
        fontSize: '1rem',
        whiteSpace: 'pre-line'
      }}>
        {summaryText}
      </p>
    </div>
  );
};

export default SummaryResult;
