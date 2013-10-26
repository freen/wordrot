var _ = require('lodash')
  , express = require('express')
  , Words = require('./words')
  , config = require('./config');

var app = express()
  , words = new Words;

app.use(express.bodyParser());
app.use(express.cookieParser(config.http.cookieSecret));
app.use(express.cookieSession());

// global controller
app.get('/*',function(req,res,next) {
    req.session.words = req.session.words || [];
    res.set('Content-Type', 'application/json');
    next();
});

app.delete('/words/:word', function(req, res){
  var userWords = req.session.words,
      word = req.params.word,
      pos = userWords.indexOf(word);
  if(-1 !== pos) {
    userWords.splice(pos,1);
    res.send({success:true});
    return;
  }
  res.send({success:false});
});

app.get('/words/?', function(req, res){
  words.fetchWords(req.session.words, function(wordDocuments) {
    res.send(wordDocuments);
  });
});

app.get('/words/:word', function(req, res){
  words.fetchWord(req.params.word, function(wordDocument) {
    res.send(wordDocument);
  });
});

app.post('/words/?', function(req, res){
  var userWords = req.session.words,
      word = req.body.word,
      pos = userWords.indexOf(word);
  words.fetchWord(word, function(wordDocument) {
    if(!wordDocument) {
      res.status(404);
      res.send({error: 'No definitions found'});
      return;
    }
    if(-1 === pos) {
      req.session.words.push(word);
    }
    res.send(wordDocument);
  });
});

app.listen(3000);