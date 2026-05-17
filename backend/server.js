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
const REQUIRED_ENV = ['JWT_SECRET', 'JWT_REFRESH_SECRET', 'DATABASE_URL', 'FRONTEND_URL'];
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

// Temporary Debug Middleware
app.use((req, res, next) => {
  console.log("Origin:", req.headers.origin);
  next();
});

const allowedOrigins = [
  "https://vyaparflow-vert.vercel.app",
  "https://vyaparrflow-vert.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000"
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("CORS not allowed"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.options(/.*/, cors());

// 3. Data Parsing & Sanitization
app.use(cookieParser());
app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ extended: true, limit: '50kb' }));

// 5. Global API Resilience (Rate Limiting)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 300 : 10000, // Balanced for SaaS usage
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Take a deep breath and try again soon.' }
});

// 6. Monitoring & Health
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'UP', 
    uptime: process.uptime(),
    timestamp: new Date().toISOString() 
  });
});

// 7. Route Orchestration (Centralized API Router)
const apiRouter = express.Router();

// Apply Rate Limiting to all API routes
// apiRouter.use(apiLimiter);

// Mount Feature Routes
apiRouter.use('/auth', authRoutes);
apiRouter.use('/invoices', invoiceRoutes);
apiRouter.use('/generate', aiRoutes);
apiRouter.use('/clients', clientRoutes);
apiRouter.use('/products', productRoutes);
apiRouter.use('/analytics', analyticsRoutes);
apiRouter.use('/audit', auditRoutes);

// Mount the API Router to the main app
app.use('/api', apiRouter);

// 8. Fallback & Global Error Pipeline
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Resource [${req.originalUrl}] does not exist.` });
});

app.use(errorMiddleware);

/**
 * STARTUP PHASE
 */
const server = app.listen(PORT, '0.0.0.0', async () => {
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
