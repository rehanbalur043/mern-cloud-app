require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const promBundle = require('express-prom-bundle');
const { connectDB, sequelize } = require('./config/database');  // ✅ FIXED
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5001;
connectDB();


const metricsMiddleware = promBundle({
  includeMethod: true,
  includePath: true,
  includeStatusCode: true,
  includeUp: true,
  customLabels: { service: 'auth-service' },
  promClient: {
    collectDefaultMetrics: {
      timeout: 1000
    }
  }
});

app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['http://localhost:3000', 'http://frontend:80']
    : true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(metricsMiddleware);

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const result = await sequelize.query('SELECT 1 as healthy');
    res.status(200).json({
      status: 'UP',
      service: 'auth-service',
      database: 'PostgreSQL',
      tables: ['Users'],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      status: 'DOWN',
      service: 'auth-service',
      error: error.message
    });
  }
});

// API Routes
app.use('/api/auth', authRoutes);

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing PostgreSQL connections...');
  await sequelize.close();
  process.exit(0);
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    ...(process.env.NODE_ENV === 'development' && { error: err.message })
  });
});

const server = app.listen(PORT, () => {
  console.log(`🚀 Auth Service running on port ${PORT}`);
  console.log(`📊 Metrics: http://localhost:${PORT}/metrics`);
  console.log(`🏥 Health: http://localhost:${PORT}/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
});

// Remove ALL shutdown handlers - simple exit
process.on('SIGTERM', () => {
  console.log('SIGTERM - exiting');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT - exiting');
  process.exit(0);
});

