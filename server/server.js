import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import templateRoutes from './routes/templateRoutes.js';
import posterRoutes from './routes/posterRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

// Middleware Imports
import { errorHandler } from './middleware/errorHandler.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Global Middlewares (CORS configured for any origin to prevent Failed to fetch)
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Connect Database
connectDB();

// Healthcheck Route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Zynexta Smart Poster Studio Express REST API',
    timestamp: new Date(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/posters', posterRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/uploads', uploadRoutes);

// Error Handler Middleware
app.use(errorHandler);

// Start Express Server
if (process.env.NODE_ENV !== 'test') {
  const server = app.listen(PORT, () => {
    console.log(`🚀 Zynexta Smart Poster Studio Express API server running on port ${PORT}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`⚠️ Port ${PORT} is already running on http://localhost:${PORT}!`);
    } else {
      console.error('Server error:', err);
    }
  });
}

export default app;
