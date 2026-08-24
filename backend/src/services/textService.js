/**
 * Text Processing Service
 * Normalizes extracted text, detects empty extractions, and splits large documents into manageable chunks.
 */

export const cleanText = (rawText) => {
  if (!rawText || typeof rawText !== 'string') {
    return '';
  }

  let text = rawText;
  text = text.replace(/\r\n/g, '\n'); // Normalize line endings
  text = text.replace(/[\u00A0\u1680\u180E\u2000-\u200B\u202F\u205F\u3000]/g, ' '); // Non-standard spaces
  text = text.replace(/[ \t]+/g, ' '); // Consecutive horizontal spaces
  text = text.replace(/\n\s*\n\s*\n+/g, '\n\n'); // Multiple blank lines
  return text.trim();
};

export const validateTextNotEmpty = (text) => {
  const cleaned = cleanText(text);
  if (!cleaned || cleaned.length < 5) {
    throw new Error("We couldn't extract readable text from this document.");
  }
  return cleaned;
};

/**
 * Split large documents into chunks for safe processing
 * @param {string} text 
 * @param {number} maxChunkLength - Default ~10,000 characters
 * @returns {Array<string>}
 */
export const splitTextIntoChunks = (text, maxChunkLength = 10000) => {
  const cleaned = cleanText(text);
  if (cleaned.length <= maxChunkLength) {
    return [cleaned];
  }

  const chunks = [];
  const paragraphs = cleaned.split('\n\n');
  let currentChunk = '';

  for (const para of paragraphs) {
    if ((currentChunk.length + para.length + 2) <= maxChunkLength) {
      currentChunk += (currentChunk ? '\n\n' : '') + para;
    } else {
      if (currentChunk) chunks.push(currentChunk);
      
      // If a single paragraph is larger than maxChunkLength, split by sentences
      if (para.length > maxChunkLength) {
        const sentences = para.match(/[^.!?]+[.!?]+/g) || [para];
        let subChunk = '';
        for (const sentence of sentences) {
          if ((subChunk.length + sentence.length) <= maxChunkLength) {
            subChunk += sentence;
          } else {
            if (subChunk) chunks.push(subChunk);
            subChunk = sentence;
          }
        }
        if (subChunk) currentChunk = subChunk;
        else currentChunk = '';
      } else {
        currentChunk = para;
      }
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk);
  }

  return chunks;
};
