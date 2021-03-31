const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_CONNECTION_STRING, {
  dbName: process.env.MONGO_DATABASE,
  user: process.env.MONGO_DB_USER,
  pass: process.env.MONGO_DB_PASSWORD,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
})
  .then(() => console.log('Database is connected'))
  .catch((err) => console.log(err));

mongoose.connection.on('disconnected', () => {
  console.log('Database is disconnected');
});
