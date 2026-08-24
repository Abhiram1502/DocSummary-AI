import axios from 'axios';

const api = axios.create({
  baseURL: 'https://docsummary-ai-backend.onrender.com',
});

/**
 * Upload document and request AI summarization
 * @param {File} file 
 * @param {string} summaryLength ('short' | 'medium' | 'long')
 * @returns {Promise<Object>}
 */
export const summarizeDocument = async (file, summaryLength = 'medium') => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('summaryLength', summaryLength);

  const response = await api.post('/summary', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export default api;
