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