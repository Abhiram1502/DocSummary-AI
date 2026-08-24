import React from 'react';

const options = [
  { id: 'short', label: 'Short', desc: 'Concise, high-level summary' },
  { id: 'medium', label: 'Medium', desc: 'Balanced coverage of key concepts' },
  { id: 'long', label: 'Long', desc: 'Detailed, comprehensive analysis' },
];

const SummaryOptions = ({ selectedOption, onChange }) => {
  return (
    <div style={{ marginBottom: '2rem' }}>
      <h2 className="section-title">Summary Length</h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
        }}
      >
        {options.map((opt) => {
          const isSelected = selectedOption === opt.id;

          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              style={{
                backgroundColor: isSelected
                  ? 'rgba(242, 10, 103, 0.12)'
                  : 'var(--surface)',

                border: `2px solid ${
                  isSelected ? 'var(--primary)' : 'var(--border)'
                }`,

                borderRadius: 'var(--radius-md)',
                padding: '1.1rem 1.25rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease',
                color: 'var(--text-primary)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '0.4rem',
                }}
              >
                <span
                  style={{
                    fontWeight: '700',
                    fontSize: '1rem',
                    color: isSelected
                      ? 'var(--primary)'
                      : 'var(--text-primary)',
                  }}
                >
                  {opt.label}
                </span>

                {/* Radio Button */}
                <span
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    border: `2px solid ${
                      isSelected ? 'var(--primary)' : 'var(--border)'
                    }`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    boxSizing: 'border-box',
                  }}
                >
                  {isSelected && (
                    <span
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--primary)',
                      }}
                    />
                  )}
                </span>
              </div>

              <p
                style={{
                  fontSize: '0.85rem',
                  color: 'var(--text-secondary)',
                  margin: 0,
                }}
              >
                {opt.desc}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SummaryOptions;