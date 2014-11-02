var EventEmitter = require('events').EventEmitter
  , _ = require('lodash')
  , db = require('./db')
  , config = require('../config');

function Users() {
  this.userCollection = db.collection('users');
};

Users.prototype.addUser = function(username, callback) {
  var userDocument = {
    name: username,
    created: new Date,
    modified: new Date,
    words: []
  };
  this.userCollection.insert(userDocument, function(err, inserted) {
    if(err) throw err;
    callback(userDocument);
  });
};

Users.prototype.fetchUserByName = function(username, callback) {
  this.userCollection.findOne({name: username}, function(err, userDocument) {
      if(err || !userDocument) {
        // console.log('No user document found for: ' + username);
        return callback(undefined);
      }
      // console.log('User document found for: ' + username);
      return callback(userDocument);
  });
};

Users.prototype.fetchPoorestPerformingWordsByUser = function(username, quantity, callback) {
  quantity = quantity || 1;
  this.fetchUserByName(username, function(userDocument) {
    if(!userDocument) {
      return callback(undefined);
    }
    // Sort words by performance
    userDocument.words.sort(function(a, b) {
      var scoreA = a.hits - a.misses
        , scoreB = b.hits - b.misses;
      return scoreA - scoreB;
    });
    callback(userDocument.words.slice(0, quantity));
  });
};

Users.prototype.getWordOnDeck = function(username, override, callback) {
  override = override || false;
  var that = this;
  this.fetchUserByName(username, function(userDocument) {
    if(!userDocument || userDocument.words.length === 0) {
      return callback(undefined);
    }
    var hasWordOnDeck = userDocument.wordOnDeck !== '';
    if(override || !hasWordOnDeck) {
      that.fetchPoorestPerformingWordsByUser(username, 5, function(userWords) {
        // If possible, enforce that the next word doesn't equal the last
        if(userWords.length > 1 && hasWordOnDeck) {
          userWords = _.remove(userWords, function(wordDoc) { return wordDoc.word === userDocument.wordOnDeck; });
        }
        var nextWord = _.sample(userWords);
        if(nextWord.word !== userDocument.wordOnDeck) {
          userDocument.wordOnDeck = nextWord.word;
          that.userCollection.save(userDocument);
        }
        callback(nextWord.word);
      });
      return;
    }
    callback(userDocument.wordOnDeck)
  });
};

// todo user doc should be a model & this a method on that model
Users.prototype.getWordStatsFromUserDocument = function(userDocument, wordName) {
  return _.find(userDocument.words, function(userWord) {
    return userWord.word === wordName;
  });
};

Users.prototype.__proto__ = EventEmitter.prototype;

module.exports = Users;
