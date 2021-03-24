const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const userRouter = require('./routes/user');
const indexRouter = require('./routes/');
const auth = require('./middleware/auth');
const fs = require('fs');

// Loading environmet variables
require('dotenv').config();

const app = express();
app.use(cors());

// Mongoose Connection
require('./lib/connectionDB');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

app.use('/', indexRouter());

app.use('/api', userRouter());

/**
 * API Routes
 */
app.use('/api', require('./routes/api/adverts.routes'));

module.exports = app;
