require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const calculateRoutes = require('./routes/calculate');
const calculationsRoutes = require('./routes/calculations');

const app = express();

// =====================
// CONFIGURATION
// =====================
const SESSION_SECRET = process.env.SESSION_SECRET || 'investment-calculator-secret-2024-fallback';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/investment-calculator';
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://investment-calculator-2-vnxg.onrender.com';
const NODE_ENV = process.env.NODE_ENV || 'production';
const PORT = process.env.PORT || 5000;

console.log('\n🔍 SERVER CONFIGURATION:');
console.log('================================');
console.log('NODE_ENV:', NODE_ENV);
console.log('SESSION_SECRET:', SESSION_SECRET ? '✅ SET' : '❌ MISSING');
console.log('MONGODB_URI:', MONGODB_URI ? '✅ SET' : '❌ MISSING');
console.log('FRONTEND_URL:', FRONTEND_URL);
console.log('================================\n');

// =====================
// MIDDLEWARE SETUP
// =====================

// CORS Configuration
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session Configuration - FIXED: Use 'secret' not 'origin'
app.use(session({
  secret: SESSION_SECRET,  // ✅ FIXED: was 'origin' before
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: MONGODB_URI,
    touchAfter: 24 * 3600,
    crypto: {
      secret: SESSION_SECRET
    }
  }),
  cookie: {
    secure: NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    sameSite: NODE_ENV === 'production' ? 'none' : 'lax'
  },
  name: 'sessionId'
}));

// Request logging
app.use((req, res, next) => {
  console.log('\n=== REQUEST ===');
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log('Session ID:', req.sessionID);
  console.log('User ID:', req.session?.userId);
  console.log('Session Data:', req.session);
  console.log('Cookies:', req.headers.cookie);
  console.log('===============\n');
  next();
});

// =====================
// DATABASE CONNECTION
// =====================

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB Connected Successfully');
    console.log('📊 Database:', mongoose.connection.name);
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  });

// =====================
// ROUTES
// =====================

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    session: !!req.session,
    authenticated: !!req.session?.userId,
    environment: NODE_ENV,
    hasSessionSecret: !!SESSION_SECRET
  });
});

// Auth routes
app.use('/api/auth', authRoutes);

// Calculate routes (with optional auth)
app.use('/api/calculate', calculateRoutes);

// Calculations management routes (requires auth)
app.use('/api/calculations', calculationsRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err);
  
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(NODE_ENV === 'development' && { stack: err.stack })
  });
});

// =====================
// START SERVER
// =====================

app.listen(PORT, () => {
  console.log('\n🚀 Investment Calculator Backend');
  console.log('================================');
  console.log(`📡 Server running on port: ${PORT}`);
  console.log(`🌍 Environment: ${NODE_ENV}`);
  console.log(`💾 Database: ${MONGODB_URI.substring(0, 50)}...`);
  console.log(`🔓 CORS enabled for: ${FRONTEND_URL}`);
  console.log(`🍪 Session: Secure=${NODE_ENV === 'production'}, SameSite=${NODE_ENV === 'production' ? 'none' : 'lax'}`);
  console.log(`🔑 Session Secret: ${SESSION_SECRET.substring(0, 20)}...`);
  console.log('================================\n');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server...');
  mongoose.connection.close(() => {
    console.log('Database connection closed');
    process.exit(0);
  });
});

module.exports = app;
