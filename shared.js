const Entry = require('./models/Entry');
const Script = require('./models/Script');
const mongoose = require('mongoose');

const withDatabase = (context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  return new Promise((resolve) => {
    mongoose.connect(process.env.DB_CONNECTION_STRING, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true 
    }, resolve);
  })
}

module.exports = {
  Entry,
  Script,
  withDatabase
}