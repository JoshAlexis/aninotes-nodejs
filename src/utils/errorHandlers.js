const createError = require('http-errors');

const notFoundError = (req, res, next) => {
  next(createError.NotFound());
};

const errorHandler = (err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
  console.log(err);
};

module.exports = {
  notFoundError,
  errorHandler,
};
