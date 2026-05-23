const ApiError = require('../utils/ApiError');

/**
 * Simple in-memory rate limiter for auth routes (no extra dependency).
 */
function createRateLimiter({ windowMs = 15 * 60 * 1000, max = 20 } = {}) {
  const hits = new Map();

  return (req, _res, next) => {
    const key = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const entry = hits.get(key) || { count: 0, resetAt: now + windowMs };

    if (now > entry.resetAt) {
      entry.count = 0;
      entry.resetAt = now + windowMs;
    }

    entry.count += 1;
    hits.set(key, entry);

    if (entry.count > max) {
      return next(
        new ApiError(429, 'Too many requests. Please try again later.')
      );
    }

    next();
  };
}

const authRateLimiter = createRateLimiter({ windowMs: 15 * 60 * 1000, max: 30 });

/**
 * Per-user rate limiter (requires auth middleware before this).
 */
function createUserRateLimiter({ windowMs = 60 * 1000, max = 1 } = {}) {
  const hits = new Map();

  return (req, _res, next) => {
    const key = req.user?.id ? String(req.user.id) : req.ip || 'unknown';
    const now = Date.now();
    const entry = hits.get(key) || { count: 0, resetAt: now + windowMs };

    if (now > entry.resetAt) {
      entry.count = 0;
      entry.resetAt = now + windowMs;
    }

    entry.count += 1;
    hits.set(key, entry);

    if (entry.count > max) {
      return next(
        new ApiError(
          429,
          'Financial health assessment rate limit exceeded. Try again in one minute.'
        )
      );
    }

    next();
  };
}

const aiFinancialHealthRateLimiter = createUserRateLimiter({
  windowMs: 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 3 : 10,
});

module.exports = {
  createRateLimiter,
  createUserRateLimiter,
  authRateLimiter,
  aiFinancialHealthRateLimiter,
};
