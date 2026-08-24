import fs from 'fs/promises';
import path from 'path';
import { extractTextFromPDF } from '../services/pdfService.js';
import { extractTextFromImage } from '../services/ocrService.js';
import { validateTextNotEmpty } from '../services/textService.js';
import { summarizeWithAI } from '../services/aiService.js';

export const handleGenerateSummary = async (req, res, next) => {
  let uploadedFilePath = null;

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please select a document first.',
      });
    }

    uploadedFilePath = req.file.path;
    const originalName = req.file.originalname;
    const summaryLength = req.body.summaryLength || 'medium';
    const ext = path.extname(originalName).toLowerCase();

    console.log(`[summaryController]: Processing '${originalName}' (${summaryLength} summary length)...`);

    let extractedText = '';

    // Step 1: Text extraction / OCR
    if (ext === '.pdf') {
      extractedText = await extractTextFromPDF(uploadedFilePath);
    } else if (['.png', '.jpg', '.jpeg', '.webp'].includes(ext)) {
      extractedText = await extractTextFromImage(uploadedFilePath);
    } else {
      return res.status(400).json({
        success: false,
        message: 'Unsupported file type. Please upload a PDF, PNG, JPG, or JPEG file.',
      });
    }

    // Step 2: Validate extracted text
    const cleanedText = validateTextNotEmpty(extractedText);

    // Step 3: AI Summarization
    const aiResult = await summarizeWithAI(cleanedText, summaryLength);

    // Clean up uploaded file asynchronously
    fs.unlink(uploadedFilePath).catch(err => console.error('Upload cleanup error:', err));

    return res.status(200).json({
      success: true,
      fileName: originalName,
      summary: aiResult.summary,
      keyPoints: aiResult.keyPoints,
      mainIdeas: aiResult.mainIdeas,
    });

  } catch (error) {
    // Cleanup file on error
    if (uploadedFilePath) {
      fs.unlink(uploadedFilePath).catch(() => {});
    }
    console.error('[summaryController Error]:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'An error occurred while processing the document.',
    });
  }
};
