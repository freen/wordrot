var wordrotControllers = angular.module('wordrotControllers', []);

wordrotControllers.controller('WordListCtrl', ['$scope', 'Word',
	function WordListCtrl($scope, Word) {
		$scope.removeWord = function(word) {
			Word.delete({word:word}, function(data, responseHeaders) {
				$scope.words = Word.query();
			});
		};
		$scope.addWord = function(newWord) {
			var newWord = new Word({word:newWord});
			newWord.$save(function(w, responseHeaders){
					$scope.words = Word.query();
			});
			$scope.newWord = '';
		};
		$scope.words = Word.query();
		$scope.orderProp = 'word';
	}]);

wordrotControllers.controller('WordDetailCtrl', ['$scope', '$routeParams', 'Word',
	function WordDetailCtrl($scope, $routeParams, Word) {
		$scope.word = Word.get({word: $routeParams.word});
	}]);