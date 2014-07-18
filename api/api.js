var _ = require('lodash')
  , async = require('async')
  , express = require('express')
  , MongoStore = require('connect-mongo')(express)
  , Words = require('./db/words')
  , Users = require('./db/users')
  , config = require('./config');

var app = express()
  , words = new Words
  , users = new Users
  , prefix = config.http.apiUrlPrefix;

app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({
    secret:config.http.cookieSecret,
    store: new MongoStore({
      db: config.mongodb.database,
      host: config.mongodb.host
    })
}));

function refuseIfNotAuthenticated(req, res, errorResponse) {
  errorResponse = errorResponse || {
    success: false,
    error: "You must be authenticated to use this endpoint."
  };
  if(req.session.userDocument) {
    return true;
  }
  res.send(errorResponse);
  return false;
}

// global controller
app.get(prefix + '/*',function(req,res,next) {
  req.session.userDocument = req.session.userDocument || undefined;
  res.set('Content-Type', 'application/json');
  next();
});

app.get(prefix + '/debug/session/purge/?', function(req,res) {
  req.session = {};
  res.send(req.session);
});

app.get(prefix + '/debug/session/?', function(req,res) {
  res.send(req.session);
});

app.get(prefix + '/auth/logout/?', function(req,res) {
  req.session.userDocument = undefined;
  res.send({});
});

app.get(prefix + '/auth/me/?', function(req,res) {
  if(!refuseIfNotAuthenticated(req, res)) return;
  res.send(req.session.userDocument);
});

// Temp "authentication" gateway for testing user-based data model
// @todo why does this route send a null response for new records?
app.get(prefix + '/auth/switch-user/:user/?', function(req, res) {
  var username = req.params.user;
  function registerUser(userDocument) {
    // @note caching considerations
    req.session.userDocument = userDocument;
    res.send(userDocument);
  }
  users.fetchUserByName(username, function(userDocument) {
    if(undefined === userDocument) {
      users.addUser(username, function(err, userDocument) {
        return registerUser(userDocument);
      });
    } else {
      return registerUser(userDocument);
    }
  });
});

// Disallow all words routes unless authenticated
app.all(prefix + '/words*?', function(req,res,next) {
  if(!refuseIfNotAuthenticated(req, res, [])) return;
  next();
});

app.delete(prefix + '/words/:word/?', function(req, res) {
  var userWords = req.session.userDocument.words,
      word = req.params.word,
      pos = userWords.indexOf(word);
  if(-1 !== pos) {
    userWords.splice(pos,1);
    res.send({success:true});
    return;
  }
  res.send({success:false});
});

app.get(prefix + '/play/word-on-deck/?', function(req, res){
  if(!refuseIfNotAuthenticated(req, res)) return;
  
  var userDocument = req.session.userDocument
    , poorestUserWord
    , poorestWordDocument;

  async.waterfall([
    // Function poorest user word
    function(callback) {
      users.fetchPoorestPerformingWordByUser(userDocument.name, function(userWord) {
        if(!userWord) {
          return callback(new Error('Undefined result for poorest performing user word.'));
        }
        console.log('Poorest user word:', userWord);
        callback(null, userWord);
      });
    },
    // Fetch word's document
    function(userWord, callback) {
      words.fetchWord(userWord.word, function(wordDocument) {
        if(!wordDocument) {
          return callback(new Error('Undefined result for wordDocument.'));
        }
        var response = {
          success: true,
          userWord: userWord,
          word: wordDocument
        };
        console.log('Poorest word document:', userWord);
        callback(null, response);
      });
    }
  ], function (err, result) {
    if(err) {
      res.send({success:false,error:err});
      return;
    }
    res.send(result);
  });
});

app.get(prefix + '/words/?', function(req, res) {
  // @note low hanging fruit for optimization, should be cached in session
  var userWords = _.clone(req.session.userDocument.words);
  async.each(
    userWords,
    // For each user word, populate the word's definition
    function(word, callback) {
      words.fetchWord(word.word, function(wordDocument) { 
        word.definition = wordDocument;
        callback();
      });
    },
    // Respond with user words, now with populated definitions
    function() {
      res.send(userWords);
    }
  );
});

app.get(prefix + '/words/:word/?', function(req, res) {
  words.fetchWord(req.params.word, function(wordDocument) {
    res.send(wordDocument);
  });
});

app.post(prefix + '/words/?', function(req, res) {
  var userWords = req.session.userDocument.words
    , userDocument = req.session.userDocument
    , word = req.body.word
    , wordEntry = _.find(userWords, function(entry) { return entry.word == word; });
  words.fetchWord(word, function(wordDocument) {
    if(!wordDocument) {
      res.status(404);
      res.send({error: 'No definitions found'});
      return;
    }
    if(undefined === wordEntry) {
      wordEntry = {
        word: word,
        hits: 0,
        misses: 0,
        created: new Date,
        modified: new Date
      };
      userWords.push(wordEntry);
      users.userCollection.updateById(userDocument._id, {$push: {words: wordEntry}});
    }
    res.send(wordEntry);
  });
});

app.listen(3000);