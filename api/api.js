var express = require('express'),
  config = require('./config'),
  wordnikService = require('./services/wordnikService'),
  authService = require('./services/authService'),
  mongoose = require('mongoose'),
  userSchema = require('./db/userSchema'),
  wordSchema = require('./db/wordSchema');

var app = express();

// todo remove this: (was necessary for decoupling / testing routes)
global.app = app;

app.set('config', config);
app.set('wordnik', wordnikService(app));
app.set('auth', authService(app));
app.set('models', {
  user: mongoose.model('User', userSchema),
  word: mongoose.model('Word', wordSchema)
});

app.set('abortIfNotAuthenticated', function(req, res, errorResponse) {
  errorResponse = errorResponse || {
    success: false,
    error: "You must be authenticated to use this endpoint."
  };
  if(!app.get('auth').isAuthenticated()) {
    res.status(401).send(errorResponse);
    return false;
  }
  return true;
});

require('./routes/routes')(app);

module.exports = app;
