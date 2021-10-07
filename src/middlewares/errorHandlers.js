const createError = require('http-errors');
const logger = require('../utils/logger');

const notFoundError = (req, res, next) => {
  next(createError.NotFound());
};
/* eslint-disable no-unused-vars */
const errorHandler = (err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    status: err.status || 500,
    message: err.message,
  });
  if (process.env.NODE_ENV !== 'test') logger.error(err);
};

module.exports = {
  notFoundError,
  errorHandler,
};
