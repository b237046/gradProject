const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const emailService = require('../utils/emailService');
const { generateVerificationCode } = require('../utils/helpers');

// Register a new user
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    // Generate verification code
    const verificationCode = generateVerificationCode();
    
    // Set code expiry (30 minutes from now)
    const codeExpiry = new Date();
    codeExpiry.setMinutes(codeExpiry.getMinutes() + 30);

    // Create new user
    const newUser = new User({
      name,
      email,
      password,
      verification_code: verificationCode,
      code_expiry: codeExpiry
    });

    // Save user to database
    const userId = await newUser.save();

    // Send verification email
    await emailService.sendVerificationEmail(email, verificationCode);

    res.status(201).json({
      message: 'User registered successfully. Please check your email for verification code.',
      userId
    });
  } catch (error) {
    next(error);
  }
};

// Verify email with code
exports.verifyEmail = async (req, res, next) => {
  try {
    const { email, code } = req.body;

    // Verify the code
    const isVerified = await User.verifyEmail(email, code);

    if (!isVerified) {
      return res.status(400).json({ message: 'Invalid or expired verification code' });
    }

    res.status(200).json({ message: 'Email verified successfully. You can now log in.' });
  } catch (error) {
    next(error);
  }
};

// Resend verification code
exports.resendVerificationCode = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if already verified
    if (user.is_verified) {
      return res.status(400).json({ message: 'Email is already verified' });
    }

    // Generate new verification code
    const verificationCode = generateVerificationCode();
    
    // Set code expiry (30 minutes from now)
    const codeExpiry = new Date();
    codeExpiry.setMinutes(codeExpiry.getMinutes() + 30);

    // Update verification code
    await User.updateVerificationCode(email, verificationCode, codeExpiry);

    // Send verification email
    await emailService.sendVerificationEmail(email, verificationCode);

    res.status(200).json({ message: 'Verification code sent. Please check your email.' });
  } catch (error) {
    next(error);
  }
};

// Login user
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if email is verified
    if (!user.is_verified) {
      return res.status(403).json({ message: 'Email not verified. Please verify your email to log in.' });
    }

    // Check password
    if (password !== user.password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      token
    });
  } catch (error) {
    next(error);
  }
};