require("dotenv").config()
const ApiError = require('../utils/ApiError');

const REQUIRED_VARS = ['MONGODB_URI', 'JWT_SECRET'];

/**
 * Validate required environment variables at startup.
 */
function validateEnv() {
  const missing = REQUIRED_VARS.filter((key) => !process.env[key]);

  if (missing.length) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }

  if (process.env.JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters');
  }

  if (process.env.NODE_ENV === 'production' && !process.env.CLIENT_URL) {
    throw new Error('CLIENT_URL is required in production for CORS');
  }
}

function getJwtExpiresIn() {
  return process.env.JWT_EXPIRES_IN || '7d';
}

module.exports = { validateEnv, getJwtExpiresIn };
