const express = require('express');
const authController = require('../controllers/auth.controller');
const { protect, attachUser } = require('../middleware/auth');
const { validateBody } = require('../middleware/validate');
const { authRateLimiter } = require('../middleware/rateLimiter');
const { registerSchema, loginSchema } = require('../validators/auth.validator');

const router = express.Router();

router.use(authRateLimiter);

router.post('/register', validateBody(registerSchema), authController.register);
router.post('/login', validateBody(loginSchema), authController.login);
router.get('/me', protect, attachUser, authController.getMe);

module.exports = router;
