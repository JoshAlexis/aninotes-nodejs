const mongoose = require('mongoose');

let connectOptions = {};

if (process.env.NODE_ENV === 'test') {
  connectOptions = {
    dbName: process.env.MONGO_TEST_DATABASE,
    user: process.env.MONGO_TEST_DB_USER,
    pass: process.env.MONGO_TEST_DB_PASS,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  };
} else {
  connectOptions = {
    dbName: process.env.MONGO_DATABASE,
    user: process.env.MONGO_DB_USER,
    pass: process.env.MONGO_DB_PASSWORD,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  };
}

mongoose.connect(process.env.MONGO_CONNECTION_URI, connectOptions)
  .then(() => console.log('Database is connected'))
  .catch((err) => console.log(err));

mongoose.connection.on('disconnected', () => {
  console.log('Database is disconnected');
});
