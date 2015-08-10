var _ = require('lodash'),
  express = require('express'),
  Promise = require('promised-io/promise'),
  Deferred = Promise.Deferred,
  assert = require('assert'),
  sinon = require('sinon'),
  playRoutes = require('../../routes/playRoutes'),
  chai = require("chai"),
  expect = chai.expect;

describe('playRoutes', function () {

  describe('#skipWord', function () {

    it('should 500 if user lookup fails', function (done) {

      var userDocumentStub = sinon.stub(),
        deferredWord = new Deferred();
      deferredWord.reject(undefined);
      userDocumentStub.returns(deferredWord); // getNewWordInPlay

      var authStub = sinon.stub(),
        deferredUser = new Deferred();
      deferredUser.resolve(userDocumentStub);
      authStub.returns(deferredUser); // getCurrentUserDocument

      var appStub = sinon.stub();
      appStub.returns(authStub); // get('auth')

      var skipWordBound = _.bind(appStub, playRoutes.skipWord);

      var resMock = sinon.mock({status:function(){}}),
        expectStatus = resMock.expects('status');
      expectStatus.withArgs(500);

      //console.log(expectStatus);

      skipWordBound(undefined, resMock);

      var p = new Promise();

      expect(p.resolve(expectStatus.called)).to.eventually.equal(true)

      //  .then(function(){
      //  expectStatus.verify();
      //  done();
      //})

      //expectStatus.verify();
    });

    it('should return new word in play', function () {

      var mockWordDoc = {word:'ketch'},
        userDocumentStub = sinon.stub(),
        deferredWord = new Deferred();
      deferredWord.resolve(mockWordDoc);
      userDocumentStub.returns(deferredWord); // getNewWordInPlay

      var authStub = sinon.stub(),
        deferredUser = new Deferred();
      deferredUser.resolve(userDocumentStub);
      authStub.returns(deferredUser); // getCurrentUserDocument

      var appStub = sinon.stub();
      appStub.returns(authStub); // get('auth')

      var skipWordBound = _.bind(appStub, playRoutes.skipWord);

      var resMock = sinon.mock({send:function(){}}),
        expectSend = resMock.expects('send');
      expectSend.withArgs(mockWordDoc);

      skipWordBound(undefined, resMock);

      expectSend.verify();

    });

  });

});