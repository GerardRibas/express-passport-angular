'use strict';

// Declare app level module which depends on views, and components
angular.module('nodeAuthentication', [
  'ngRoute',
  'nodeAuthentication.services',
  'nodeAuthentication.home',
  'nodeAuthentication.login',
  'nodeAuthentication.signup',
  'nodeAuthentication.profile'
]).
config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
  $routeProvider.otherwise({redirectTo: '/home'});
  $httpProvider.interceptors.push('AuthInterceptor');
}]);

angular.module('nodeAuthentication.services', []).factory('AuthService', ['$http', '$q', 'SessionService',
	function($http,$q,SessionService) {
		var AuthService = {
			login : function(email, password) {
				var d = $q.defer();
				$http.post('/api/login',{'email':email, 'password':password })
					.success(function(data,status,header,config) {
						SessionService.setToken(data.token);
						SessionService.setUserId(data.user_id);
						SessionService.authenticated = true;
						d.resolve(data);
					}).error(function(data,status,header,config) {
						SessionService.destroy();
						d.reject(data);
					});
				return d.promise;
			},
			signup : function(email, password) {
				var d = $q.defer();
				$http.post('/api/signup',{'email':email, 'password':password })
					.success(function(data,status,header,config) {
						SessionService.setToken(data.token);
						SessionService.setUserId(data.user_id);
						SessionService.authenticated = true;
						d.resolve(data);
					}).error(function(data,status,header,config) {
						SessionService.destroy();
						d.reject(data);
					});
				return d.promise;
			},
			getUser : function(userId) {
				var d = $q.defer();
				$http.get('/api/profile')
					.success(function(data,status,header,config) {
						d.resolve(data);
					}).error(function(data,status,header,config) {
						d.reject();
					});
				return d.promise;
			}
		};
		return AuthService;	
	}]).factory('SessionService', function() {
		return {
			authenticated : false,
			getToken : function() {
				return sessionStorage.getItem('auth_token');
			},
			setToken : function(token) {
				sessionStorage.setItem('auth_token', token);
			},
			getUserId : function() {
				return sessionStorage.getItem('userId');
			},
			setUserId : function(user){
				sessionStorage.setItem('userId', JSON.stringify(user));
			},
			destroy : function() {
				this.authenticated = false;
				sessionStorage.removeItem('userId');
				sessionStorage.removeItem('auth_token');
			}
		};
	}).factory('AuthInterceptor', ['$q', '$location', 'SessionService', function($q, $location, SessionService){
		return {
			request: function (config) {
      			config.headers = config.headers || {};
      			if (SessionService.getToken()) {
      				SessionService.authenticated = true;
      				config.headers['x-access-token'] = SessionService.getToken();
      			}
      			return config;
    		}, 
    		responseError: function(rejection) {
      			if (rejection.status === 400) {
        			$location.path('/login');
        			return;
     	 		}
      			return $q.reject(rejection);
    		}		
		}
	}]);