'use strict';

angular.module('nodeAuthentication.login', ['ngRoute', 'nodeAuthentication.services'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/login', {
    templateUrl: 'login/login.html',
    controller: 'LoginCtrl'
  });
}])

.controller('LoginCtrl', ['$location','$scope','AuthService', function($location, $scope, AuthService) {
	$scope.submit = function() {
		AuthService.login($scope.email, $scope.password).then(function(data){
			$location.path('/profile');
		}, function(error) {
			$scope.errorLogin = true;
			$scope.errorMessage = error.loginMessage;
		});
	};
}]);