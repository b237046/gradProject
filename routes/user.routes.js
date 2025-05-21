const express = require('express');
const userController = require('../controllers/user.controller');
const authenticateJWT = require('../middlewares/authenticateJWT');

const router = express.Router();

// Protected route - Get user profile
router.get('/profile', authenticateJWT, userController.getProfile);

module.exports = router;