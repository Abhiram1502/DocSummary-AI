import express from 'express';
import cors from 'cors';
import { config } from './config/env.js';
import summaryRoutes from './routes/summaryRoutes.js';
import { errorHandler } from './middleware/errorMiddleware.js';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'DocSummary AI Backend is running.',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/summary', summaryRoutes);

// Error Middleware
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || config.port;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[DocSummary AI Backend] Server running on port ${PORT}`);
});