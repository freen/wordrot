var _ = require('lodash'),
  mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  Promise = require('bluebird');

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
  var that = this;
  return new Promise(function (resolve, reject) {
    if (this.words.length === 0) {
      throw new Error("No words");
    }
    var poorest = that.getPoorestPerformingWords(5);
    if (poorest.length > 1 && that.wordInPlay !== '') {
      _.remove(poorest, function(w) { return w.word == that.wordInPlay; });
    }
    that.wordInPlay = _.sample(poorest).word;
    that.save(function (err) {
      if (err) return reject(err);
      resolve(that.wordInPlay);
    });
  });
};

userSchema.methods.getWordStats = function(wordName) {
  return _.find(this.words, function(word) {
    return word.word === wordName;
  });
};

module.exports = userSchema;