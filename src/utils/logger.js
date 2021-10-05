const winston = require('winston');
const path = require('path');

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

function level() {
  const env = process.env.NODE_ENV || 'development';
  const isDevelopment = env === 'development';
  return isDevelopment ? 'debug' : 'warn';
}

function errorStack(info) {
  return info.stack ? `${info.message} - ${info.stack}` : info.message;
}

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'blue',
  debug: 'white',
};

winston.addColors(colors);

const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.printf(
    (info) => `[${info.timestamp}][${info.level}]: ${errorStack(info)}`,
  ),
  winston.format.errors({ stack: true }),
);
/* eslint-disable no-undef */
const logDir = path.join(__basedir, 'logs');

const transports = [
  new winston.transports.Console({
    format: winston.format.colorize({ all: true }),
  }),
  new winston.transports.File({
    filename: `${logDir}/error.log`,
    level: 'error',
  }),
  new winston.transports.File({
    filename: `${logDir}/all.log`,
  }),
];

const logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
  exceptionHandlers: [
    new winston.transports.File({
      filename: `${logDir}/exceptions.log`,
    }),
  ],
  exitOnError: false,
});

module.exports = logger;
