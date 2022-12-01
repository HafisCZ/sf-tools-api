const Entry = require('./Entry');
const Script = require('./Script');
const mongoose = require('mongoose');

const withDatabase = (context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  return new Promise((resolve) => {
    mongoose.connect(process.env.DB_CONNECTION_STRING, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true 
    }, () => {
      resolve(callback());
    });
  })
}

const respond = (body) => {
  return {
    statusCode: 200,
    body: body
  }
}

module.exports = {
  Entry,
  Script,
  withDatabase,
  respond
}