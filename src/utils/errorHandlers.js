const createError = require('http-errors');
const logger = require('./logger');

const notFoundError = (req, res, next) => {
  next(createError.NotFound());
};
/* eslint-disable no-unused-vars */
const errorHandler = (err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
  logger.error(err);
};

module.exports = {
  notFoundError,
  errorHandler,
};
