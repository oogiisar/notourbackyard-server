require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const cleanupsRouter = require('./cleanups/cleanups-router');
const overviewRouter = require('./overview/overview-router');
const authRouter = require('./auth/auth-router');
const usersRouter = require('./users/users-router');

const app = express();

app.use(morgan((NODE_ENV === 'production') ? 'tiny' : 'common', {
  skip: () => NODE_ENV === 'test',
}));

app.use(cors());
app.use(helmet());

// Deals with adding and getting user cleanups
app.use('/api/cleanups', cleanupsRouter);

// Deals with getting data for the public overview page
app.use('/api/overview', overviewRouter);

// Deals with auth and addition of users
app.use('/api/auth', authRouter);

// Gets user information and garbage types
app.use('/api/users', usersRouter);

app.use(function errorHandler(error, req, res, next) {
  let response
  if (NODE_ENV === 'production') {
    response = { error: 'Server error' }
  } else {
    console.error(error)
    response = { error: error.message, object: error }
  }
  res.status(500).json(response)
});

module.exports = app;
