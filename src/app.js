require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { notFoundError, errorHandler } = require('./middlewares/errorHandlers');
const morgan = require('./middlewares/requestLogger');
const pixivApi = require('./routes/pixiv.routes');
const illustratorsApi = require('./routes/illustrators.routes');

const app = express();
require('./database');

// Config
app.use(cors());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan);
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

module.exports = app;
