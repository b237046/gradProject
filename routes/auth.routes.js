const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/auth.controller');
const validateRequest = require('../middlewares/validateRequest');
const rateLimiter = require('../middlewares/rateLimiter');

const router = express.Router();

// Register user
router.post(
  '/register',
  [
    body('name')
      .trim()
      .isLength({ min: 2 })
      .withMessage('Name must be at least 2 characters long'),
    body('email')
      .isEmail()
      .withMessage('Please provide a valid email'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
      .matches(/\d/)
      .withMessage('Password must contain at least one number')
      .matches(/[A-Z]/)
      .withMessage('Password must contain at least one uppercase letter')
  ],
  validateRequest,
  rateLimiter(10, 60 * 60 * 1000), // 10 requests per hour
  authController.register
);

// Verify email
router.post(
  '/verify-email',
  [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('code').isLength({ min: 6, max: 6 }).withMessage('Please provide a valid 6-digit code')
  ],
  validateRequest,
  rateLimiter(10, 60 * 60 * 1000), // 10 requests per hour
  authController.verifyEmail
);

// Resend verification code
router.post(
  '/resend-verification',
  [
    body('email').isEmail().withMessage('Please provide a valid email')
  ],
  validateRequest,
  rateLimiter(5, 60 * 60 * 1000), // 5 requests per hour
  authController.resendVerificationCode
);

// Login user
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').exists().withMessage('Password is required')
  ],
  validateRequest,
  rateLimiter(10, 15 * 60 * 1000), // 10 requests per 15 minutes
  authController.login
);

module.exports = router;