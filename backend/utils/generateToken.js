const jwt = require('jsonwebtoken');

/**
 * Signs a JWT containing only the user's id. Keeping the payload minimal
 * means the token never leaks personal data and stays small.
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

module.exports = generateToken;
