// Include modules
var AccountManager = require('./modules/account-manager.js');
var DBManager = require('./modules/project-db-manager.js');


module.exports = function(app) {

	app.get('/', function(req, res) {
		res.sendfile(app.get('dirname') + '/app/client/html/index.html');
	});

	app.get('/hello-backbone', function(req, res) {
		res.sendfile(app.get('dirname') + '/app/client/html/hello-backbone.html');
	});

	app.get('/index-basic-js', function(req, res) {
		res.sendfile(app.get('dirname') + '/app/client/html/index-basic-js.html');
	});	

	// Login ------------------------------------------------------------------------------

	app.get('/attemptAutoLogin', function(req, res) {
		if (AccountManager.checklogin(req.cookies.user, req.cookies.pass) == true)
		{
			res.send(true, 200);
		}
		else
		{
			res.send(false, 200);
		}
	});

	app.post('/attemptManualLogin', function(req, res) {
		if (AccountManager.checklogin(req.param('user'), req.param('pass')) == true)
		{
			// Save login info to cookie
			console.log(req.param('remember-me'));
			if (req.param('remember-me') == true)
			{
				console.log("remembered");
				res.cookie('user', req.param('user'), {maxAge : 900000});
				res.cookie('pass', req.param('pass'), {maxAge : 900000});
			}
			res.send(200);
		}
		else 
		{
			res.send(400);
		}
	})

	app.get('/projects', DBManager.loadProjects);

	app.get('/ideas', DBManager.loadIdeas);

	app.get('/technologies', DBManager.loadTechnologies);

	app.put('/ideas/:id',DBManager.updateIdea);
};