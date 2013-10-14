function LoginValidator()
{

}

LoginValidator.prototype.showError = function(message)
{
	$('#login-error').html(
		"<div class=\"alert alert-error\">  \
		<a class=\"close\" data-dismiss=\"alert\">×</a>" 
		+ message   
		+ "</div>");
}


LoginValidator.prototype.validateForm = function()
{
	if ($('#user-tf').val() == '' || $('#pass-tf').val() == ''){
		this.showError("Please fill in both fields")
		return false;	
	}	
	else
	{
		return true;
	}
			
}