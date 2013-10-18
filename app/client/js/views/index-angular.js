var indexApp = angular.module('indexApp', []);

indexApp.controller('ProjectController', function ProjectController($scope,$http) {

	
	$http.get('/projects').success(function(data) {
		$scope.projects = data;
	});

});

indexApp.controller('IdeaController', function ProjectController($scope,$http) {

	
	$http.get('/ideas').success(function(data) {
		$scope.ideas = data;
	});

});