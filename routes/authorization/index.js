var ForgotPassword = require('./forgotpassword');
var Login = require('./login');

app.get('/attemptAutoLogin', function(req, res) {

	Login(req.cookies.user, req.cookies.pass, {
		success: function(data) {
			res.send(200, data);
		},
		error: function(error) {
			res.send(400, error);
		}
	});
});

app.post('/attemptManualLogin', function(req, res) {
	console.log(req.param('user'));

	Login(req.param('user'), req.param('pass'), {
		success: function(data) {
			
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

			res.send(200, data);
		},
		error: function(error) {
			res.send(400, error);
		}
	});
});

app.post('/forgotPassword', function(req,res) {

	ForgotPassword(req.param('email'), {

		success: function(message) {
			res.send(200);
		},

		error: function(error) {
			res.send(400);
		}
	});

});


