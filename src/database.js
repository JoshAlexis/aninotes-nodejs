const mongoose = require('mongoose');
const logger = require('./utils/logger');

const connectOptions = {
  dbName: null,
  user: null,
  pass: null,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
};

if (process.env.NODE_ENV === 'test') {
  connectOptions.dbName = process.env.MONGO_TEST_DATABASE;
  connectOptions.user = process.env.MONGO_TEST_DB_USER;
  connectOptions.pass = process.env.MONGO_TEST_DB_PASSWORD;
} else {
  connectOptions.dbName = process.env.MONGO_DATABASE;
  connectOptions.user = process.env.MONGO_DB_USER;
  connectOptions.pass = process.env.MONGO_DB_PASSWORD;
}

mongoose.connect(process.env.MONGO_CONNECTION_URI, connectOptions)
  .then(() => logger.info('Database is connected'))
  .catch((err) => logger.error(err));

mongoose.connection.on('disconnected', () => {
  logger.info('Database is disconnected');
});
