var mongoose = require('mongoose'),
  config = require('../config'),
  uristring = config.mongoConnectionUri;

mongoose.connect(uristring, function (err, res) {
  if (err) console.log ('Failed to connect to Mongo: ' + uristring + '. ' + err);
  else console.log ('Connected to Mongo: ' + uristring);
});

// todo dupe?
global.db = mongoose.createConnection(uristring);

module.exports = db;