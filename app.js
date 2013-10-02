// Include modules
var express = require('express');	// eases http request/response management
var path = require('path');			// quickly obtains file paths

// Create a HTTP server
var app = express(express.logger());


// Your own super cool function
var logger = function(req, res, next) {
    console.log(req.method + ' ' + req.url);
    next(); // Passing the request to the next handler in the stack.
}

// Serve files to client
app.configure(function () {
	app.use(logger);
	app.set('port', process.env.PORT || 8080);  //process.env.PORT IS A MUST for heroku
	app.set('dirname' , __dirname);
	app.use(express.bodyParser());
	app.use(express.cookieParser());
<<<<<<< HEAD
	app.use(express.session({secret : 'I must code. Daily.'}));
=======
	app.use(express.session({secret: '343 no way you can figure out 343'}));
>>>>>>> bb6e30ad0deda7de8ca462b80e6ab00a8ca7a818
	app.use(express.static(__dirname + '/app/client'));
});

// Router
require('./app/server/router')(app);


// Listen to a port
app.listen(app.get('port'), function() {
	console.log("Listening to port " + app.get('port'));
});
