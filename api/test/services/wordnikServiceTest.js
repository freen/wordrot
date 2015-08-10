var mockApp = {get: function() { return {wordnik:{apiKey:'key'}}}},
  wordnikService = require('../../services/wordnikService')(mockApp),
  mongoose = require('mongoose'),
  assert = require('assert'),
  sinon = require('sinon');

// todo better re-usable express app stub

describe("wordnikService", function () {

  describe("#getWord", function() {

    it("should resolve with cached value if cache is warm", function (done) {
      var mockWordDocument = {word:'contrapuntal'},
        modelStub = sinon.stub(wordnikService.wordModel, "findOne", function (query, cb) {
          cb(undefined, mockWordDocument);
        });
      wordnikService.getWord(mockWordDocument.word)
        .then(function (wordDocument) {
          assert.equal(wordDocument, mockWordDocument);
          modelStub.restore();
          done();
        });
    });

    it("should reject if API lacks definitions", function (done) {
      var modelStub = sinon.stub(wordnikService.wordModel, "findOne", function (query, cb) {
          cb(undefined, undefined);
        }),
        wordnikStub = sinon.stub(wordnikService.wordnik, "definitions", function (word, cb) {
          cb(undefined, []);
        });
      wordnikService.getWord('contrapuntal')
        .then(function () {}, function (err) {
          assert.equal(err, wordnikService.ERR_API_NO_DEFINITIONS);
          modelStub.restore();
          wordnikStub.restore();
          done();
        });
    });

    it("should reject if cache save fails", function (done) {
      var modelFindOneStub = sinon.stub(wordnikService.wordModel, "findOne", function (query, cb) {
          cb(undefined, undefined);
        }),
        modelSaveStub = sinon.stub(mongoose.Model.prototype, "save", function (cb) {
          cb(new Error('mock_db_error'), undefined);
        }),
        wordnikStub = sinon.stub(wordnikService.wordnik, "definitions", function (word, cb) {
          cb(undefined, [{etc:'etc'}]);
        });
      wordnikService.getWord('contrapuntal')
        .then(function () {}, function (err) {
          assert.equal(err.message, 'mock_db_error');
          modelFindOneStub.restore();
          wordnikStub.restore();
          modelSaveStub.restore();
          done();
        });
    });

    it("should resolve if cache save succeeds", function (done) {
      var mockWordDocument = {word:'contrapuntal'},
        modelFindOneStub = sinon.stub(wordnikService.wordModel, "findOne", function (query, cb) {
          cb(undefined, undefined);
        }),
        modelSaveStub = sinon.stub(mongoose.Model.prototype, "save", function (cb) {
          cb(undefined, mockWordDocument);
        }),
        wordnikStub = sinon.stub(wordnikService.wordnik, "definitions", function (word, cb) {
          cb(undefined, [{etc:'etc'}]);
        });
      wordnikService.getWord('contrapuntal')
        .then(function (wordDocument) {
          assert.equal(wordDocument, mockWordDocument);
          modelFindOneStub.restore();
          wordnikStub.restore();
          modelSaveStub.restore();
          done();
        }, function () {});
    });

  });

});