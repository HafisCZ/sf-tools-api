import mongoose from 'mongoose';

export const Entry = mongoose.model('Entry', new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    multiple: {
        type: Boolean,
        required: false,
        default: false
    },
    key: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
}))

export const Script = mongoose.model('Script', new mongoose.Schema({
  content: {
      type: String,
      required: true
  },
  author: {
      type: String,
      required: true
  },
  description: {
      type: String,
      required: true
  },
  key: {
      type: String,
      required: true
  },
  secret: {
      type: String,
      required: true
  },
  private: {
      type: Boolean,
      default: false
  },
  date: {
      type: Date,
      default: Date.now
  }
}))

export function withDatabase (context, callback) {
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

export function respond (body) {
  return {
    statusCode: 200,
    body: JSON.stringify(body)
  }
}