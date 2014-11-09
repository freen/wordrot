module.exports = function(app) {

	app.get('/debug/session/purge/?', function(req,res) {
	  req.session = {};
	  res.send(req.session);
	});

	app.get('/debug/session/?', function(req,res) {
	  res.send(req.session);
	});

};