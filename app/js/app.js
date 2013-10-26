var wordrotApp = angular.module('wordrotApp', [
	'ngRoute',
	'wordrotControllers',
	'wordrotServices'
]);

wordrotApp.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
			when('/words', {
				templateUrl: 'partials/word-list.html',
				controller: 'WordListCtrl'
			}).
			when('/words/:word', {
				templateUrl: 'partials/word-detail.html',
				controller: 'WordDetailCtrl'
			}).
			otherwise({
				redirectTo: '/words'
			});
	}]);