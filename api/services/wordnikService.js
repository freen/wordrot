var Wordnik = require('wordnik'),
  mongoose = require('mongoose'),
  wordSchema = require('../db2/wordSchema'),
  Deferred = require("promised-io/promise").Deferred;

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
  var that = this,
    deferred = new Deferred();
  this.wordModel.findOne({word: word}, function(err, wordDocument) {
    if (wordDocument) {
      return deferred.resolve(wordDocument);
    }
    that.wordnik.definitions(word, function(e, defs) {
      // todo e ?
      if(0 == defs.length) {
        return deferred.reject(that.ERR_API_NO_DEFINITIONS);
      }
      wordDocument = new that.wordModel({
        word: word,
        definitions: defs
      });
      wordDocument.save(function(err, wordDocument) {
        if (wordDocument) return deferred.resolve(wordDocument);
        deferred.reject(err || false);
      });
    });
  });
  return deferred;
};

// todo consolidate into batch requests to cache / api
WordnikService.prototype.fetchWords = function(words, callback) {
  var that = this,
    deferred = new Deferred(),
    wordDocuments = [];
  async.each(
    words,
    function(word, callback) {
      that.fetchWord(word, function(wordDocument) {
        wordDocuments.push(wordDocument);
      });
    },
    function(err) {
      if(err) return deferred.reject(err);
      deferred.resolve(wordDocuments);
    }
  );
  return deferred;
};

module.exports = function (app) {
  return new WordnikService(app);
};