global.__basedir = __dirname;
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const pixivApi = require('./routes/pixiv.routes');
const illustratorsApi = require('./routes/illustrators.routes');
const { notFoundError, errorHandler } = require('./utils/errorHandlers');

const app = express();
const PORT = process.env.PORT || 3000;
require('./database');

// Config
app.use(cors());
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Setting Routes
app.use('/api/pixiv', pixivApi);
app.use('/api/illustrators', illustratorsApi);
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Aninotes API' });
});

// Handlers
app.use(notFoundError);
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});

module.exports = {
  app,
  server,
};
