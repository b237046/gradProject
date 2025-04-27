const rateLimit = require('express-rate-limit');

// Create rate limiter middleware
module.exports = (maxRequests, windowMs) => {
  return rateLimit({
    windowMs: windowMs || 60 * 60 * 1000, // Default: 1 hour
    max: maxRequests || 100, // Default: 100 requests per windowMs
    message: {
      message: 'Too many requests, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false
  });
};