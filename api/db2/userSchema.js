var _ = require('lodash'),
  mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  Deferred = require("promised-io/promise").Deferred;

var userSchema = new Schema({
  name: { type: String, index: true },
  wordInPlay: String,
  created: { type: Date, default: Date.now },
  modified: { type: Date, default: Date.now },
  words: [{ word: String, hits: Number, misses: Number }]
});

userSchema.methods.getPoorestPerformingWords = function(quantity) {
  this.words.sort(function(a, b) {
    var scoreA = a.hits - a.misses
      , scoreB = b.hits - b.misses;
    return scoreA - scoreB;
  });
  return this.words.slice(0, quantity);
};

userSchema.methods.getNewWordInPlay = function() {
  var deferred = new Deferred(),
    that = this;
  if (this.words.length === 0) {
    deferred.reject(undefined);
    return deferred;
  }
  var poorest = this.getPoorestPerformingWords(5);
  if (poorest.length > 1 && this.wordInPlay !== '') {
    _.remove(poorest, function(w) { return w.word == that.wordInPlay; });
  }
  this.wordInPlay = _.sample(poorest).word;
  this.save(function (err) {
    if (err) deferred.reject(err);
    deferred.resolve(that.wordInPlay);
  });
  return deferred;
};

userSchema.methods.getWordStats = function(wordName) {
  return _.find(this.words, function(word) {
    return word.word === wordName;
  });
};

module.exports = userSchema;