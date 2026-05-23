const helmet = require('helmet');
const cors = require('cors');
const { sanitize: sanitizeMongo, has: hasMongoInjection } = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');

const isProduction = process.env.NODE_ENV === 'production';

/**
 * Allowed browser origins. Production: CLIENT_URL only.
 * Development: CLIENT_URL plus common local Vite ports.
 */
function getAllowedOrigins() {
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

  if (isProduction) {
    if (!process.env.CLIENT_URL) {
      console.warn(
        'Warning: CLIENT_URL is not set in production — CORS will block browser requests.'
      );
    }
    return [clientUrl];
  }

  return [
    clientUrl,
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5174',
  ];
}

function configureHelmet() {
  return helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: isProduction ? undefined : false,
  });
}

function configureCors() {
  const allowedOrigins = getAllowedOrigins();

  return cors({
    origin(origin, callback) {
      // Same-origin tools, curl, Postman, server-to-server
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  });
}

/**
 * Global API rate limit per IP.
 * Development: generous limit (React Strict Mode + dashboard fan-out can exceed 100 quickly).
 * Production: 100 requests / 15 minutes.
 */
function configureApiRateLimit() {
  const isProduction = process.env.NODE_ENV === 'production';

  return rateLimit({
    windowMs: 15 * 60 * 1000,
    max: isProduction ? 100 : 1000,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      message: isProduction
        ? 'Too many requests. Please try again in 15 minutes.'
        : 'Too many requests (dev limit). Wait a moment or restart the backend.',
    },
  });
}

/**
 * Strip keys that start with $ or contain . (NoSQL injection).
 * Must run after express.json() / express.urlencoded().
 *
 * express-mongo-sanitize's default middleware assigns req.query = target, which
 * throws on Express 5 (query is getter-only). We sanitize body/params/query in place.
 */
function configureMongoSanitize() {
  const options = { replaceWith: '_' };

  return function mongoSanitizeMiddleware(req, _res, next) {
    for (const targetKey of ['body', 'params', 'query']) {
      const target = req[targetKey];
      if (!target || typeof target !== 'object') {
        continue;
      }

      if (hasMongoInjection(target)) {
        sanitizeMongo(target, options);
        if (process.env.NODE_ENV !== 'production') {
          console.warn(
            `Sanitized suspicious field(s) in req.${targetKey} on ${req.method} ${req.path}`
          );
        }
      }
    }
    next();
  };
}

function configureTrustProxy(app) {
  if (isProduction) {
    app.set('trust proxy', 1);
  }
}

module.exports = {
  isProduction,
  configureHelmet,
  configureCors,
  configureApiRateLimit,
  configureMongoSanitize,
  configureTrustProxy,
};
