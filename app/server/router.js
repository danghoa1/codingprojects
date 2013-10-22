// Include modules
var AccountManager = require('./modules/account-manager.js');
var DBManager = require('./modules/project-db-manager.js');


module.exports = function(app) {

	// Load pages ------------------------------------------------------------------------

	app.get('/hello-backbone', function(req, res) {
		res.sendfile(app.get('dirname') + '/app/client/html/hello-backbone.html');
	});

	app.get('/index-basic-js', function(req, res) {
		res.sendfile(app.get('dirname') + '/app/client/html/index-basic-js.html');
	});	

	app.get('/index-angular', function(req, res) {
		res.sendfile(app.get('dirname') + '/app/client/html/index-angular.html');
	});	

	// Home page ------------------------------------------------------------------------

	app.get('/', function(req, res) {
		res.sendfile(app.get('dirname') + '/app/client/html/index.html');
	});

	app.get('/projects', DBManager.loadProjects);

	app.post('/projects', DBManager.addNewProject);

	app.get('/ideas', DBManager.loadIdeas);

	app.put('/ideas/:id',DBManager.updateIdea);

	app.post('/ideas', DBManager.addNewIdea);

	app.delete('/ideas/:id',DBManager.deleteIdea);

	app.get('/technologies', DBManager.loadTechnologies);

	// Login ------------------------------------------------------------------------------

	app.get('/attemptAutoLogin', function(req, res) {
		if (AccountManager.checklogin(req.cookies.user, req.cookies.pass) == true)
		{
			res.send(200, {'user' : req.cookies.user, 'pass': req.cookies.pass});
		}
		else
		{
			res.send(400);
		}
	});

	app.post('/attemptManualLogin', function(req, res) {
		console.log(req.param('user'));
		if (AccountManager.checklogin(req.param('user'), req.param('pass')) == true)
		{
			// Save username to session
			req.session.user = req.param('user');

			// Save login info to cookie
			console.log(req.param('remember-me'));
			if (req.param('remember-me') == true)
			{
				console.log("remembered");
				res.cookie('user', req.param('user'), {maxAge : 900000});
				res.cookie('pass', req.param('pass'), {maxAge : 900000});
			}
			res.send(200, {'user' : req.param('user'), 'pass': req.param('pass')});
		}
		else 
		{
			res.send(400);
		}
	});

	app.post('/forgotPassword', function(req,res) {

		AccountManager.forgotPassword(req.param('email'), function(err, message) { 
			console.log(err || message); 
			if (err == null || err == "")
				res.send(200);
			else
				res.send(400);
		});

	});
};