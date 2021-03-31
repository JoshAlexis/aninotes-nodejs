const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
})
  .then(() => console.log('Database is connected'))
  .catch((err) => console.log(err));

mongoose.connection.on('disconnected', () => {
  console.log('Database is disconnected');
});
