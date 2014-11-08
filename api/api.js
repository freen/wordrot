var _ = require('lodash')
  , async = require('async')
  , express = require('express')
  , MongoStore = require('connect-mongo')(express)
  , Words = require('./db/words')
  , Users = require('./db/users')
  , config = require('./config');

var app = express()
  , words = new Words
  , users = new Users
  , prefix = config.http.apiUrlPrefix;

app.set('config', config);
app.set('users', users);
app.set('words', words);

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

app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({
    secret:config.http.cookieSecret,
    store: new MongoStore({
      db: config.mongodb.database,
      host: config.mongodb.host
    })
}));

// Global route behavior
app.get(prefix + '/*', function(req,res,next) {
  req.session.userDocument = req.session.userDocument || undefined;
  res.set('Content-Type', 'application/json');
  next();
});

require('./routes/auth')(app, prefix);
require('./routes/debug')(app, prefix);
require('./routes/play')(app, prefix);
require('./routes/words')(app, prefix);

app.listen(3000);
