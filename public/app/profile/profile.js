'use strict';

angular.module('nodeAuthentication.profile', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/profile', {
    templateUrl: 'profile/profile.html',
    controller: 'ProfileCtrl'
  });
}])

.controller('ProfileCtrl', ['$scope', '$location','SessionService','AuthService', function($scope,$location,SessionService,AuthService) {
	AuthService.getUser(SessionService.getUserId()).then(function(result) {
		$scope.user = result;
	});

	$scope.logout = function() {
		SessionService.destroy();
		$location.path('/home');
	};

}]);