module.exports = function(app) {

	app.get('/', function(req, res) {
		// Send a plain text response
		res.sendFile('login.html' , { root : __dirname});
	});


	app.get('/', function(req, res) {
		// Send a plain text response
		res.sendFile('game.html' , { root : __dirname});
	});

  app.get('/jquery.min.js', function(req, res) {
		// Send a plain text response
		res.sendFile('jquery.min.js' , { root : __dirname});
	});

	app.get('/data.json', function(req, res) {
		// Send a plain text response
		res.sendFile('data.json' , { root : __dirname});
		console.log("found");
	});



};
