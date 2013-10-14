var email = require("emailjs");
var server  = email.server.connect({
   user:    "dailycoding.danghoa1", 
   password:"dailycoding123", 
   host:    "smtp.gmail.com", 
   ssl:     true
});

exports.checklogin = function(username, password)
{
	if (username == undefined || password == undefined)
		return false;
	else 
	{

		if (username == "danghoa1" && password == "test123")
			return true;
		else return false;
	}
}

exports.forgotPassword = function(email, callback)
{
	server.send({
	   text:    "your password is test123", 
	   from:    "DailyCoding <dailycoding.danghoa1@gmail.com>", 
	   to:      "Phi Dang <" + email + ">",
	   //cc:      "else <" + email + ">",
	   subject: "DailyCoding - Reset Password"
	}, callback);
}