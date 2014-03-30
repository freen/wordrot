var _ = require('lodash')
  , express = require('express')
  , Words = require('./db/words')
  , Users = require('./db/users')
  , config = require('./config');

var app = express()
  , words = new Words
  , users = new Users
  , prefix = config.http.apiUrlPrefix;

app.use(express.bodyParser());
app.use(express.cookieParser(config.http.cookieSecret));
app.use(express.cookieSession());

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
  if(undefined === req.session.userDocument) {
    res.status(403);
    return res.send({error: 'Not logged in'});
  }
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

app.get(prefix + '/words/?', function(req, res) {
  var userWords = req.session.userDocument.words;
  words.fetchWords(userWords, function(wordDocuments) {
    res.send(wordDocuments);
  });
});

app.get(prefix + '/words/:word/?', function(req, res) {
  words.fetchWord(req.params.word, function(wordDocument) {
    res.send(wordDocument);
  });
});

app.post(prefix + '/words/?', function(req, res) {
  var userWords = req.session.userDocument.words
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
      users.updateById(userDocument._id, {$push: {words: wordEntry}});
    }
    res.send(wordEntry);
  });
});

app.listen(3000);