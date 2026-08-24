import React from 'react';

const MainIdeas = ({ mainIdeas = [] }) => {
  if (!mainIdeas || mainIdeas.length === 0) return null;

  return (
    <div className="card-panel" style={{ height: '100%', backgroundColor: 'var(--surface-light)' }}>
      <h3 style={{
        fontSize: '1.05rem',
        fontWeight: '700',
        color: 'var(--text-primary)',
        marginBottom: '1rem',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        borderBottom: '1px solid var(--border)',
        paddingBottom: '0.75rem'
      }}>
        MAIN IDEAS
      </h3>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {mainIdeas.map((idea, index) => (
          <li
            key={index}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.6rem',
              marginBottom: '0.85rem',
              color: 'var(--text-primary)',
              fontSize: '0.95rem',
              lineHeight: '1.5'
            }}
          >
            <span style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.1rem', lineHeight: '1' }}>•</span>
            <span>{idea}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MainIdeas;
