require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const pixivApi = require('./routes/pixiv.routes');
const { notFoundError, errorHandler } = require('./utils/errorHandlers');

const app = express();
const PORT = process.env.PORT || 3000;
require('./database');

// Config
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Setting Routes
app.use('/api/pixiv', pixivApi);
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Aninotes API' });
});

// Handlers
app.use(notFoundError);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
