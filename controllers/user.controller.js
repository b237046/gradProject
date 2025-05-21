const User = require('../models/user.model');

// Get user profile
exports.getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // Get user from database
    const user = await User.getUserById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({
      message: 'User profile retrieved successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isVerified: user.is_verified
      }
    });
  } catch (error) {
    next(error);
  }
};