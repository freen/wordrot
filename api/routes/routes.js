
module.exports = function (app) {

  app.get('/*', function(req,res,next) {
    app.get('auth').initialize(req.session);
    res.set('Content-Type', 'application/json');
    next();
  });

  var abortIfNotAuthenticated = app.get('abortIfNotAuthenticated'),
    playRoutes = require('./playRoutes');

  require('./auth')(app);
  require('./debug')(app);

  // todo shift to auth routes as general util
  app.all('/play*?', function(req,res,next) {
    if(!abortIfNotAuthenticated(req, res)) return;
    next();
  });

  // testing, rm after:
  app.get('/play/skip-word-in-play/?',  playRoutes.skipWordInPlay);

  app.delete('/play/word-in-play/?',  playRoutes.skipWordInPlay);
  app.all('/play*?',                  playRoutes.loadWordInPlay);
  // Subsequent play routes need to know the "word in play"
  app.put('/play/answer/?',           playRoutes.submitAnswer);
  app.all('/play/word-in-play/?',     playRoutes.wordInPlay);

  require('./words')(app);

};