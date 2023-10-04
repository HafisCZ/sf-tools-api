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
  version: {
      type: String,
      default: '1'
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
  },
  uses: {
      type: Number,
      default: 0
  }
}))

let mongooseConnected = false

export async function wrap (context, callback) {
  try {
    context.callbackWaitsForEmptyEventLoop = false;
  
    return respond({ error: 'maintenance' });

    return await new Promise((resolve) => {
      if (mongooseConnected) {
        resolve(callback());
      } else {
        mongoose.connect(process.env.DB_CONNECTION_STRING, { 
          useNewUrlParser: true, 
          useUnifiedTopology: true 
        }, () => {
          mongooseConnected = true

          resolve(callback())
        })
      }
    })
  } catch (e) {
    return respond({ error: e.message })
  }
}

export function respond (response) {
  return {
    statusCode: 200,
    body: JSON.stringify(response),
    headers: {
			'Content-Type': 'application/json; charset=utf-8',
			'Access-Control-Allow-Origin': '*',
		}
  }
}

const ALLOWED_KEY_CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

export function generateRandomUUID () {
  let str = '';
  for (var i = 0; i < 12; i++) {
      str += ALLOWED_KEY_CHARS[parseInt(Math.random() * ALLOWED_KEY_CHARS.length)];
  }

  return str;
}

export async function randomUUID (model) {
  while (true) {
    const key = generateRandomUUID();
    if (!await Entry.exists({ key })) {
      return key;
    }
  }
}