
module.exports = function (app) {

  app.get('/*', function(req,res,next) {
    app.get('auth').initialize(req.session);
    res.set('Content-Type', 'application/json');
    next();
  });

  require('./auth')(app);
  require('./debug')(app);
//require('./play')(app);

  var abortIfNotAuthenticated = app.get('abortIfNotAuthenticated'),
    playRoutes = require('./playRoutes');

  // todo shift to auth routes as general util
  app.all('/play*?', function(req,res,next) {
    if(!abortIfNotAuthenticated(req, res)) return;
    next();
  });

  app.delete('/play/word-in-play/?',  playRoutes.skipWord);
  app.all('/play*?',                  playRoutes.loadWordInPlay); // Subsequent play routes need to know the "word in play"
  app.put('/play/answer/?',           playRoutes.submitAnswer);
  app.all('/play/word-in-play/?',     playRoutes.wordInPlay);

  require('./words')(app);

};