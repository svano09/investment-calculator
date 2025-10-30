const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const calculateRoutes = require('./routes/calculate');
const calculationsRoutes = require('./routes/calculations');

const app = express();

// =====================
// MIDDLEWARE SETUP
// =====================

// CORS Configuration - CRITICAL for session cookies
app.use(cors({
  origin: 'http://localhost:5173', // Vite default port
  credentials: true, // Allow cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session Configuration - FIXED
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-super-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/investment-calculator',
    touchAfter: 24 * 3600, // Lazy session update (24 hours)
    crypto: {
      secret: process.env.SESSION_SECRET || 'your-super-secret-key-change-in-production'
    }
  }),
  cookie: {
    secure: false, // false for development (HTTP), true for production (HTTPS)
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    sameSite: 'lax' // lax for development
  },
  name: 'sessionId' // Custom cookie name
}));

// Request logging - Enhanced
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


// DATABASE CONNECTION


const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/investment-calculator';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB Connected Successfully');
    console.log('📊 Database:', mongoose.connection.name);
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  });


// ROUTES


// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    session: !!req.session,
    authenticated: !!req.session?.userId
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
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});


// START SERVER


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('\n🚀 Investment Calculator Backend');
  console.log('================================');
  console.log(`📡 Server running on: http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`💾 Database: ${MONGODB_URI}`);
  console.log(`🔓 CORS enabled for: http://localhost:5173`);
  console.log(`🍪 Session: Secure=false, SameSite=lax`);
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
