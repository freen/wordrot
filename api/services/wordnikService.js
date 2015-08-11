var Wordnik = require('wordnik'),
  mongoose = require('mongoose'),
  wordSchema = require('../db/wordSchema'),
  Promise = require('bluebird');

function WordnikService(app) {
  this.ERR_API_NO_DEFINITIONS = 'api_empty_definitions';
  this.app = app;
  this.wordnik = new Wordnik({api_key: app.get('config').wordnik.apiKey});
  this.wordModel = mongoose.model('Word', wordSchema);
}

/**
 * Check DB for cache; fallback to Wordnik API call.
 */
WordnikService.prototype.getWord = function(word) {
  var that = this;
  // todo use bluebird promisify for mongoose promise chain below
  return new Promise(function (resolve, reject) {
    that.wordModel.findOne({word: word}, function(err, wordDocument) {
      if (wordDocument) {
        return resolve(wordDocument);
      }
      debugger;
      that.wordnik.definitions(word, function(e, defs) {
        if (e) return reject(e);
        if(0 == defs.length) {
          return reject(that.ERR_API_NO_DEFINITIONS);
        }
        wordDocument = new that.wordModel({
          word: word,
          definitions: defs
        });
        wordDocument.save(function(err, wordDocument) {
          if (wordDocument) return resolve(wordDocument);
          reject(err || false);
        });
      });
    });
  });
};

// todo consolidate into batch requests to cache / api
// todo reconcile (?) promise pattern w/ async lib usage
WordnikService.prototype.fetchWords = function(words, callback) {
  var that = this,
    wordDocuments = [];
  return new Promise(function (resolve, reject) {
    async.each(
      words,
      function(word, callback) {
        that.getWord(word, function(wordDocument) {
          wordDocuments.push(wordDocument);
        });
      },
      function(err) {
        if(err) return reject(err);
        resolve(wordDocuments);
      }
    );
  });
};

module.exports = function (app) {
  return new WordnikService(app);
};