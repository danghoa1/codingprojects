loadProjects();
loadIdeas();
loadTechnologies();
	

$(document).ready(function(){
	

	// attempt auto login
	attemptAutoLogin();

	// automatically toggle focus
    $('#login-modal').on('shown', function(){ $('#user-tf').focus(); });


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


function loadProjects()
{

	$.getJSON("/loadprojects")
	.done(function(json){
		var Nprojects = json.length;
		var htmltxt ="";

		if (Nprojects == 0) htmltxt = "<p>No project has been completed.  Please check back later!</p>";
		else 
		{
			if (Nprojects == 1) htmltxt = "<p>There is 1 completed project.</p>";
			else htmltxt = "<p>There are " + Nprojects + " completed projects.</p>";

			htmltxt = htmltxt +
			"<table class=\"table\">  \
				<thead> \
					<tr> \
						<th>Day</th>  \
						<th>Name</th>  \
						<th>Description</th>  \
						<th>Adopted Technologies</th>  \
					</tr>  \
				</thead>";

			htmltxt = htmltxt + "<tbody>";
			var i;
			for(i=0; i < Nprojects; i++)
			{
				htmltxt = htmltxt + 
						
					 "<tr> \
						<td>" + json[i].day + "</td>  \
						<td><div class=\"anchor\" id=\"day" + json[i].day + "\"><a href=\"" + json[i].url + "\">" + json[i].name + "</a></div></td>  \
						<td>" + json[i].description + "</td>  \
						<td>" + json[i].technologies.join(', ') + "</td>  \
					</tr>";
				 
			}
			htmltxt += "</tbody></table>";

			$('#projectlist').html(htmltxt);
		}
	});
}

function loadIdeas()
{

	$.getJSON("/loadideas")
	.done(function(json){
		var Nideas = json.length;
		var htmltxt ="";

		if (Nideas == 0) htmltxt = "<p>No new idea has been added.  Please check back later!</p>";
		else 
		{
			var i;
			for(i=0; i < Nideas; i++)
			{
				htmltxt = htmltxt + 
				"<p>" + json[i].name + "</p>";
			}             
			
			$('#idealist').html(htmltxt);
		}
	});
}

function loadTechnologies()
{
	$.getJSON("/loadtechnologies")
	.done(function(json){
		var Ntechnologies = json.length;
		var htmltxt ="";

		if (Ntechnologies == 0) htmltxt = "<p>No technology has been adopted.  Please check back later!</p>";
		else 
		{
			if (Ntechnologies == 1) htmltxt = "<p>There is 1 adopted technology.</p>";
			else htmltxt = "<p>There are " + Ntechnologies + " adopted technologies.</p>";

			htmltxt +=
			"<table class=\"table\">  \
				<thead> \
					<tr> \
						<th class=\"span3\">Name</th>  \
						<th>Related Projects</th>  \
					</tr>  \
				</thead>";

			htmltxt += "<tbody>";
			
			for(var i=0; i < Ntechnologies; i++)
			{
				// Name
				htmltxt += "<tr><td>" + json[i].name + "</td><td>"; 

				// Projects
				for (var j=0; j < json[i].related.length; j++)
				{
					var projectNo = json[i].related[j];
					
					if (j>0) htmltxt += " , ";
					htmltxt += "<a href=\"#day" + projectNo + "\">" + projectNo + "</a>";

				}

				// End row
				htmltxt = htmltxt + "</td></tr>";
				 
			}
			htmltxt += "</tbody></table>";

			$('#techlist').html(htmltxt);

		}
	});
}