import path from 'path';

/**
 * Helper utility to validate supported document extensions
 * @param {string} filename 
 * @returns {boolean}
 */
export const isValidFileType = (filename) => {
  const allowedExtensions = ['.pdf', '.png', '.jpg', '.jpeg', '.webp'];
  const ext = path.extname(filename).toLowerCase();
  return allowedExtensions.includes(ext);
};

/**
 * Placeholder file helper utility
 */
export const sanitizeFilename = (filename) => {
  return filename.replace(/[^a-zA-Z0-9.-]/g, '_');
};
