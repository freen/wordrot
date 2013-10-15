var _ = require('lodash')
  , config = require('./config.js')
  , express = require('express')
  , Wordnik = require('wordnik')
  , mongo = require('mongoskin')
  , format = require('util').format;

var app = express()
  , wn = new Wordnik({api_key: config.wordnik.apiKey})
  , db = mongo.db(format("mongodb://%s/%s", config.mongodb.host, config.mongodb.database));

app.use(express.bodyParser());
app.use(express.cookieParser(config.http.cookieSecret));
app.use(express.cookieSession());

function fetchWord(word, fn) {
  var wordCollection = db.collection('words');
  wordCollection.findOne({word: word}, function(err, wordDocument) {
      if(err || !wordDocument) {
        console.log('No word document found for: ' + word);
        wn.definitions(word, function(e, defs) {
          if(0 == defs.length) {
            fn(false);
            return;
          }
          wordDocument = {
            word: word,
            definitions: defs
          };
          wordCollection.insert(wordDocument, function(err, inserted) {
            if(err) throw err;
          });
          fn(wordDocument);
        });
      } else {
        console.log('Word document found for: ' + word);
        fn(wordDocument);
      }
  });
}

// global controller
app.get('/*',function(req,res,next) {
    req.session.words = req.session.words || [];
    res.set('Content-Type', 'application/json');
    next();
});

app.delete('/words', function(req, res){
  var words = req.session.words,
      word = req.params.word,
      pos = words.indexOf(word);
  if(-1 !== pos) {
    req.session.words.splice(pos,1);
    res.send({success:true});
    return;
  }
  res.send({success:false});
});

app.get('/words', function(req, res){
  var words = {},
      wordQty = Object.keys(req.session.words).length;
  _(req.session.words).each(function(word, idx) {
    fetchWord(word, function(wordDocument) {
      words[word] = wordDocument;
      if(idx + 1 == wordQty) {
        res.send(words);
      }
    });
  });
});

app.post('/words', function(req, res){
  var word = req.body.word;
  fetchWord(word, function(wordDocument) {
    if(!wordDocument) {
      res.send({error: 'No definitions found'});
      return;
    }
    res.send(wordDocument);
  });
});

app.listen(3000);