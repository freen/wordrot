var _ = require('lodash'),
  async = require('async'),
  Promise = require('bluebird');

exports.skipWordInPlay = function(req, res) {
  app.get('auth')
    .getCurrentUserDocument()
    .done(function(userDocument) {
      userDocument.getNewWordInPlay()
        .done(function(word) {
          res.send({word:word});
        }, function(err) {
          res.status(500).send({error:"Failed to retrieve new word in play.", debug:err});
          return Promise.reject();
        });
    }, function(err) {
      res.status(500).send({error:"User lookup failed", debug:err});
    });
};

exports.loadWordInPlay = function(req,res,next) {
  // todo reconcile (?) async#waterfall with db/service layer promise implementation
  async.waterfall([
    // Fetch word in play
    function(callback) {
      var userDocument = app.get('auth')
        .getCurrentUserDocument()
        .then(function (userDocument) {
          callback(null, userDocument);
        });
      //users.getWordOnDeck(userDocument.name, false, function(wordOnDeck) {
      //  if(!wordOnDeck) {
      //    return callback(new Error('Undefined word on deck.'));
      //  }
      //  callback(null, wordOnDeck);
      //});
    },
    // Fetch word's document
    function(userDocument, callback) {
      // todo verify word in play is defined
      app.get('wordnik')
        .getWord(userDocument.wordInPlay)
        .then(function(wordDoc) {
          userDocument.getWordStats(wordDoc.word);
          //var userWord = users.getWordStatsFromUserDocument(userDocument, wordDoc.word);
          callback(null, {
            userWord: userWord,
            word: wordDoc
          });
        }, function(err) {
          callback(new Error('Undefined result for wordDocument.'));
        });
    }
  ], function (err, wordOnDeck) {
    if(err) {
      res.status(500).send({success:false,error:err});
      return;
    }
    req.session.wordOnDeck = wordOnDeck;
    next();
  });
};

exports.submitAnswer = function(req, res, wordOnDeck) {
  var userDocument = req.session.userDocument;
};

exports.wordInPlay = function(req, res, wordOnDeck) {
  var response = _.assign({success: true}, req.session.wordOnDeck);
  res.send(response);
};