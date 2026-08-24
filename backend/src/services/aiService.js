import { GoogleGenerativeAI } from '@google/generative-ai';
import { splitTextIntoChunks, cleanText } from './textService.js';

/**
 * Build Gemini prompt for document summarization
 */
const buildPrompt = (documentText, summaryLength = 'medium') => {
  const lengthGuides = {
    short: 'Produce a highly concise executive summary (1-2 crisp paragraphs) covering only the most essential thesis and critical outcomes.',
    medium: 'Produce a balanced, structured summary (2-4 clear paragraphs) covering main concepts and important findings without fluff.',
    long: 'Produce a detailed, comprehensive summary (4+ thorough paragraphs) explaining major arguments, background context, supporting data, and implications.',
  };

  const selectedGuide = lengthGuides[summaryLength.toLowerCase()] || lengthGuides.medium;

  return `
You are DocSummary AI, an expert analytical document summarization AI.

CONTEXT & RULES:
1. The text below is extracted directly from a user-provided document.
2. Summarize ONLY the provided text. Do NOT invent facts or hallucinate external information.
3. Preserve important names, dates, numbers, statistics, and technical terminology.
4. Remove irrelevant filler, fluff, and unnecessary repetition.
5. SUMMARY LENGTH: ${selectedGuide}
6. You MUST respond ONLY with a valid JSON object matching the exact format specified below.

JSON OUTPUT STRUCTURE REQUIREMENT:
{
  "summary": "Full summary text here...",
  "keyPoints": [
    "Key takeaway point 1",
    "Key takeaway point 2",
    "Key takeaway point 3",
    "Key takeaway point 4"
  ],
  "mainIdeas": [
    "Major core concept or theme 1",
    "Major core concept or theme 2",
    "Major core concept or theme 3"
  ]
}

DOCUMENT TEXT:
"""
${documentText}
"""
`.trim();
};

/**
 * Helper to parse AI JSON response safely
 */
const parseAiJsonResponse = (responseText) => {
  try {
    let cleanText = responseText.trim();
    if (cleanText.startsWith('```')) {
      cleanText = cleanText.replace(/^```(json)?\n?/, '').replace(/\n?```$/, '').trim();
    }
    const parsed = JSON.parse(cleanText);
    return {
      summary: parsed.summary || 'Summary unavailable.',
      keyPoints: Array.isArray(parsed.keyPoints) ? parsed.keyPoints : [],
      mainIdeas: Array.isArray(parsed.mainIdeas) ? parsed.mainIdeas : [],
    };
  } catch (err) {
    console.warn('[aiService JSON Parse Warning]: Failed to parse raw AI output as JSON. Using fallback text extraction.');
    return {
      summary: responseText.trim(),
      keyPoints: [
        "Extracted core insights from processed document content.",
        "Preserved key details and document context."
      ],
      mainIdeas: [
        "Main document thesis and primary topics."
      ]
    };
  }
};

/**
 * Fallback summary generator when Gemini API Key is missing or unavailable
 */
const generateFallbackSummary = (text, summaryLength) => {
  const paragraphs = text.split('\n\n').filter(p => p.trim().length > 0);
  const titleText = paragraphs[0] ? paragraphs[0].substring(0, 150) : "Document Analysis";

  let summaryParagraphs = paragraphs.slice(0, summaryLength === 'short' ? 2 : summaryLength === 'long' ? 6 : 4).join('\n\n');
  if (summaryParagraphs.length > 1500) {
    summaryParagraphs = summaryParagraphs.substring(0, 1500) + "...";
  }

  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  const samplePoints = sentences.slice(0, 4).map(s => s.trim()).filter(s => s.length > 15);

  return {
    summary: summaryParagraphs || text.substring(0, 500) + "...",
    keyPoints: samplePoints.length > 0 ? samplePoints : [
      "Extracted key factual points from provided document.",
      "Identified main content elements and structure.",
      "Processed text content successfully."
    ],
    mainIdeas: [
      `Primary Subject: ${titleText}`,
      "Document content analysis & key theme highlights.",
      "Structure and conclusion overview."
    ]
  };
};

/**
 * Main AI Summarization Entrypoint
 */
export const summarizeWithAI = async (rawDocumentText, summaryLength = 'medium') => {
  const cleanedText = cleanText(rawDocumentText);
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === '' || apiKey.includes('your_api_key_here') || apiKey.includes('your_gemini_api_key_here')) {
    console.warn('[aiService Warning]: GEMINI_API_KEY is not configured in backend/.env. Returning fallback structured summary.');
    return generateFallbackSummary(cleanedText, summaryLength);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-3.6-flash' });
    const chunks = splitTextIntoChunks(cleanedText, 12000);

    let textToAnalyze = cleanedText;

    if (chunks.length > 1) {
      console.log(`[aiService]: Document split into ${chunks.length} chunks. Processing chunk summaries...`);
      const chunkSummaries = [];
      for (let i = 0; i < chunks.length; i++) {
        const chunkPrompt = buildPrompt(chunks[i], 'short');
        const result = await model.generateContent(chunkPrompt);
        const response = await result.response;
        chunkSummaries.push(response.text());
      }
      textToAnalyze = chunkSummaries.join('\n\n');
    }

    const prompt = buildPrompt(textToAnalyze, summaryLength);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();

    return parseAiJsonResponse(responseText);

  } catch (error) {
    console.error('[aiService Gemini Error]:', error.message);
    return generateFallbackSummary(cleanedText, summaryLength);
  }
};
