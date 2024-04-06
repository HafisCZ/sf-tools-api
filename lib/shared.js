import mongoose from 'mongoose';
import fetch from 'node-fetch';

export const File = mongoose.model('File', new mongoose.Schema({
  key: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true,
  },
  multiple: {
    type: Boolean,
    required: false,
    default: false
  },
  date: {
    type: Date,
    default: Date.now
  }
}))

export const Script = mongoose.model('Script', new mongoose.Schema({
  key: {
    type: String,
    required: true
  },
  secret: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  version: {
    type: Number,
    default: 1
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false,
    default: ''
  },
  visibility: {
    type: String,
    default: 'private'
  },
  verified: {
    type: Boolean,
    default: false
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
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

export function sendWebhook (webhook, body) {
  fetch(webhook, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }).catch((e) => {
    console.log(e instanceof Error ? e.message : e)
  })
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
    if (!await model.exists({ key })) {
      return key;
    }
  }
}

export function pickFields (model, fields) {
  return fields.reduce((memo, field) => {
    memo[field] = model[field];

    return memo;
  }, Object.create(null));
}