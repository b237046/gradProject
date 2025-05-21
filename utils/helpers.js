// Generate a random 6-digit verification code
exports.generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Format date to ISO string
exports.formatDate = (date) => {
  return date.toISOString().slice(0, 19).replace('T', ' ');
};