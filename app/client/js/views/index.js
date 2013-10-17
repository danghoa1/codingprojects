var app = app || {};
var ENTER_KEY = 13;

(function($){



  // Model ------------------------------------------------------------------------

  var Project = Backbone.Model.extend({
    defaults: {
      day: 0,
      name: 'Default',
      description: 'Default, generated by Backbone',
      technologies: 'Backbone JS',
      url: '/'
    },
  });

  var Idea = Backbone.Model.extend({
    
    idAttribute: "_id",

    defaults: {
      name: 'New idea',
      completed: false
    },

  });

  var Technology = Backbone.Model.extend({
    defaults: {
      name: 'test',
      related: []
    },
  });


  // Collection -------------------------------------------------------------------
  

  var ProjectList = Backbone.Collection.extend({
    model: Project,
    url: '/projects',

  });

  var IdeaList = Backbone.Collection.extend({
    model: Idea,
    url: '/ideas'
  });

  var TechnologyList = Backbone.Collection.extend({
    model: Technology,
    url: '/technologies'
  });


  // View ------------------------------------------------------------------------


  var ProjectView = Backbone.View.extend({
    tagName: 'tr', // name of (orphan) root tag in this.el

    initialize: function(){
      _.bindAll(this, 'render'); // every function that uses 'this' as the current object should be in here
      
    },

    render: function(){
      $(this.el).html(

            '<td>' + this.model.get('day') + '</td>  \
            <td><div class="anchor" id="day' + this.model.get('day') + '"><a href="' + this.model.get('url') + '">' + this.model.get('name') + '</a></div></td>  \
            <td>' + this.model.get('description') + '</td>  \
            <td>' + this.model.get('technologies').join(', ') + '</td>');
      return this; // for chainable calls, like .render().el
    }
  });

  var ProjectListView = Backbone.View.extend({
    el: $('#projectlist'),  // attaches `this.el` to an existing element.

    events: {
    },

    initialize: function() {
      
      var self = this; 

      _.bindAll(this, 'render'); // remember: every function that uses 'this' as the current object should be in here

      this.collection = new ProjectList();

      this.collection.fetch({success: function() {self.render();}});

      this.render();
    },

    render: function(){

      switch (this.collection.length)
      {
        case 0:
          $(this.el).html("<p>No project has been completed.  Please check back later!</p>");
          break;
        case 1:
          $(this.el).html("<p>There is 1 completed project.</p>");
          break;
        default:
          $(this.el).html("<p>There are " + this.collection.length + " completed projects.</p>");
          break;
      };

      if (this.collection.length>0)
      {

        $(this.el).append(
              
          '<table class="table">  \
            <thead> \
              <tr> \
                <th>Day</th>  \
                <th>Name</th>  \
                <th>Description</th>  \
                <th>Adopted Technologies</th>  \
              </tr>  \
            </thead> \
            <tbody> \
            </tbody>  \
            </table>');

        this.collection.each(function(model){ // in case collection is not empty
          
          var projectView = new ProjectView({
            model: model
          });
          $('table tbody', this.el).append(projectView.render().el);

        }, this);

      }
    }
  });

  
  var IdeaView = Backbone.View.extend({

    tagName: 'tr', // name of (orphan) root tag in this.el

    events: {
      'click .idea-checkbox' : 'checkboxClicked',
      'click .idea-text.incomplete': 'editIdea',
      'keyup .idea-text.edit': 'updateOnKey',
      'blur .idea-text.edit': 'stopEditing',
      'mouseover' : 'showDeleteButton',
      'mouseout' : 'hideDeleteButton',
      'click .close' : 'destroy'
    },

    initialize: function(){
      _.bindAll(this, 'render', 'editIdea', 'stopEditing', 'updateOnKey'); // every function that uses 'this' as the current object should be in here
      this.editing = false;
    },

    render: function(){
      
      $(this.el).html(
        '<td class="checkbox-column"><input type="checkbox" class="idea-checkbox"' + (this.model.get('completed') ? ' checked' : '') + '></td>  \
        <td class="idea-text-column"></td> \
        <td class="delete-idea-column"><a class="close" style="visibility:hidden;">x</a></td>');

      if (this.editing) 
        $('.idea-text-column' , this.el).html('<input class="idea-text edit" value ="' + this.model.get('name') + '">');    
      else
        $('.idea-text-column' , this.el).html('<p class="idea-text' + (this.model.get('completed') ? ' complete' : ' incomplete') + '">' + this.model.get('name') + '</p>');

      return this; // for chainable calls, like .render().el
    },

    checkboxClicked: function(){

      var self = this;
      this.model.set({'completed':$('.idea-checkbox', this.el).is(':checked')});
      this.model.save();
      this.render();
    },

    editIdea: function(){
      this.editing = true;
      this.render();
      $('.idea-text.edit', this.el).focus();
    },

    updateOnKey: function(e){
      if (e.keyCode == 13 || e.keyCode == 27) {
        this.stopEditing();
      }
    },

    stopEditing: function(){
      this.model.set({'name' : $('.idea-text.edit', this.el).val()});
      this.model.save();
      this.editing = false;
      this.render();
    },

    showDeleteButton: function(){
      $('.delete-idea-column a', this.el).css('visibility', 'visible');
    },

    hideDeleteButton: function() {
      $('.delete-idea-column a', this.el).css('visibility', 'hidden');
    },

    destroy: function() {
      var self = this;
      this.model.destroy( {success: function () {
        $(self.el).remove();
      }});
    }

  });

  var IdeaListView = Backbone.View.extend({
    el: $('#idealist'),  // attaches `this.el` to an existing element.

    events: {
      'click #new-idea-btn' : 'addNewIdea',
      'click #toggle-completed-btn' : 'toogleCompleted'
    },

    initialize: function() {
      
      var self = this; 

      this.showCompleted = false;

      _.bindAll(this, 'render', 'addNewIdea','addOne','prependOne', 'updateToggleText'); // remember: every function that uses 'this' as the current object should be in here

      this.collection = new IdeaList();

      this.collection.fetch({success: function() {self.render();}});

      this.render();
    },

    render: function(){

      var self = this;

      if (this.collection.length == 0)
        $(this.el).html("<p>No new idea has been added.  Please check back later!</p>");
      else
      {
        $(this.el).html(
              
          ' <p><a id="new-idea-btn">Add new idea</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a id="toggle-completed-btn"></a></p> \
            <table class="table borderless" id="idea-table">  \
            <tbody> \
            </tbody>  \
            </table>');

        this.collection.each(function(item){ // in case collection is not empty
          
          if (item.get('completed') == false || self.showCompleted)
            self.addOne(item);

        }, this);

        this.updateToggleText();
      }
    },

    addOne: function(idea) {
      var ideaView = new IdeaView({
            model: idea
          });
      $('table tbody', this.el).append(ideaView.render().el);
      return ideaView;
    },

    prependOne:function(idea) {
      var ideaView = new IdeaView({
            model: idea
          });
      $('table tbody', this.el).prepend(ideaView.render().el);
      return ideaView;
    },

    addNewIdea : function()
    {
      var self = this;
      var newIdea = new Idea;

      this.collection.create(newIdea, {success: function(){
        var ideaView = self.prependOne(newIdea);
        ideaView.editIdea();
      }});
    },

    // Toggle stuff -------------------------------------------------------



    updateToggleText :function()
    {
      var count = 0;

      this.collection.each(function(item) { 
          if (item.get('completed')) count++;
      }, this);

      var text = (this.showCompleted ? 'Hide completed' : 'Show completed') + ' (' + count + ')' ;
      $('#toggle-completed-btn', this.el).html( text);
    },

    toogleCompleted : function()
    {
      this.showCompleted = !this.showCompleted;
      this.updateToggleText();
      this.render();
    },

  });



  var TechnologyView = Backbone.View.extend({
    tagName: 'tr', // name of (orphan) root tag in this.el

    initialize: function(){
      _.bindAll(this, 'render'); // every function that uses 'this' as the current object should be in here
      
    },

    render: function(){
      $(this.el).html('<td>' + this.model.get('name') + '</td>');

      // For each project day, add anchor
      var htmltxt = '<td>';

      var related = this.model.get('related');

      for (var i =0; i < related.length; i++) {
        if (i > 0) htmltxt += " , ";
        htmltxt +='<a href="#day' + related[i] + '">' + related[i] + '</a>';
      };
      
      htmltxt += '</td>';

      $(this.el).append(htmltxt);

      return this; // for chainable calls, like .render().el
    }
  });

  var TechnologyListView = Backbone.View.extend({
    el: $('#techlist'),  // attaches `this.el` to an existing element.

    events: {
    },

    initialize: function() {
      
      var self = this; 

      _.bindAll(this, 'render'); // remember: every function that uses 'this' as the current object should be in here

      this.collection = new TechnologyList();

      this.collection.fetch({success: function() {self.render();}});

      this.render();
    },

    render: function(){

      switch (this.collection.length)
      {
        case 0:
          $(this.el).html("<p>No technology has been adopted.  Please check back later!</p>");
          break;
        case 1:
          $(this.el).html("<p>There is 1 adopted technology.</p>");
          break;
        default:
          $(this.el).html("<p>There are " + this.collection.length + " adopted technologies.</p>");
          break;
      };

      if (this.collection.length>0)
      {

        $(this.el).append(          
          '<table class="table">  \
            <thead> \
              <tr> \
                <th class="span3">Name</th>  \
                <th>Related Projects</th>  \
              </tr>  \
            </thead> \
            <tbody> \
            </tbody>  \
            </table>');

        this.collection.each(function(model){ // in case collection is not empty
          
          var technologyView = new TechnologyView({
            model: model
          });
          $('table tbody', this.el).append(technologyView.render().el);

        }, this);

      }
    }
  });


  var NavBarView = Backbone.View.extend({

    el: $('#navbar'),  // attaches `this.el` to an existing element.

    events: {
      'click #txt-login' : 'showModal',
      'click #txt-logout': 'logout',
    },

    initialize: function() {
      
      _.bindAll(this, 'render' ,'logout');
      
      var self = this;

      app.authentication.on("change" , self.render);

      this.render();
    },

    render: function(){
      if (app.authentication.isAuthorized() == false)
      {
        $('#login-area',this.el).html("<li><a id=\"txt-login\">Sign in</a></li>");
      }
      else
      {
        $('#login-area',this.el).html("\
          <li><a>Welcome!</a></li>  \
          <li><a id=\"txt-logout\" href=\"#\">Sign out</a></li>");
      }
    },

    showModal : function() {
      
      $('#login-modal').modal();
      $('#login-error').empty();
    },

    logout : function() {
      app.authentication.signedOut();
      this.render();
    },

  });

  var LoginModalView = Backbone.View.extend({

    el: $('#login-form'),

    events : {
      'click #txt-forgot': 'forgotPassword',
    },

    initialize : function() {

       _.bindAll(this, 'render', 'showError');

       var self = this;

       // Initialie login modal form

      $(this.el).ajaxForm({
        url: '/attemptManualLogin',

        beforeSubmit : function(formData, jqForm, options){
          if (app.authentication.validate($('#user-tf').val(), $('#pass-tf').val()) == false){
            self.showError("Invalid username and/or password");
            return false;
          }   
          else {
            
            // append 'remember-me' option to formData to write local cookie //
            formData.push({name:'remember-me', value: $('#remember-me').is(':checked')});
            return true;
          }
        },

        success : function(responseText, status, xhr, $form){
          $('#login-modal').modal('hide');
          app.authentication.authenticated();
        },

        error : function(e){
          self.showError('Please check your username and/or password');
        }
      }); 

    },

    showError : function(err) {
      $('#login-error').html(
        "<div class=\"alert alert-error\">  \
          <a class=\"close\" data-dismiss=\"alert\">×</a>" + err + "</div>");
    },

    forgotPassword : function() {
      $('#login-modal').modal('hide');
      $('#forgot-password-modal').modal();
      $('#forgot-password-error').empty();
    }

  });

  var ForgotModalView = Backbone.View.extend({

    el: $('#forgot-password-form'),

    initialize : function() {

       _.bindAll(this, 'render', 'showError');

       var self = this;

       // Initialie login modal form

      $(this.el).ajaxForm({
        url: '/forgotPassword',

        beforeSubmit : function(formData, jqForm, options){
    
          if (app.authentication.validateEmail($('#email-tf').val()) == false){
            self.showError("Invalid email address");
            return false;
          }   
          else {
            $('#forgot-password-error').html(
        "<div class=\"alert alert-info\">  \
         Please wait ...</div>");
            return true;
          }
        },

        success : function(responseText, status, xhr, $form){
          $('#forgot-password-error').html(
        "<div class=\"alert alert-success\">  \
          <strong>Success!&nbsp;</strong> Your password has been sent.</div>");
        },

        error : function(e){
          self.showError('No account with this email address can be found.');
        }
      }); 

    },

    showError : function(err) {
      $('#forgot-password-error').html(
        "<div class=\"alert alert-error\">  \
          <a class=\"close\" data-dismiss=\"alert\">×</a>" + err + "</div>");
    },

  });

  var projectListView = new ProjectListView();
  var ideaListView = new IdeaListView();
  var technologyListView = new TechnologyListView();

  var navBarView = new NavBarView();
  var loginModalView = new LoginModalView();
  var forgotModalView = new ForgotModalView();

  

})(jQuery);

$(document).ready(function() {
  app.authentication.attemptAutoLogin();
});