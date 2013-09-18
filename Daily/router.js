exports.home = function(req, res) {
	res.sendfile(__dirname + '/html/index.html');
};

exports.test = function(request,response) {
	response.send('Hello');
};