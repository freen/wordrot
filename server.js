var express = require('express'),
  session = require('express-session'),
  MongoStore = require('connect-mongo')(session),
  bodyParser = require('body-parser'),
  multer = require('multer'),
  errorHandler = require('errorhandler'),

  // wordrot
  config = require('./api/config'),
  api = require('./api/api.js');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
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

if ('development' == app.get('env')) {
  app.use(errorHandler());
}

app.use(express.static(__dirname + '/app'));
app.use('/api', api);

app.set('port', process.env.PORT || config.port);

app.listen(app.get('port'), function(){
  console.log('Wordrot server listening on port ' + app.get('port'));
});
