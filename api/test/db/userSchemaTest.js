var _ = require('lodash'),
  assert = require("assert"),
  sinon = require("sinon"),
  mongoose = require('mongoose'),
  userSchema = require("../../db/userSchema");

describe('userSchema', function() {

  describe('#getPoorestPerformingWords', function () {

    it('should yield the words with the worst hit to miss ratio', function () {
      var userModel = mongoose.model('User', userSchema);
      var mockUser = new userModel({
        name: 'name',
        words: [
          {word:'aliquot', hits:5, misses:2},
          {word:'churlish', hits:2, misses:4},
          {word:'stoup', hits:4, misses:0}
        ]
      });
      var poorest = mockUser.getPoorestPerformingWords(2);
      assert.equal(poorest.length, 2);
      assert.equal(poorest[0].word, 'churlish');
      assert.equal(poorest[1].word, 'aliquot');
    });

  });

  describe('#getNewWordInPlay', function () {

    it('should yield undefined if there are no words', function(done) {
      var userModel = mongoose.model('User', userSchema);
      var mockUser = new userModel({name: 'name', words: []});
      var wordInPlay = mockUser.getNewWordInPlay()
        .then(function(){}, function(err) {
          assert.equal(err, undefined);
          done();
        });
    });

    it('should yield the only word if there is only one', function(done) {
      var userModel = mongoose.model('User', userSchema),
        mockUser = new userModel({name: 'name', words: [{word:'parula'}]}),
        stub = sinon.stub(mockUser, "save", function(cb) { cb() });
      var wordInPlay = mockUser.getNewWordInPlay()
        .then(function(word){
          assert.equal(word, 'parula');
          stub.restore();
          done();
        });
    });

    it('should yield a new, random poor word if there are two or more', function(done) {
      var userModel = mongoose.model('User', userSchema),
        mockUser = new userModel({
          name: 'name',
          wordInPlay: 'churlish',
          words: [
            {word:'aliquot', hits:5, misses:2},
            {word:'churlish', hits:2, misses:4},
            {word:'stoup', hits:4, misses:0}
          ]
        }),
        stub = sinon.stub(mockUser, "save", function(cb) { cb() });
      var wordInPlay = mockUser.getNewWordInPlay()
        .then(function(word){
          assert.ok(['aliquot','stoup'].indexOf(word) !== -1);
          stub.restore();
          done();
        });
    });

  });

  describe('#getWordStats', function () {

    it('should yield stats for specified word', function () {
      var mockWordStat = {word:'aliquot', hits:5, misses:2},
        userModel = mongoose.model('User', userSchema),
        mockUser = new userModel({name: 'name', words: [mockWordStat]}),
        wordStat = mockUser.getWordStats(mockWordStat.word); // todo normalize this naming
      assert.equal(wordStat.word, mockWordStat.word);
      assert.equal(wordStat.hits, mockWordStat.hits);
      assert.equal(wordStat.misses, mockWordStat.misses);
      // Should work -
      //assert.equal({
      //  word: wordStat.word,
      //  hits: wordStat.hits,
      //  misses: wordStat.misses
      //}, mockWordStat);
    });

  });

});