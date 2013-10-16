var EventEmitter = require('events').EventEmitter
  , Wordnik = require('wordnik')
  , db = require('./db')
  , config = require('./config');

function Words() {
	this.wn = new Wordnik({api_key: config.wordnik.apiKey});
	this.wordCollection = db.collection('words');
};

Words.prototype.fetchWord = function(word, callback) {
	var self = this;
  this.wordCollection.findOne({word: word}, function(err, wordDocument) {
      if(err || !wordDocument) {
        console.log('No word document found for: ' + word);
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
        console.log('Word document found for: ' + word);
        callback(wordDocument);
      }
  });
};

Words.prototype.fetchWords = function(words, callback) {
	var self = this
	  , wordDocuments = {}
	  , wordsRemaining = words.length;
	if(0 == wordsRemaining) {
		callback(wordDocuments);
		return;
	}
	words.forEach(function(word) {
		self.fetchWord(word, function(wordDocument) {
			wordDocuments[word] = wordDocument;
			wordsRemaining--;
			if(0 == wordsRemaining) {
				callback(wordDocuments);
			}
		});
	});
};

Words.prototype.__proto__ = EventEmitter.prototype;

module.exports = Words;