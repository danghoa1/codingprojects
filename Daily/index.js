// Include modules
var express = require('express');	// eases http request/response management
var router = require('./router');

// Create a HTTP server
var app = express(express.logger());


// Serve files to client
app.configure(function () {
	app.use('/font', express.static(__dirname + '/font'));
  	app.use('/css', express.static(__dirname + '/css'));
  	app.use('/js', express.static(__dirname + '/js'));
  	app.use('/html', express.static(__dirname + '/html'));
  	app.use('/img', express.static(__dirname + '/img'));
  	
});

// HTTP request Router (pick the right html)
app.get('/', router.home);


// Listen to a port
var port = process.env.PORT || 5000;
app.listen(port, function() {
	console.log("Listening to port " + port);
});