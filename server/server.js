const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Load env variables
dotenv.config();

const app = express();

const { connectDb } = require("./utils/db");

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", "https://api.cloudinary.com", "https://maps.googleapis.com"],
      imgSrc: ["'self'", "data:", "https://res.cloudinary.com", "https://images.unsplash.com"],
      scriptSrc: ["'self'", "https://maps.googleapis.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
    },
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to all requests
app.use('/api/', limiter);

// Stricter rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    error: 'Too many authentication attempts from this IP, please try again later.',
  },
  skipSuccessfulRequests: true,
});

// CORS configuration
const corsOptions = {
  origin: [
    process.env.CLIENT_URL || 'http://localhost:3000',
    'http://localhost:3000',
    'http://127.0.0.1:3000'
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Agricultural Land Marketplace API',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Import routes
const userRoutes = require('./routes/userRoutes');
const landRoutes = require('./routes/landRoutes');
const inquiryRoutes = require('./routes/inquiryRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');

// API routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/lands', landRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin', adminRoutes);

// Legacy route support (for backward compatibility)
app.use('/api/properties', landRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Agricultural Land Marketplace API',
    version: '1.0.0',
    documentation: '/api/docs',
    status: 'operational',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      users: '/api/users',
      lands: '/api/lands',
      inquiries: '/api/inquiries',
      upload: '/api/upload',
      admin: '/api/admin'
    }
  });
});

// API documentation endpoint
app.get('/api/docs', (req, res) => {
  res.json({
    title: 'Agricultural Land Marketplace API Documentation',
    version: '1.0.0',
    description: 'API for buying, selling, and leasing agricultural land',
    baseURL: req.protocol + '://' + req.get('host') + '/api',
    endpoints: {
      authentication: {
        register: 'POST /auth/register',
        login: 'POST /auth/login',
        googleAuth: 'POST /auth/google',
        refreshToken: 'POST /auth/refresh',
        logout: 'POST /auth/logout'
      },
      lands: {
        getAll: 'GET /lands',
        search: 'GET /lands/search',
        getFeatured: 'GET /lands/featured',
        getNearby: 'GET /lands/nearby',
        getById: 'GET /lands/:id',
        create: 'POST /lands',
        updateMy: 'PUT /lands/my/:id',
        deleteMy: 'DELETE /lands/my/:id',
        saveLand: 'POST /lands/:id/save',
        getMySaved: 'GET /lands/saved/my'
      },
      inquiries: {
        create: 'POST /lands/:id/inquire',
        getSent: 'GET /lands/inquiries/sent',
        getReceived: 'GET /lands/inquiries/received',
        reply: 'POST /lands/inquiries/:inquiryId/reply'
      },
      admin: {
        getPendingLands: 'GET /lands/admin/pending',
        approveLand: 'POST /lands/admin/:id/approve',
        rejectLand: 'POST /lands/admin/:id/reject',
        getAnalytics: 'GET /lands/admin/analytics'
      }
    },
    authentication: 'Bearer token required for protected routes',
    rateLimit: '100 requests per 15 minutes per IP (5 for auth endpoints)'
  });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
    endpoint: req.originalUrl,
    method: req.method,
    availableEndpoints: '/api/docs'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: errors
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: `${field} already exists`,
      field: field
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired'
    });
  }

  // Multer errors (file upload)
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'File size too large'
    });
  }

  if (err.code === 'LIMIT_FILE_COUNT') {
    return res.status(400).json({
      success: false,
      message: 'Too many files uploaded'
    });
  }

  // Default error
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

const port = process.env.PORT || 5000;

connectDb().then(() => {
  app.listen(port, () => {
    console.log(`
🚀 Agricultural Land Marketplace API Server Started
📍 Server running on port ${port}
🌐 Environment: ${process.env.NODE_ENV || 'development'}
🔗 API URL: http://localhost:${port}
📚 Documentation: http://localhost:${port}/api/docs
💚 Health Check: http://localhost:${port}/health
    `);
  });
}).catch((error) => {
  console.error('Failed to connect to database:', error);
  process.exit(1);
});