const { getRandomKey } = require('./helpers')
const Entry = require('../models/Entry');
const Script = require('../models/Script');

const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const helmet = require('helmet');

const cors = require('cors');
const formidable = require('express-formidable');
const serverless = require('serverless-http');

// Configuration
const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(formidable());

// Load .env
dotenv.config();

// Connect to database
mongoose.connect(process.env.DB_CONNECTION_STRING, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
}, () => {
  console.log('Connected to DB');
});

const router = express.Router();

router.post('/scripts/share', async (req, res) => {
  // Share single script
  let content = req.fields.content;
  let author = req.fields.author;
  let description = req.fields.description;
  let private = true;

  let secret = getRandomKey();
  let key = null;

  try {
      while (key == null) {
          let k = getRandomKey();
          if (!await Script.exists({ key: k })) {
              key = k;
          }
      }

      const script = new Script({
          content: content,
          author: author,
          key: key,
          description: description,
          secret: secret,
          private: private
      });

      const savedScript = await script.save();

      res.json({
          success: true,
          key: key,
          secret: secret,
          description: description,
          content: content,
          author: author,
          private: private
      });
  } catch (err) {
      res.json({
          success: false
      });
  }
});

router.post('/scripts/update', async (req, res) => {
  // Update shared script
  let content = req.fields.content;
  let key = req.fields.key;
  let secret = req.fields.secret;
  let description = req.fields.description;

  try {
      let entry = await Script.findOne({ key: key }).exec();
      if (entry && entry.secret == secret) {
          if (content) {
              entry.content = content;
          }

          if (description) {
              entry.description = description;
          }

          await entry.save();

          res.json({
              success: true,
              key: entry.key,
              secret: entry.secret,
              description: entry.description,
              content: entry.content,
              author: entry.author,
              private: entry.private
          });
      } else {
          throw 'err';
      }
  } catch (err) {
      res.json({
          success: false
      });
  }
});

router.get('/scripts/delete', async (req, res) => {
  // Delete shared script
  let id = req.query.key;
  let secret = req.query.secret;

  try {
      let entry = await Script.findOne({ key: id }).exec();
      if (entry && entry.secret == secret) {
          entry.remove();
      } else {
          throw 'err';
      }

      res.json({
          success: true
      });
  } catch (err) {
      res.json({
          success: false
      });
  }
});

router.get('/scripts/', async (req, res) => {
  // List available scripts or send selected one
  let id = req.query.key;

  if (id) {
      try {
          let entry = await Script.findOne({ key: id }).exec();
          res.json({
              success: true,
              content: entry.content,
              date: entry.date,
              author: entry.author,
              description: entry.description,
              private: entry.private
          });
      } catch (err) {
          res.json({
              success: false
          });
      }
  } else {
      try {
          let entries = await Script.find({ private: { $ne: true } }, 'key author date description');
          res.json(entries.map(entry => {
              return {
                  author: entry.author,
                  key: entry.key,
                  date: entry.date,
                  description: entry.description
              };
          }));
      } catch (err) {
          res.json({
              success: false
          });
      }
  }
});

router.post('/files/share', async (req, res) => {
    const file = new Entry({
        content: req.fields.file,
        multiple: req.fields.multiple
    });

    let key = null;

    try {
        while (key == null) {
            let k = getRandomKey();
            if (!await Entry.exists({ key: k })) {
                key = k;
            }
        }
  
        file.key = key;
        
        await file.save();
  
        res.json({
            success: true,
            key: key
        });
    } catch (err) {
        res.json({
            success: false
        });
    }
})

router.get('/files/', async (req, res) => {
    const fileId = req.query.key;

    try {
        const file = await Entry.findOne({ key: fileId }).exec();
        if (!file) {
            throw 'err';
        }

        res.send(file.content);

        if (!file.multiple) {
            file.remove();
        }
    } catch (err) {
        res.send('');
    }
})

app.use('/.netlify/functions/api', router);

module.exports.handler = serverless(app);
