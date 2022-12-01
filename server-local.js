'use strict';

const app = require('./src/server');

const dotenv = require('dotenv');
dotenv.config();

app.listen(process.env.PORT || 3000, () => console.log('Local app listening on port 3000!'));