module.exports = (err, req, res, next) => {
  // Log error
  console.error(err.stack);
  
  // Database errors
  if (err.code === 'ER_DUP_ENTRY') {
    if (err.sqlMessage.includes('email')) {
      // Duplicate email error
      return res.status(409).json({ message: 'This email is already registered' });
    }
    if (err.sqlMessage.includes('item_name')) {
      // Duplicate item name error
      return res.status(409).json({ message: 'This item name already exists in the household' 
         
      });
    }
  }
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ message: 'Invalid token' });
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ message: 'Token expired' });
  }
  
  // Default error
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    message: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};