module.exports = function(app) {

	var _ = require('lodash')
	  , async = require('async')
	  , users = app.get('users')
	  , words = app.get('words')
	  , abortIfNotAuthenticated = app.get('abortIfNotAuthenticated');

	app.all('/play*?', function(req,res,next) {
	  if(!abortIfNotAuthenticated(req, res)) return;
	  next();
	});

	// Play routes need to know the "word on deck"
	app.all('/play*?', function(req,res,next) {
	  if(!abortIfNotAuthenticated(req, res)) return;
	  var userDocument = req.session.userDocument;
	  async.waterfall([
	    // Fetch word on deck
	    function(callback) {
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
	    if(err) {
	      res.send({success:false,error:err});
	      return;
	    }
	    req.session.wordOnDeck = wordOnDeck;
	    next();
	  });
	});

	app.put('/play/answer/?', function(req, res, wordOnDeck) {
	  var userDocument = req.session.userDocument;
	});

	app.put('/play/skip/?', function(req, res) {

	});

	app.get('/play/word-on-deck/?', function(req, res, wordOnDeck) {
	  var response = _.assign({success: true}, req.session.wordOnDeck);
	  res.send(response);
	});

};