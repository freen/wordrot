var config = {};

config.port = 80;

config.http = {};
config.http.apiUrlPrefix = '/wordrot-api';
config.http.cookieSecret = 'secret';

config.wordnik = {};
config.wordnik.apiKey = 'yours';

config.mongodb = {};
config.mongodb.host = 'localhost';
config.mongodb.database = 'wordrot-api';

module.exports = config;