import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import rtracer from 'cls-rtracer';

import { connectDB } from './config/db.js';
import logger from './utils/LoggerService.js';
import AuditService from './services/AuditService.js';
import errorMiddleware from './middleware/errorMiddleware.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import invoiceRoutes from './routes/invoiceRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import clientRoutes from './routes/clientRoutes.js';
import productRoutes from './routes/productRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import auditRoutes from './routes/auditRoutes.js';

/**
 * PRODUCTION-READY BOOTSTRAP SEQUENCE
 */

// Critical Env Validation
const REQUIRED_ENV = ['JWT_SECRET', 'REFRESH_SECRET', 'DATABASE_URL', 'FRONTEND_URL'];
const missing = REQUIRED_ENV.filter(key => !process.env[key]);
if (missing.length > 0 && process.env.NODE_ENV === 'production') {
  console.error(`CRITICAL ERROR: Missing required environment variables: ${missing.join(', ')}`);
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5001;

// 1. Core Platform Security
// Set security headers via Helmet and handle trust-proxy for deployments (Render/Vercel)
app.set('trust proxy', 1);
app.use(helmet({
  contentSecurityPolicy: false, // Managed by frontend if needed
  crossOriginResourcePolicy: false,
}));

// 2. Request Identification & Logging
// We tag every request with a unique ID for end-to-end tracing
app.use(rtracer.expressMiddleware());
app.use(morgan((tokens, req, res) => {
  return [
    `[${rtracer.id()}]`,
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms'
  ].join(' ');
}, { stream: { write: message => logger.info(message.trim()) } }));

// 3. Data Parsing & Sanitization
app.use(cookieParser());
app.use(express.json({ limit: '50kb' })); // Increased slightly for bulk product uploads
app.use(express.urlencoded({ extended: true, limit: '50kb' }));

// 4. Multi-Origin CORS Management
const whitelist = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (like AI agents or system pings)
    if (!origin || whitelist.includes(origin) || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      logger.warn(`Blocked Request from unauthorized origin: ${origin}`);
      callback(new Error('CORS Access Denied'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// 5. Global API Resilience (Rate Limiting)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 300 : 10000, // Balanced for SaaS usage
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Take a deep breath and try again soon.' }
});
app.use('/api', apiLimiter);

// 6. Monitoring & Health
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'UP', 
    uptime: process.uptime(),
    timestamp: new Date().toISOString() 
  });
});

// 7. Route Orchestration
app.use('/api/auth', authRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/generate', aiRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/products', productRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/audit', auditRoutes);

// 8. Fallback & Global Error Pipeline
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Resource [${req.originalUrl}] does not exist.` });
});

app.use(errorMiddleware);

/**
 * STARTUP PHASE
 */
const server = app.listen(PORT, async () => {
  logger.info(`VyaparFlow SaaS Architecture Online [Port: ${PORT}]`);
  
  try {
    await connectDB();
    logger.info('Database subsystems initialized successfully.');
    
    // Log the system startup event
    await AuditService.log(null, 'SYSTEM_STARTUP', 'PLATFORM', null, { 
      port: PORT, 
      env: process.env.NODE_ENV 
    });
  } catch (err) {
    logger.error('CRITICAL: Service degradation during database connection:', err);
  }
});

// Graceful Shutdown Support
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    logger.info('Process terminated.');
  });
});
