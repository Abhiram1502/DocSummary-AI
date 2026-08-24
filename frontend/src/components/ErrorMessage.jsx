import React from 'react';

const ErrorMessage = ({ message }) => {
  if (!message) return null;

  return (
    <div style={{
      backgroundColor: 'rgba(242, 10, 103, 0.1)',
      border: '1px solid rgba(242, 10, 103, 0.35)',
      borderRadius: 'var(--radius-md)',
      padding: '1rem 1.25rem',
      color: '#ff6b9d',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      margin: '1.5rem 0',
      fontSize: '0.95rem'
    }}>
      <span style={{ fontSize: '1.2rem' }}>⚠️</span>
      <span>{message}</span>
    </div>
  );
};

export default ErrorMessage;
