'use strict';

angular.module('nodeAuthentication.signup', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/signup', {
    templateUrl: 'signup/signup.html',
    controller: 'SignupCtrl'
  });
}])

.controller('SignupCtrl', ['$scope', '$location', 'AuthService', function($scope, $location, AuthService) {
	$scope.submit = function() {
		AuthService.signup($scope.email, $scope.password).then(function(data) {
			$location.path('/profile');	
		}, function(error) {
			$scope.errorSignup = true;
			$scope.errorMessage = error.signupMessage;
		});
	};
}]);