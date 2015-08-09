var mongoose = require('mongoose'),
  userSchema = require('../db2/userSchema.js');

module.exports = function(app) {

	var users = app.get('users')
	  , abortIfNotAuthenticated = app.get('abortIfNotAuthenticated');

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
    var username = req.params.user;
	  function registerUser(userDocument) {
	    // note caching considerations
	    req.session.userDocument = userDocument;
	    res.send(userDocument);
	  }
    var userModel = mongoose.model('User', userSchema);
    var p = userModel.findOneByName(username);
			p.then(function(user) {
				registerUser(user);
			}, function(err) {
        var user = new userModel({name: username});
        user.save(function(err, user) {
          if (err) return res.status(500).send({err:err});
          registerUser(user);
        });
			});
	});

};