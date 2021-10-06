global.__basedir = __dirname;
const app = require('./src/app');
const logger = require('./src/utils/logger');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.debug(`Server running on port: ${PORT}`);
});
