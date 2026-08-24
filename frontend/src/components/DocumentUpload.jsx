import React, { useRef, useState } from 'react';

const ALLOWED_TYPES = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
const ALLOWED_EXTENSIONS = ['.pdf', '.png', '.jpg', '.jpeg', '.webp'];
const MAX_SIZE_BYTES = 25 * 1024 * 1024; // 25MB

const DocumentUpload = ({ selectedFile, onFileSelect, onFileRemove, onError }) => {
  const fileInputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const validateAndSetFile = (file) => {
    if (!file) return;

    const fileName = file.name.toLowerCase();
    const isExtensionValid = ALLOWED_EXTENSIONS.some(ext => fileName.endsWith(ext));
    const isTypeValid = ALLOWED_TYPES.includes(file.type) || isExtensionValid;

    if (!isTypeValid) {
      onError('Unsupported file type. Please upload a PDF, PNG, JPG, or JPEG file.');
      return;
    }

    if (file.size > MAX_SIZE_BYTES) {
      onError('File is too large. Maximum file size allowed is 25MB.');
      return;
    }

    onError(null);
    onFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div style={{ marginBottom: '2rem' }}>
      <h2 className="section-title">Upload Document</h2>

      {!selectedFile ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{
            backgroundColor: isDragOver ? 'var(--surface-light)' : 'var(--surface)',
            border: `2px dashed ${isDragOver ? 'var(--primary)' : 'var(--border)'}`,
            borderRadius: 'var(--radius-lg)',
            padding: '2.5rem 1.5rem',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,.png,.jpg,.jpeg,.webp"
            style={{ display: 'none' }}
          />

          {/* Single Upload Icon */}
          <div style={{
            width: '52px',
            height: '52px',
            margin: '0 auto 1rem',
            borderRadius: '50%',
            backgroundColor: 'rgba(242, 10, 103, 0.12)',
            border: '1px solid rgba(242, 10, 103, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary)'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="12" y1="18" x2="12" y2="12"></line>
              <line x1="9" y1="15" x2="15" y2="15"></line>
            </svg>
          </div>

          <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
            Drag & drop your document
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
            or <span style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'underline' }}>Browse your files</span>
          </p>

          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', letterSpacing: '0.04em' }}>
            PDF • PNG • JPG • JPEG
          </p>
        </div>
      ) : (
        <div
          className="card-panel"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem',
            padding: '1.25rem 1.5rem',
            margin: 0,
            width: '100%',
            boxSizing: 'border-box'
          }}
        >
          {/* File Information */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              minWidth: 0,
              flex: 1
            }}
          >
            <span
              style={{
                fontSize: '1.8rem',
                flexShrink: 0
              }}
            >
              📄
            </span>

            <div
              style={{
                minWidth: 0,
                overflow: 'hidden'
              }}
            >
              <p
                style={{
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  fontSize: '0.95rem',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  margin: 0
                }}
              >
                {selectedFile.name}
              </p>

              <p
                style={{
                  fontSize: '0.85rem',
                  color: 'var(--text-secondary)',
                  margin: '0.3rem 0 0'
                }}
              >
                {formatFileSize(selectedFile.size)}
              </p>
            </div>
          </div>

          {/* Remove Button */}
          <button
            type="button"
            onClick={onFileRemove}
            aria-label="Remove selected file"
            style={{
              width: '115px',
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '12px',
              border: '1px solid rgba(255, 107, 107, 0.4)',
              background: 'transparent',
              color: '#ff6b6b',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              flexShrink: 0,
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 107, 107, 0.08)';
              e.currentTarget.style.borderColor = '#ff6b6b';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.borderColor = 'rgba(255, 107, 107, 0.4)';
            }}
          >
            Remove
          </button>
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;
