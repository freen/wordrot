var mongo = require('mongoskin')
  , format = require('util').format
  , config = require('../config');

module.exports = mongo.db(format("mongodb://%s/%s", config.mongodb.host, config.mongodb.database));