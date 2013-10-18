var indexApp = angular.module('indexApp', []);

indexApp.controller('ProjectController', function($scope,$http) {

	
	$http.get('/projects').success(function(data) {
		$scope.projects = data;
	});

});

indexApp.controller('IdeaController', function($scope,$http) {

	$scope.showCompleted = true;
	
	$http.get('/ideas').success(function(data) {
		$scope.ideas = data;
	});

	$scope.Ncompleted = function() {
	    var count = 0;
	    angular.forEach($scope.ideas, function(idea) {
	      count += idea.completed ? 1 : 0;
	    });
	    return count;
    };

	$scope.updateIdea = function(idea)
	{
		$http.put('/ideas/' + idea._id, idea).success(function(data){
			alert('success');
		});
	}

	$scope.deleteIdea = function(idea)
	{
		$http.delete('/ideas/' + idea._id, idea).success(function(data){
			$scope.ideas.splice($scope.ideas.indexOf(idea),1);
		});
	}

	$scope.editIdea = function(idea)
	{
		$scope['editing' + $scope.ideas.indexOf(idea)] = true;
	}

	$scope.addIdea = function()
	{
		var newIdea = {name: 'New idea', completed:false}
		$http.post('/ideas', newIdea).success(function(data){
			$scope.ideas.splice(0,0,data);
			$scope.editIdea($scope.ideas[0]);
		});
	}
});

indexApp.controller('TechnologyController', function($scope,$http) {

	
	$http.get('/technologies').success(function(data) {
		$scope.technologies = data;
	});

});