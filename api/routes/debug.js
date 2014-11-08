module.exports = function(app, prefix) {

	app.get(prefix + '/debug/session/purge/?', function(req,res) {
	  req.session = {};
	  res.send(req.session);
	});

	app.get(prefix + '/debug/session/?', function(req,res) {
	  res.send(req.session);
	});

};