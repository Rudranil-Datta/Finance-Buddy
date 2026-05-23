const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');
const { User } = require('../models');

/**
 * Verify JWT from Authorization: Bearer <token> and attach req.user.
 */
function protect(req, _res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return next(new ApiError(401, 'Authentication required'));
  }

  const token = header.split(' ')[1];

  if (!token) {
    return next(new ApiError(401, 'Authentication required'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.id) {
      return next(new ApiError(401, 'Invalid token payload'));
    }

    req.user = { id: decoded.id, email: decoded.email };
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new ApiError(401, 'Token expired. Please log in again.'));
    }
    return next(new ApiError(401, 'Invalid or expired token'));
  }
}

/**
 * Load full user document after protect (for /me and routes needing userDoc).
 */
async function attachUser(req, _res, next) {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.isActive) {
      return next(new ApiError(401, 'User not found or inactive'));
    }
    req.userDoc = user;
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = { protect, attachUser };
