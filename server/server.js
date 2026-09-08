import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { connectDB } from './config/db.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import templateRoutes from './routes/templateRoutes.js';
import posterRoutes from './routes/posterRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import shareLinkRoutes from './routes/shareLinkRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';

// Middleware Imports
import { errorHandler } from './middleware/errorHandler.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security Headers via Helmet
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false, // CSP disabled on API server to prevent breaking cross-domain image exports
  })
);

// Rate Limiters
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests from this IP, please try again later.' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // 20 login attempts per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many login attempts. Please try again after 15 minutes.' },
});

const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50, // 50 uploads per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Upload limit reached. Please try again later.' },
});

// Configured CORS
const allowedOrigins = [
  'https://www.jksocialspark.in',
  'https://jksocialspark.in',
  'http://localhost:5173',
  'http://localhost:3000',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        callback(null, true); // Permissive fallback to prevent breaking shop previews while logging
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(generalLimiter);

// Connect Database
connectDB();

// Healthcheck Route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'JK SocialSpark Express REST API',
    timestamp: new Date(),
    environment: process.env.VERCEL_ENV || process.env.NODE_ENV || 'development',
  });
});

// API Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/posters', posterRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/uploads', uploadLimiter, uploadRoutes);
app.use('/api/sharelinks', shareLinkRoutes);
app.use('/api/analytics', analyticsRoutes);

// Error Handler Middleware
app.use(errorHandler);

// Start Express Server
if (process.env.NODE_ENV !== 'test') {
  const server = app.listen(PORT, () => {
    console.log(`🚀 JK SocialSpark Express API server running on port ${PORT}`);
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
