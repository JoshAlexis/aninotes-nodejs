const morgan = require('morgan');
const logger = require('../utils/logger');

const stream = {
  write: (message) => logger.http(message),
};

const middleware = morgan(
  ':method :url :status :res[content-length] - :response-time ms',
  {
    stream,
  },
);

module.exports = middleware;
