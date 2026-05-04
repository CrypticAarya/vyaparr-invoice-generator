import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// Environment variable initialization
dotenv.config();

import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import invoiceRoutes from './routes/invoiceRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import clientRoutes from './routes/clientRoutes.js';
import productRoutes from './routes/productRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';

// Ensure the application fails fast if critical configuration is missing
if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
  console.error('FATAL ERROR: JWT_SECRET must be defined in production environments.');
  process.exit(1);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Application instantiation
const app = express();
const PORT = process.env.PORT || 5000;

// ======================================
// 1. Core Middleware
// ======================================
app.use(helmet()); 
app.use(express.json()); 
app.use(cors({
  origin: (origin, callback) => {
    const developmentOrigins = [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      'http://localhost:5176'
    ];
    
    if (!origin || developmentOrigins.includes(origin) || origin === process.env.FRONTEND_URL) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked request from origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// ======================================
// 2. Security: Rate Limiting
// ======================================
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: { success: false, error: 'Too many authentication attempts. Please try again later.' }
});

const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, 
  max: 50, 
  message: { success: false, error: 'AI processing quota reached. Please wait.' }
});

app.use('/api/auth/', authLimiter);
app.use('/api/generate', aiLimiter);

// ======================================
// 3. Application Routing 
// ======================================
app.get('/', (req, res) => {
  res.send("API is running 🚀");
});

app.get('/api/test', (req, res) => {
  res.json({ success: true, message: 'API Gateway is Operational' });
});

app.use('/api/auth', authRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/generate', aiRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/products', productRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/invoices', invoiceRoutes);

// ======================================
// 4. Fallback Route
// ======================================
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ======================================
// 5. Server Startup Pattern
// ======================================
async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
