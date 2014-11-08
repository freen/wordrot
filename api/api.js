var _ = require('lodash'),
  async = require('async'),

  // express
  express = require('express'),
  session = require('express-session'),
  MongoStore = require('connect-mongo')(session),
  bodyParser = require('body-parser'),
  multer = require('multer'),
  errorHandler = require('errorhandler'),

  // wordrot
  Words = require('./db/words'),
  Users = require('./db/users'),
  config = require('./config');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: config.http.cookieSecret,
  store: new MongoStore({
    db: config.mongodb.database,
    host: config.mongodb.host
  })
}));
app.use(multer());

// development only
if ('development' == app.get('env')) {
  app.use(errorHandler());
}

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

var prefix = config.http.apiUrlPrefix;

app.get(prefix + '/*', function(req,res,next) {
  req.session.userDocument = req.session.userDocument || undefined;
  res.set('Content-Type', 'application/json');
  next();
});

require('./routes/auth')(app, prefix);
require('./routes/debug')(app, prefix);
require('./routes/play')(app, prefix);
require('./routes/words')(app, prefix);

app.listen(config.port, function(){
  console.log('Wordrot server listening on port ' + config.port);
});
