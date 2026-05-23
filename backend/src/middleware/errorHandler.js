const ApiError = require('../utils/ApiError');

function notFoundHandler(req, res, next) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

function normalizeError(err) {
  if (err instanceof ApiError) {
    return err;
  }

  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors)
      .map((e) => e.message)
      .join('; ');
    return new ApiError(400, message);
  }

  if (err.name === 'CastError') {
    return new ApiError(400, 'Invalid resource identifier');
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || 'field';
    return new ApiError(409, `${field} already exists`);
  }

  if (err.message && err.message.startsWith('CORS blocked')) {
    return new ApiError(403, err.message);
  }

  return err;
}

function errorHandler(err, req, res, _next) {
  const normalized = normalizeError(err);
  const statusCode = normalized.statusCode || 500;
  const message = normalized.isOperational
    ? normalized.message
    : 'Internal server error';

  if (process.env.NODE_ENV !== 'production' && !normalized.isOperational) {
    console.error(normalized);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== 'production' &&
    normalized.stack &&
    !normalized.isOperational
      ? { stack: normalized.stack }
      : {}),
  });
}

module.exports = { notFoundHandler, errorHandler };
