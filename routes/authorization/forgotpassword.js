var email = require("emailjs");
var server  = email.server.connect({
   user:    "dailycoding.danghoa1", 
   password:"dailycoding123", 
   host:    "smtp.gmail.com", 
   ssl:     true
});

module.exports = function(email, options)
{
	server.send({
	   text:    "your password is test123", 
	   from:    "DailyCoding <dailycoding.danghoa1@gmail.com>", 
	   to:      "Phi Dang <" + email + ">",
	   //cc:      "else <" + email + ">",
	   subject: "DailyCoding - Reset Password"
	}, function(err, message) { 

		console.log(err || message); 

		if (err == null || err == "")
			options.success(message);
		else
			options.error(error);
	});
}