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
      _id: 0,
      name: 'test',
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
      'dblclick .idea-text': 'editIdea',
      'keypress .edit': 'updateOnEnter',
      'blur .edit': 'stopEditing'
    },

    initialize: function(){
      _.bindAll(this, 'render'); // every function that uses 'this' as the current object should be in here
      
    },

    render: function(){
      
      $(this.el).html(
        '<td><input class="idea-checkbox" type="checkbox"' + (this.model.get('completed') ? ' checked' : '') + '></td>  \
        <td class="editing idea-text' + (this.model.get('completed') ? ' line-through' : '') + '">' + this.model.get('name') + '</td>');

      return this; // for chainable calls, like .render().el
    },

    checkboxClicked: function(){

      var self = this;
      this.model.set({'completed':$('.idea-checkbox', this.el).is(':checked')});
      this.model.save(null, {
        success: function(model) {
          self.render();
        }
      });
    },

    editIdea: function(){


    }

  });

  var IdeaListView = Backbone.View.extend({
    el: $('#idealist'),  // attaches `this.el` to an existing element.

    events: {
    },

    initialize: function() {
      
      var self = this; 

      _.bindAll(this, 'render'); // remember: every function that uses 'this' as the current object should be in here

      this.collection = new IdeaList();

      this.collection.fetch({success: function() {self.render();}});

      this.render();
    },

    render: function(){

      if (this.collection.length == 0)
        $(this.el).html("<p>No new idea has been added.  Please check back later!</p>");
      else
      {
        $(this.el).html(
              
          '<table class="table borderless">  \
            <tbody> \
            </tbody>  \
            </table>');

        this.collection.each(function(item){ // in case collection is not empty
          
          var ideaView = new IdeaView({
            model: item
          });
          $('table tbody', this.el).append(ideaView.render().el);

        }, this);

      }
    }
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


  var projectListView = new ProjectListView();
  var ideaListView = new IdeaListView();
  var technologyListView = new TechnologyListView();

})(jQuery);