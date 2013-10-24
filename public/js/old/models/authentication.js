var app = app || {};

(function($){

	app.Authentication = Backbone.Model.extend({
		defaults: {
			authorized : false,
		},

		validate : function(username, password) {
			if (username == null || username == "") return false;
			else if (password == null || password == "") return false;
			return true;
		},

		validateEmail: function(email, err) {
			if (email == null || email == "") return false;
			
			var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

			if (!filter.test(email)) return false;

			else return true;
		},

		attemptAutoLogin : function() {
	      	var self = this;
	      	$.get("/attemptAutoLogin", function(success){
	        	if (success) self.set({'authorized' : true});
	      	});
	    },

		authenticated : function() {
			this.set({'authorized' : true});
		},

		signedOut : function() {
			this.set({'authorized' : false});
		},

		isAuthorized : function() {
			return this.get('authorized');
		}
	});

	app.authentication = new app.Authentication();

})(jQuery);