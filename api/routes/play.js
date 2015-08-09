module.exports = function(app) {

  var _ = require('lodash')
    , async = require('async')
    //, users = app.get('users')
    //, words = app.get('words')
    , abortIfNotAuthenticated = app.get('abortIfNotAuthenticated');

  app.all('/play*?', function(req,res,next) {
    if(!abortIfNotAuthenticated(req, res)) return;
    next();
  });

  // Skip word
  app.delete('/play/word-on-deck/?', function(req, res, next) {
    var userDocument = req.session.userDocument;
    users.getWordOnDeck(userDocument.name, true, function(word) {
      next();
    });
  });

  // Subsequent play routes need to know the "word on deck"
  app.all('/play*?', function(req,res,next) {
    if(!abortIfNotAuthenticated(req, res)) return;
    var userDocument = req.session.userDocument;
    debugger;
    async.waterfall([
      // Fetch word on deck
      function(callback) {
        debugger;
        users.getWordOnDeck(userDocument.name, false, function(wordOnDeck) {
          if(!wordOnDeck) {
            return callback(new Error('Undefined word on deck.'));
          }
          callback(null, wordOnDeck);
        });
      },
      // Fetch word's document
      function(userWordName, callback) {
        words.fetchWord(userWordName, function(wordDoc) {
          if(!wordDoc) {
            return callback(new Error('Undefined result for wordDocument.'));
          }
          var userWord = users.getWordStatsFromUserDocument(userDocument, wordDoc.word);
          callback(null, {
            userWord: userWord,
            word: wordDoc
          });
        });
      }
    ], function (err, wordOnDeck) {
      debugger;
      if(err) {
        res.status(500).send({success:false,error:err});
        return;
      }
      req.session.wordOnDeck = wordOnDeck;
      next();
    });
  });

  app.put('/play/answer/?', function(req, res, wordOnDeck) {
    var userDocument = req.session.userDocument;
  });

  // No matter the method, always respond with the latest word
  app.all('/play/word-on-deck/?', function(req, res, wordOnDeck) {
    var response = _.assign({success: true}, req.session.wordOnDeck);
    res.send(response);
  });

};