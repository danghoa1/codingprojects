var app = app || {};

(function($){

	app.Authentication = Backbone.Model.extend({
		defaults: {
			authorized : false,
		},

		validate : function(username, password, err) {
			if (username == null) {
				err = "Invalid username.";
				return false;
			}
			else if (password == null) {
				err = "Invalid password.";
				return false;
			}
			return true;
		},

		authenticated : function() {
			this.set({'authorized' : true});
		},

		signedOut : function() {
			this.set({'authorized' : false});
		}
	});

	app.authentication = new app.Authentication();

})();