const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');
const { getJwtExpiresIn } = require('../config/env');
const { User } = require('../models');
const categoryService = require('./category.service');

const SALT_ROUNDS = 12;

function signToken(userId, email) {
  return jwt.sign({ id: userId.toString(), email }, process.env.JWT_SECRET, {
    expiresIn: getJwtExpiresIn(),
  });
}

function formatUser(user) {
  return {
    id: user._id,
    email: user.email,
    name: user.name,
    currency: user.currency,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

/**
 * Register a new user with bcrypt-hashed password.
 */
async function register({ email, password, name, currency }) {
  const existing = await User.findOne({ email });
  if (existing) {
    throw new ApiError(409, 'Email already registered');
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await User.create({
    email,
    passwordHash,
    name,
    currency,
  });

  await categoryService.ensureDefaultCategories(user._id);

  const token = signToken(user._id, user.email);

  return { user: formatUser(user), token };
}

/**
 * Authenticate user and return JWT.
 */
async function login({ email, password }) {
  const user = await User.findOne({ email }).select('+passwordHash');

  if (!user || !user.isActive) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const token = signToken(user._id, user.email);

  return { user: formatUser(user), token };
}

/**
 * Return current authenticated user profile.
 */
async function getMe(userId) {
  const user = await User.findById(userId);

  if (!user || !user.isActive) {
    throw new ApiError(404, 'User not found');
  }

  return formatUser(user);
}

module.exports = { register, login, getMe, formatUser };
