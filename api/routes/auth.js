var mongoose = require('mongoose'),
  userSchema = require('../db2/userSchema.js');

module.exports = function(app) {

  var abortIfNotAuthenticated = app.get('abortIfNotAuthenticated');

  app.get('/auth/logout/?', function(req,res) {
    req.session.userDocument = undefined;
    res.send({});
  });

  app.get('/auth/me/?', function(req,res) {
    if(!abortIfNotAuthenticated(req, res)) return;
    res.send(req.session.userDocument);
  });

  // temporary development auth gateway
  app.get('/auth/switch/:user/?', function(req, res) {
    var username = req.params.user,
      userModel = app.get('models').user;
    userModel.findOne(username)
      .exec(function(err, user) {
        if (user) {
          app.get('auth').authenticate(user);
          return res.send(user);
        }
        user = new userModel({name: username});
        user.save(function(err, user) {
          if (err) return res.status(500).send({err:err});
          app.get('auth').authenticate(user);
          res.send(user);
        });
      });
  });

};