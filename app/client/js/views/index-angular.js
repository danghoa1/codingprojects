var indexApp = angular.module('indexApp', []);

// Directives ----------------------------------------------------------------------

indexApp.directive('ideaFocus', function ideaFocus($timeout) {
	return function (scope, elem, attrs) {
		scope.$watch(attrs.ideaFocus, function (newVal) {
			if (newVal) {
				$timeout(function() {
					elem[0].focus();
				}, 0, false);
			}
		})
	}
});

// Controllers ----------------------------------------------------------------------

indexApp.controller('ProjectController', function($scope,$http) {

	$http.get('/projects').success(function(data) {
		$scope.projects = data;
	});

});

indexApp.controller('IdeaController', function($scope,$http) {

	$scope.showCompleted = false;
	
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
			console.log("updated idea");
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
		// Back up in case we want to revert
		$scope.backup = angular.extend({},idea);

		// Set editing to true
		$scope['editing' + $scope.ideas.indexOf(idea)] = true;
	}

	$scope.stopEditingIdea = function(idea)
	{
		$scope['editing' + $scope.ideas.indexOf(idea)] = false;
	}

	$scope.addIdea = function()
	{
		var newIdea = {name: '', completed:false}
		$http.post('/ideas', newIdea).success(function(data){
			$scope.ideas.splice(0,0,data);
			$scope.editIdea($scope.ideas[0]);
		});
	}

	$scope.blur = function(idea)
	{
		$scope.stopEditingIdea(idea);
		$scope.updateIdea(idea);
	}

	$scope.keyUp = function(e,idea)
	{
		// Revert idea
		if (e.keyCode == 27)
		{
			$scope.stopEditingIdea(idea);

			// Revert to backup
			$scope.ideas[$scope.ideas.indexOf(idea)] = $scope.backup;
		}

		// Blur on pressing ENTER key
		else if (e.keyCode == 13)
		{
			$scope.stopEditingIdea(idea);
			$scope.updateIdea(idea);
		};
	}
});

indexApp.controller('TechnologyController', function($scope,$http) {

	$http.get('/technologies').success(function(data) {
		$scope.technologies = data;
	});
});