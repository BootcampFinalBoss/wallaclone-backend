/* eslint-disable no-console */
const mongoose = require('mongoose');

mongoose.connection.on('open', () => {
  console.log('Connected to MongoDB on', mongoose.connection.name);
});

mongoose.connection.on('error', (err) => {
  console.log('Error connecting to database', err);
  process.exit(1);
});

mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

module.exports = mongoose.connection;
