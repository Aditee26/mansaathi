const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

/**
 * Runs after an array of express-validator checks. If any failed,
 * short-circuits with a 400 and a readable, combined message. Otherwise
 * passes control to the controller.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const message = errors
      .array()
      .map((e) => e.msg)
      .join(', ');
    return next(new ApiError(400, message));
  }
  next();
};

module.exports = validate;
