$(document).ready(function(){	

	// attempt auto login
	attemptAutoLogin();

	// automatically toggle focus
    //$('#login-modal').on('shown', function(){ $('#user-tf').focus(); });


	var lv = new LoginValidator();

	$('#login-form').ajaxForm({
		url: '/attemptManualLogin',

		beforeSubmit : function(formData, jqForm, options){
			
			if (lv.validateForm() == false){
				return false;
			}   else{
			// append 'remember-me' option to formData to write local cookie //
				formData.push({name:'remember-me', value: $('#remember-me').is(':checked')});
				return true;
			}
		},

		success : function(responseText, status, xhr, $form){
			$('#login-modal').modal('hide');
			showLoggedInStatus();
		},

		error : function(e){
			lv.showError('Please check your username and/or password');
		}
	}); 

});

function attemptAutoLogin()
{
	$.get("/attemptAutoLogin", function(isLoggedIn){
		if (isLoggedIn == true)
		{
			showLoggedInStatus();
		}
		else
		{
			showNotLoginStatus();
		}
	});
}

function showNotLoginStatus()
{
	$('#login-area').html("<li><a  id=\"txt-login\" href=\"#\">Sign in</a></li>");
	$('#txt-login').click(function(){
		$('#login-modal').modal();
	});
}

function showLoggedInStatus()
{
	$('#login-area').html("\
		<li><a>Welcome!</a></li>	\
		<li><a id=\"txt-logout\" href=\"#\">Sign out</a></li>");
	$('#txt-logout').click(function(){
		showNotLoginStatus();
	});
}