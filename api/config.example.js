var config = {};

config.port = 80;

config.http = {};
config.http.cookieSecret = 'secret';

config.wordnik = {};
config.wordnik.apiKey = 'yours';

config.mongoConnectionUri = 'mongodb://user:pass@localhost:port/database';

module.exports = config;