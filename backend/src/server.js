require('dotenv').config();

const express = require('express');

const { validateEnv } = require('./config/env');
const { connectDatabase } = require('./config/db');
const apiRoutes = require('./routes');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');
const {
  configureHelmet,
  configureCors,
  configureApiRateLimit,
  configureMongoSanitize,
  configureTrustProxy,
} = require('./middleware/security');

validateEnv();

const app = express();

const PORT = Number(process.env.PORT) || 4000;

configureTrustProxy(app);

/**
 * Security headers
 */
app.use(configureHelmet());

/**
 * CORS — production: CLIENT_URL only; dev: local Vite origins
 */
app.use(configureCors());

/**
 * Body parsers (must run before mongo-sanitize)
 */
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

/**
 * NoSQL injection protection on body, query, and params
 */
app.use(configureMongoSanitize());

/**
 * Global API rate limit: 100 requests / 15 min per IP
 */
app.use('/api', configureApiRateLimit());

/**
 * Health/test route (also covered by /api/health via router)
 */
app.get('/api/test', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Backend working',
  });
});

app.use('/api', apiRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

async function startServer() {
  try {
    await connectDatabase();
    console.log('MongoDB connected');

    const server = app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/api/health`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(
          `Port ${PORT} is already in use. Set a different PORT in .env.`
        );
      } else {
        console.error('Server failed to start:', err.message);
      }
      process.exit(1);
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

module.exports = app;
