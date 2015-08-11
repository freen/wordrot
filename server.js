var mongoose = require('./api/db/db.js'),
  express = require('express'),
  session = require('express-session'),
  MongoStore = require('connect-mongo')(session),
  bodyParser = require('body-parser'),
  multer = require('multer'),
  errorHandler = require('errorhandler'),

  // wordrot
  config = require('./api/config'),
  api = require('./api/api.js');

var app = express();
app.set('port', process.env.PORT || config.port);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: config.http.cookieSecret,
  store: new MongoStore({ mongooseConnection: db })
}));
app.use(multer());

if ('development' == app.get('env')) {
  app.use(errorHandler());
}

var staticMiddleware = express.static(__dirname + '/app');
app.use(staticMiddleware);
app.use('/api', api);

// Pass unknown routes to backbone
app.get('/*', function(req, res, next) {
  req.url = '/index.html';
  staticMiddleware(req, res, next)
});

app.listen(app.get('port'), function(){
  console.log('Wordrot server listening on port ' + app.get('port'));
});
