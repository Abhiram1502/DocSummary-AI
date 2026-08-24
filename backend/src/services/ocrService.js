import { createWorker } from 'tesseract.js';

/**
 * Perform OCR on PNG/JPG/JPEG image files
 * @param {string} imagePath - Path to image file
 * @returns {Promise<string>} Cleaned extracted text
 */
export const extractTextFromImage = async (imagePath) => {
  let worker = null;
  try {
    worker = await createWorker('eng');
    const { data: { text } } = await worker.recognize(imagePath);

    if (!text || text.trim().length === 0) {
      throw new Error("OCR failed to detect legible text in the image. Please try another image.");
    }

    // Clean extracted OCR text
    let cleanedText = text.replace(/\r\n/g, '\n');
    cleanedText = cleanedText.replace(/[ \t]+/g, ' ');
    cleanedText = cleanedText.replace(/\n\s*\n\s*\n+/g, '\n\n');
    cleanedText = cleanedText.trim();

    return cleanedText;
  } catch (error) {
    console.error('[ocrService Error]:', error.message);
    throw new Error("OCR failed. Please try another image.");
  } finally {
    if (worker) {
      await worker.terminate();
    }
  }
};
