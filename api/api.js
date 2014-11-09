var express = require('express'),
  Words = require('./db/words'),
  Users = require('./db/users'),
  config = require('./config');

var app = express();

app.set('config', config);
app.set('users', new Users);
app.set('words', new Words);

app.set('abortIfNotAuthenticated', function(req, res, errorResponse) {
  errorResponse = errorResponse || {
    success: false,
    error: "You must be authenticated to use this endpoint."
  };
  if(undefined === req.session.userDocument) {
    res.send(errorResponse);
    return false;
  }
  return true;
});

app.get('/*', function(req,res,next) {
  req.session.userDocument = req.session.userDocument || undefined;
  res.set('Content-Type', 'application/json');
  next();
});

require('./routes/auth')(app);
require('./routes/debug')(app);
require('./routes/play')(app);
require('./routes/words')(app);

module.exports = app;
