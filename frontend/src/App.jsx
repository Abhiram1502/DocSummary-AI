import React, { useState } from 'react';
import Navbar from './components/Navbar';
import DocumentUpload from './components/DocumentUpload';
import SummaryOptions from './components/SummaryOptions';
import ProcessingState from './components/ProcessingState';
import SummaryResult from './components/SummaryResult';
import KeyPoints from './components/KeyPoints';
import MainIdeas from './components/MainIdeas';
import ResultActions from './components/ResultActions';
import ErrorMessage from './components/ErrorMessage';
import { summarizeDocument } from './services/api';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [summaryLength, setSummaryLength] = useState('medium');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState('uploading');
  const [resultData, setResultData] = useState(null);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setErrorMessage(null);
    setResultData(null);
    setHasGenerated(false);
  };

  const handleFileRemove = () => {
    setSelectedFile(null);
    setErrorMessage(null);
    setResultData(null);
    setHasGenerated(false);
  };

  const handleGenerateOrRegenerate = async () => {
    if (!selectedFile) {
      setErrorMessage('Please select a document first.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    setProcessingStage('uploading');

    setTimeout(() => {
      if (selectedFile.type && selectedFile.type.includes('image')) {
        setProcessingStage('ocr');
      } else {
        setProcessingStage('extracting');
      }
    }, 600);

    setTimeout(() => {
      setProcessingStage('analyzing');
    }, 1400);

    setTimeout(() => {
      setProcessingStage('generating');
    }, 2200);

    try {
      const response = await summarizeDocument(selectedFile, summaryLength);

      if (response && response.success) {
        setResultData({
          fileName: response.fileName || selectedFile.name,
          summary: response.summary,
          keyPoints: response.keyPoints || [],
          mainIdeas: response.mainIdeas || [],
        });
        setHasGenerated(true);
      } else {
        throw new Error(response.message || 'Failed to generate document summary.');
      }
    } catch (err) {
      console.error('[DocSummary AI Error]:', err);
      const msg = err.response?.data?.message || err.message || 'The AI service is temporarily unavailable. Please try again.';
      setErrorMessage(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setSummaryLength('medium');
    setIsProcessing(false);
    setResultData(null);
    setHasGenerated(false);
    setErrorMessage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getButtonText = () => {
    if (isProcessing) {
      return hasGenerated ? 'Regenerating...' : 'Generating...';
    }
    return hasGenerated ? 'Regenerate' : 'Generate Summary';
  };

  return (
    <div className="app-container">
      <Navbar />

      <main className="main-content">
        {/* Upload Controls Section */}
        <DocumentUpload
          selectedFile={selectedFile}
          onFileSelect={handleFileSelect}
          onFileRemove={handleFileRemove}
          onError={(msg) => setErrorMessage(msg)}
        />

        <SummaryOptions
          selectedOption={summaryLength}
          onChange={(length) => setSummaryLength(length)}
        />

        <ErrorMessage message={errorMessage} />

        <div style={{ textAlign: 'center', marginTop: '2rem', marginBottom: '2.5rem' }}>
          <button
            onClick={handleGenerateOrRegenerate}
            disabled={!selectedFile || isProcessing}
            className="btn-primary"
            style={{ width: '100%', maxWidth: '280px' }}
          >
            {getButtonText()}
          </button>
        </div>

        <hr className="divider" />

        {/* Permanent Results Section */}
        <section style={{ scrollMarginTop: '100px' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 className="section-title" style={{ marginBottom: '0.25rem' }}>
              Results
            </h2>
            {resultData?.fileName && (
              <p style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '0.95rem' }}>
                📄 {resultData.fileName}
              </p>
            )}
          </div>

          {/* 1. Loading State */}
          {isProcessing && (
            <ProcessingState stage={processingStage} />
          )}

          {/* 2. Empty / Placeholder State before generation */}
          {!isProcessing && !resultData && (
            <div className="card-panel" style={{
              textAlign: 'center',
              padding: '3.5rem 2rem',
              color: 'var(--text-secondary)'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem', opacity: 0.5 }}>📋</div>
              <p style={{ fontSize: '0.95rem' }}>
                Your generated document summary will appear here after processing.
              </p>
            </div>
          )}

          {/* 3. Active Results Output */}
          {!isProcessing && resultData && (
            <div>
              {/* Summary Primary Card */}
              <SummaryResult summaryText={resultData.summary} />

              {/* Key Points & Main Ideas Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1.25rem',
                marginBottom: '1.5rem'
              }}>
                <KeyPoints keyPoints={resultData.keyPoints} />
                <MainIdeas mainIdeas={resultData.mainIdeas} />
              </div>

              {/* Action Buttons: [ Copy ] [ Download PDF ] [ Download TXT ] & Reset */}
              <ResultActions
                fileName={resultData.fileName}
                summaryData={resultData}
                onReset={handleReset}
              />
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
