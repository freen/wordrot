var EventEmitter = require('events').EventEmitter
  , Wordnik = require('wordnik')
  , db = require('./db')
  , config = require('../config');

function Words() {
  this.wn = new Wordnik({api_key: config.wordnik.apiKey});
  this.wordCollection = db.collection('words');
};

Words.prototype.fetchWord = function(word, callback) {
  var self = this;
  this.wordCollection.findOne({word: word}, function(err, wordDocument) {
      if(err || !wordDocument) {
        self.wn.definitions(word, function(e, defs) {
          if(0 == defs.length) {
            callback(false);
            return;
          }
          wordDocument = {
            word: word,
            definitions: defs
          };
          self.wordCollection.insert(wordDocument, function(err, inserted) {
            if(err) throw err;
          });
          callback(wordDocument);
        });
      } else {
        callback(wordDocument);
      }
  });
};

Words.prototype.fetchWords = function(words, callback) {
  var self = this
    , wordDocuments = [];
  async.each(
    words,
    function(word, callback) {
      self.fetchWord(word, function(wordDocument) {
        wordDocuments.push(wordDocument);
      });
    },
    function(err) {
      if(err) throw err;
      callback(wordDocuments);
    }
  );
};

Words.prototype.__proto__ = EventEmitter.prototype;

module.exports = Words;