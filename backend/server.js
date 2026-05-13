import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// 1. Initial Setup & Env Configuration
// Environment variables are now loaded via the side-effect import at the top.

import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import invoiceRoutes from './routes/invoiceRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import clientRoutes from './routes/clientRoutes.js';
import productRoutes from './routes/productRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import AppError from './utils/AppError.js';
import errorMiddleware from './middleware/errorMiddleware.js';

// Safety check for production: Never run without a JWT secret.
if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
  console.error('FATAL CONFIG ERROR: JWT_SECRET must be defined in production for security.');
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5001; // Default to 5001 to avoid common macOS port conflicts

// 2. Middleware & Security Layer
// We prioritize security by setting headers early and limiting request sizes.
app.set('trust proxy', 1); // Necessary for accurate rate limiting when deployed behind proxies like Render/Vercel.

app.use(helmet({
  contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
  crossOriginResourcePolicy: false,
}));

// We restrict body size to 10kb to mitigate potential payload-based DOS attacks.
app.use(express.json({ limit: '10kb' }));

// 3. CORS Management
// We maintain a strict whitelist in production but remain flexible during local development.
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5175',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl) and check against whitelist.
    if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('Access blocked by CORS policy: Origin not authorized.'));
    }
  },
  credentials: true
}));

// 4. API Resilience (Rate Limiting)
// Prevents brute-force attacks and ensures API stability under heavy load.
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minute window
  max: process.env.NODE_ENV === 'production' ? 100 : 1000,
  message: { success: false, error: 'Request threshold reached. Please try again in 15 minutes.' }
});
app.use('/api', limiter);

// 5. Route Definitions
// Standard health-check for automated monitoring systems.
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'UP', 
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString() 
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/generate', aiRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/products', productRoutes);
app.use('/api/analytics', analyticsRoutes);

// 6. Global Fallback & Error Handling
// Catch-all for undefined routes.
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Resource not found: ${req.originalUrl}`
  });
});

// Centralized error handler to ensure consistent JSON responses for all failures.
app.use(errorMiddleware);

// 7. Server Bootstrapping
// We listen on the port FIRST to signal "Readiness" to deployment platforms (like Render),
// then initialize the database connection asynchronously.
app.listen(PORT, () => {
  console.log(`\n🚀 VyaparFlow API is live on port ${PORT}`);
  console.log(`📅 Started at: ${new Date().toLocaleString()}\n`);
  
  connectDB().catch(err => {
    console.error("CRITICAL: Database initialization failed during startup:");
    console.error(err);
  });
});
