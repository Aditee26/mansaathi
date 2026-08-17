const ApiError = require('../utils/ApiError');

/**
 * Catches 404s for any route that doesn't match, turning it into a
 * consistent ApiError instead of Express's default HTML response.
 */
const notFound = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`));
};

/**
 * Single place where every error in the app is turned into a JSON
 * response. Handles known Mongoose error types (validation, duplicate
 * key, bad ObjectId) in addition to our own ApiError instances, so
 * controllers never have to format error responses themselves.
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = err instanceof ApiError ? err.statusCode : 500;
  let message = err.message || 'Server error';

  // Mongoose validation errors -> 400 with a readable message
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
  }

  // Duplicate key error (e.g. registering with an existing email)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `${field} already exists`;
  }

  // Malformed MongoDB ObjectId in a route param
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  if (process.env.NODE_ENV !== 'production') {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = { notFound, errorHandler };
