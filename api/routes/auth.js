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

	// Temp "authentication" gateway for testing user-based data model
	// todo why does this route send a null response for new records?
	app.get('/auth/switch-user/:user/?', function(req, res) {
	  var username = req.params.user;
	  function registerUser(userDocument) {
	    // note caching considerations
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

};