/**
 * A small custom error class so controllers can throw errors with an
 * explicit HTTP status code, and the centralized error handler can
 * respond consistently instead of every controller building its own
 * response shape.
 */
class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;
