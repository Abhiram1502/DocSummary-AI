# DocSummary AI

**DocSummary AI** is an AI-powered document summarization single-page web application. It extracts text from PDF documents and images (via OCR), normalizes content, and generates executive summaries, key takeaways, and major ideas.

---

## Features

- **Single-Page Application (SPA)**: Zero page reloads; complete workflow happens on a unified interface.
- **Document Text Extraction**: Extract clean text from multi-page PDFs using `pdf-parse`.
- **OCR Image Recognition**: Recognizes text in images (PNG, JPG, JPEG, WEBP) using `Tesseract.js`.
- **Customizable Summary Length**: Choose between **Short**, **Medium**, or **Long** output depth.
- **AI Intelligence**: Structured JSON generation via Google Gemini API (`summary`, `keyPoints`, `mainIdeas`).
- **Interactive Actions**:
  - One-click copy for complete formatted summary (`DocSummary AI`, document name, summary, key points, main ideas).
  - Download formatted plain text (`.txt`).
  - Client-side PDF generation (`.pdf`) using `jsPDF`.
  - One-click state reset to summarize additional documents seamlessly.
- **Developer-Tool Dark UI**: Modern dark charcoal theme (`#2b2b2b`) with vibrant magenta accent (`#f20a67`).

---

## Tech Stack

### Frontend
- **React 18** (Functional components & hooks)
- **Vite** (Build tool & fast HMR server)
- **Axios** (HTTP client for API requests)
- **jsPDF** (Client-side PDF document generation)
- **Vanilla CSS** (CSS Variables & Responsive layout)

### Backend
- **Node.js & Express.js** (REST API)
- **Multer** (Multipart form file upload middleware)
- **pdf-parse** (PDF text extraction)
- **Tesseract.js** (OCR optical character recognition for images)
- **@google/generative-ai** (Google Gemini AI API integration)

---

## Project Structure

```text
DocSummary-AI/
│
├── frontend/
│   ├── public/
│   │   └── logo.png              # Custom branding logo (190x52px / 150x44px mobile)
│   │
│   ├── src/
│   │   ├── assets/               # Media & static resources
│   │   ├── components/
│   │   │   ├── Navbar.jsx            # Top navbar containing ONLY logo branding
│   │   │   ├── DocumentUpload.jsx    # Single-icon drag-and-drop file uploader
│   │   │   ├── SummaryOptions.jsx    # Selectable Short / Medium / Long controls
│   │   │   ├── ProcessingState.jsx   # Animated progress stage indicators
│   │   │   ├── SummaryResult.jsx     # Executive summary card
│   │   │   ├── KeyPoints.jsx         # Bullet list of key takeaways
│   │   │   ├── MainIdeas.jsx         # Card of core conceptual ideas
│   │   │   ├── ResultActions.jsx     # Copy, Download PDF / TXT & Reset buttons
│   │   │   └── ErrorMessage.jsx      # Alert message banner
│   │   │
│   │   ├── services/
│   │   │   └── api.js                # Axios service calling POST /api/summary
│   │   │
│   │   ├── App.jsx               # Master SPA container & state orchestrator
│   │   ├── main.jsx              # React DOM mounting entrypoint
│   │   └── index.css             # Global dark design system
│   │
│   ├── index.html                # Main HTML entry template
│   ├── package.json              # Frontend scripts & dependencies
│   └── vite.config.js            # Vite configuration
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── summaryController.js  # Controller handling file upload & summary flow
│   │   │
│   │   ├── routes/
│   │   │   └── summaryRoutes.js      # Endpoint route definition (POST /api/summary)
│   │   │
│   │   ├── services/
│   │   │   ├── pdfService.js         # PDF text extraction via pdf-parse
│   │   │   ├── ocrService.js         # Image OCR recognition via Tesseract.js
│   │   │   ├── aiService.js          # Gemini AI integration with chunking & JSON parser
│   │   │   └── textService.js        # Text cleaning, validation & chunk splitter
│   │   │
│   │   ├── middleware/
│   │   │   ├── uploadMiddleware.js   # Multer file handler (25MB limit)
│   │   │   └── errorMiddleware.js    # Express error handler
│   │   │
│   │   ├── config/
│   │   │   └── env.js                # Environment variable loader
│   │   │
│   │   └── server.js                 # Express server startup entrypoint
│   │
│   ├── uploads/
│   │   └── .gitkeep                  # Temporary file upload directory
│   │
│   ├── .env                      # Local environment configuration
│   ├── .env.example              # Sample environment template
│   └── package.json              # Backend scripts & dependencies
│
├── .gitignore                    # Version control exclusion rules
└── README.md                     # Documentation
```

---

## Setup & Running Locally

### Prerequisites

- Node.js (v18.0.0 or higher)
- npm or pnpm

### Environment Variables Setup

1. Navigate to the `backend` directory.
2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Add your Google Gemini API key:
   ```env
   PORT=5000
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   ```

### Running the Backend

```bash
cd backend
npm install
npm run dev
```

*The Express backend server will listen on `http://localhost:5000`.*

### Running the Frontend

```bash
cd frontend
npm install
npm run dev
```

*The Vite dev server will run on `http://localhost:5173`.*
