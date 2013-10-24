module.exports = function(username, password, options)
{
	if (username == undefined || password == undefined)
		options.error();
	else 
	{

		if (username == "danghoa1" && password == "test123")
			options.success({user: username, pass: password});
		else options.error();
	}
}