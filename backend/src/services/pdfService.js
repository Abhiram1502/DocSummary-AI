import fs from 'fs/promises';
import pdfParse from 'pdf-parse';

/**
 * Extract text from PDF document
 * @param {string} filePath - Path to PDF file
 * @returns {Promise<string>} Cleaned extracted text
 */
export const extractTextFromPDF = async (filePath) => {
  try {
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdfParse(dataBuffer);

    if (!data || !data.text) {
      throw new Error("We couldn't extract text from this document.");
    }

    // Preserve paragraph boundaries while cleaning excessive blank lines/spaces
    let text = data.text;
    text = text.replace(/\r\n/g, '\n');
    text = text.replace(/[ \t]+/g, ' ');
    text = text.replace(/\n\s*\n\s*\n+/g, '\n\n');
    text = text.trim();

    if (text.length === 0) {
      throw new Error("PDF file appears to be empty or contains scanned images without text layer.");
    }

    return text;
  } catch (error) {
    console.error('[pdfService Error]:', error.message);
    throw new Error(error.message || "Failed to extract text from PDF document.");
  }
};
