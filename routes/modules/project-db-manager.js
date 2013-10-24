var async = require('async');
var JSON = require('JSON');
var mongo = require('mongodb');
var io = require('socket.io');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('paulo.mongohq.com', 10079, {auto_reconnect: true});
db = new Db('app18256964', server, {safe: true});


db.open(function(err, db) {
    if(!err) {

        console.log("Connected to 'paulo.mongohq.com' database");

        db.authenticate('danghoa1','database123', function(err) {

        	if (!err) {

        		console.log("Authenticated");

        		// Pre-populate collections

		        db.collection('projects', {safe:true}, function(err, collection) {
		            if (err) {
		                console.log("The 'projects' collection doesn't exist. Creating it with sample data...");
		                populateProjects();
		            }
		        });

		        db.collection('ideas', {safe:true}, function(err, collection) {
		            if (err) {
		                console.log("The 'ideas' collection doesn't exist. Creating it with sample data...");
		                populateIdeas();
		            }
        		});
        	}

        }); 
    }
});


// Functions ---------------------------------------------------------------------------------

exports.loadProjects = function(request,response) {
	
	console.log("loading projects");

	db.collection('projects', function(err, collection) {

	    collection.find().sort({day:1}).toArray(function(err, results) {

	    	for (var i =0; i < results.length; i++)
				results[i].technologies = results[i].technologies.sort();

			results = JSON.stringify(results);
	        response.send(results);

	        
	    });
	  });
};

exports.addNewProject = function(request, response) {

	var project = request.body;
	delete project._id;

	console.log('Adding new project:');
    console.log(JSON.stringify(project));
    db.collection('projects', function(err, collection) {
        collection.insert(project, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error adding new project: ' + err);
                response.send(400,{'error':'An error has occurred'});
            } else {
                console.log('Added ' + project._id);
                response.send(project);
            }
        });
    });
}

exports.loadIdeas = function(request,response) {

	db.collection('ideas', function(err, collection) {
	    
	    collection.find().sort({completed:1}).toArray(function(err, results){

	        response.send(JSON.stringify(results));
	    });
	});
};

exports.loadTechnologies = function(request, response) {
	
	db.collection('projects', function(err, collection) {
	    
	    // Retrieve the names of all technologies used

	    collection.find({},{technologies:1, _id:0}).sort({technologies:1})
	    .toArray(function(err,technlogiesArray){
	    	
			var techarray = [];
			
			// Combine the names into 1 array, removing duplicates

	    	async.each(technlogiesArray, function(technologies,callback){
	    		var i;
	    		for (i=0; i < technologies.technologies.length; i++)
	    			if (techarray.indexOf(technologies.technologies[i]) == -1)
	    				techarray = techarray.concat(technologies.technologies[i]);
	    		return callback(null);
	    	},
	    	function(err) {

	    		var i;
	    		var data = [];

	    		// For each technology, find related projects

	    		async.each(techarray, function(techname, callback) {
	    			var technology = new Object();
	    			technology.name = techname;
	    			
	    			collection.find({technologies:techname}, {day:1, _id:0})
	    			.toArray(function(err, results) {
	    				technology.related = [];
	    				for (var i =0; i < results.length; i++)
	    					technology.related = technology.related.concat(results[i].day);

	    				technology.related.sort();
	    				data.push(technology);
	    				callback(null);
	    			});
	    			
	    		},
	    		function (err) {

	    			// Done.  Sort by technology name and send JSON to client
	    			data.sort(function(a,b) { return a.name> b.name; });

	    			response.send(JSON.stringify(data));
	    		});

	    	});
	    	
	    });
	});	
}

exports.updateIdea = function(request, response) {
	
	var id = request.params.id;
    var idea = request.body;
    delete idea._id;
    console.log('Updating idea: ' + id);
    console.log(JSON.stringify(idea));
    db.collection('ideas', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, idea, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating idea: ' + err);
                response.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                response.send(idea);
            }
        });
    });

}

exports.addNewIdea = function(request, response) {

	var idea = request.body;
	delete idea._id;

	console.log('Adding new idea:');
    console.log(JSON.stringify(idea));
    db.collection('ideas', function(err, collection) {
        collection.insert(idea, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error adding new idea: ' + err);
                response.send(400,{'error':'An error has occurred'});
            } else {
                console.log('Added ' + idea._id);
                response.send(idea);
            }
        });
    });
}

exports.deleteIdea = function(request, response) {

	var id = request.params.id;
    var idea = request.body;
    delete idea._id;
    console.log('Deleting idea: ' + id);
    console.log(JSON.stringify(idea));
    db.collection('ideas', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error deleting idea: ' + err);
                response.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                response.send(idea);
            }
        });
    });

}

// Populate DB ---------------------------------------------------------------------------------

var populateProjects = function() {

}

var populateIdeas = function() {

}

