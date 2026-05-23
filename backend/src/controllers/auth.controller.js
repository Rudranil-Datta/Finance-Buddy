const authService = require('../services/auth.service');
const asyncHandler = require('../utils/asyncHandler');

/**
 * POST /api/auth/register
 */
const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  res.status(201).json({ success: true, data: result });
});

/**
 * POST /api/auth/login
 */
const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  res.json({ success: true, data: result });
});

/**
 * GET /api/auth/me — current authenticated user
 */
const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getMe(req.user.id);
  res.json({ success: true, data: user });
});

module.exports = { register, login, getMe };
