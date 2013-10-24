module.exports = function(app) {

	app.get('/hello-backbone', function(req, res) {
		res.sendfile(app.get('dirname') + '/app/client/html/hello-backbone.html');
	});

	app.get('/index-basic-js', function(req, res) {
		res.sendfile(app.get('dirname') + '/app/client/html/index-basic-js.html');
	});	

	app.get('/index-angular', function(req, res) {
		res.sendfile(app.get('dirname') + '/app/client/html/index-angular.html');
	});	
	
};