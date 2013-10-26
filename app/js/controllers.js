var wordrotControllers = angular.module('wordrotControllers', []);

wordrotControllers.controller('WordListCtrl', ['$scope', 'Word',
	function WordListCtrl($scope, Word) {
		$scope.removeWord = function(word) {
			Word.delete({word:word});
			_.remove($scope.words, function(wordModel) {
				return wordModel.word === word;
			});
		};
		$scope.addWord = function(newWord) {
			var exists = _.find($scope.words, function(w) {
				return w.word === newWord;
			});
			if(undefined === exists) {
				var newWord = new Word({word:newWord});
				newWord.$save(function(w, putResponseHeaders){
						$scope.words.push(w);
				});
			}
			$scope.newWord = '';
		};
		$scope.words = Word.query();
		$scope.orderProp = 'word';
	}]);

wordrotControllers.controller('WordDetailCtrl', ['$scope', '$routeParams', 'Word',
	function WordDetailCtrl($scope, $routeParams, Word) {
		$scope.word = Word.get({word: $routeParams.word});
	}]);