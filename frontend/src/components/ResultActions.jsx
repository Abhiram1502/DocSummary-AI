import React, { useState } from 'react';

const ResultActions = ({ fileName, summaryData, onReset }) => {
  const { summary, keyPoints = [], mainIdeas = [] } = summaryData || {};
  const [copied, setCopied] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // Formats complete result structure identically for Copy, TXT, and PDF exports
  const buildFullFormattedContent = () => {
    let text = `DocSummary AI\n\nDocument:\n${fileName || 'document'}\n\nSUMMARY\n\n${summary || ''}\n`;

    if (keyPoints.length > 0) {
      text += `\nKEY POINTS\n\n`;
      keyPoints.forEach((pt) => {
        text += `• ${pt}\n`;
      });
    }

    if (mainIdeas.length > 0) {
      text += `\nMAIN IDEAS\n\n`;
      mainIdeas.forEach((idea) => {
        text += `• ${idea}\n`;
      });
    }

    return text.trim();
  };

  const handleCopy = () => {
    const fullText = buildFullFormattedContent();
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleDownloadTxt = () => {
    const fullText = buildFullFormattedContent();
    const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName ? fileName.replace(/\.[^/.]+$/, "") : "summary"}_DocSummary.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    try {
      const jsPDFModule = await import('jspdf');
      const jsPDF = jsPDFModule.jsPDF || jsPDFModule.default;

      const doc = new jsPDF();
      const margin = 15;
      let y = 20;

      // Header Branding
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.setTextColor(242, 10, 103); // #f20a67
      doc.text('DocSummary AI', margin, y);

      y += 8;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      doc.text(`Document: ${fileName || 'Document'}`, margin, y);
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, doc.internal.pageSize.getWidth() - margin - 40, y);

      y += 10;
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, y, doc.internal.pageSize.getWidth() - margin, y);
      y += 12;

      // Executive Summary
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(30, 30, 30);
      doc.text('SUMMARY', margin, y);
      y += 7;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(50, 50, 50);
      const summaryLines = doc.splitTextToSize(summary || 'No summary available.', doc.internal.pageSize.getWidth() - (margin * 2));
      doc.text(summaryLines, margin, y);
      y += (summaryLines.length * 5) + 10;

      // Key Points
      if (keyPoints.length > 0) {
        if (y > 240) { doc.addPage(); y = 20; }
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(30, 30, 30);
        doc.text('KEY POINTS', margin, y);
        y += 7;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        keyPoints.forEach((pt) => {
          const lines = doc.splitTextToSize(`•  ${pt}`, doc.internal.pageSize.getWidth() - (margin * 2));
          if (y + (lines.length * 5) > 270) { doc.addPage(); y = 20; }
          doc.text(lines, margin, y);
          y += (lines.length * 5) + 2;
        });
        y += 8;
      }

      // Main Ideas
      if (mainIdeas.length > 0) {
        if (y > 240) { doc.addPage(); y = 20; }
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(30, 30, 30);
        doc.text('MAIN IDEAS', margin, y);
        y += 7;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        mainIdeas.forEach((idea) => {
          const lines = doc.splitTextToSize(`•  ${idea}`, doc.internal.pageSize.getWidth() - (margin * 2));
          if (y + (lines.length * 5) > 270) { doc.addPage(); y = 20; }
          doc.text(lines, margin, y);
          y += (lines.length * 5) + 2;
        });
      }

      doc.save(`${fileName ? fileName.replace(/\.[^/.]+$/, "") : "summary"}_DocSummary.pdf`);
    } catch (err) {
      console.warn('[PDF Export Fallback]: Using print window.', err);
      const printWin = window.open('', '_blank');
      if (printWin) {
        printWin.document.write(`
          <html>
            <head>
              <title>DocSummary AI - ${fileName || 'Summary'}</title>
              <style>
                body { font-family: sans-serif; padding: 2rem; color: #111; }
                h1 { color: #f20a67; font-size: 24px; margin-bottom: 5px; }
                .sub { color: #666; font-size: 14px; margin-bottom: 20px; border-bottom: 1px solid #ccc; padding-bottom: 10px; }
                h2 { font-size: 16px; margin-top: 20px; border-bottom: 1px solid #eee; padding-bottom: 4px; }
                p, li { font-size: 14px; line-height: 1.6; }
              </style>
            </head>
            <body>
              <h1>DocSummary AI</h1>
              <div class="sub">Document: ${fileName || 'document'} | Date: ${new Date().toLocaleDateString()}</div>
              <h2>SUMMARY</h2>
              <p>${(summary || '').replace(/\n/g, '<br/>')}</p>
              ${keyPoints.length > 0 ? `<h2>KEY POINTS</h2><ul>${keyPoints.map(p => `<li>${p}</li>`).join('')}</ul>` : ''}
              ${mainIdeas.length > 0 ? `<h2>MAIN IDEAS</h2><ul>${mainIdeas.map(i => `<li>${i}</li>`).join('')}</ul>` : ''}
            </body>
          </html>
        `);
        printWin.document.close();
        printWin.focus();
        printWin.print();
      }
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      {/* Action buttons: [ Copy ] [ Download PDF ] [ Download TXT ] with FontAwesome Icons */}
      <div className="action-buttons-group" style={{ marginBottom: '2.5rem' }}>
        <button
          onClick={handleCopy}
          className="btn-secondary"
          style={{
            borderColor: copied ? 'var(--primary)' : 'var(--border)',
            color: copied ? 'var(--primary)' : 'var(--text-primary)',
            minWidth: '110px'
          }}
        >
          {copied ? (
            <>
              <i className="fa-solid fa-check" style={{ marginRight: '0.45rem' }}></i>
              Copied!
            </>
          ) : (
            <>
              <i className="fa-regular fa-copy" style={{ marginRight: '0.45rem' }}></i>
              Copy
            </>
          )}
        </button>

        <button
          onClick={handleDownloadPdf}
          disabled={isGeneratingPdf}
          className="btn-secondary"
        >
          {isGeneratingPdf ? (
            <>
              <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: '0.45rem' }}></i>
              Generating PDF...
            </>
          ) : (
            <>
              <i className="fa-regular fa-file-pdf" style={{ marginRight: '0.45rem' }}></i>
              Download PDF
            </>
          )}
        </button>

        <button
          onClick={handleDownloadTxt}
          className="btn-secondary"
        >
          <i className="fa-regular fa-file-lines" style={{ marginRight: '0.45rem' }}></i>
          Download TXT
        </button>
      </div>

      {/* Reset button */}
      <div style={{ textAlign: 'center', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
        <button onClick={onReset} className="btn-primary" style={{ minWidth: '260px' }}>
          <i className="fa-solid fa-arrow-rotate-left" style={{ marginRight: '0.5rem' }}></i>
          Summarize Another Document
        </button>
      </div>
    </div>
  );
};

export default ResultActions;
