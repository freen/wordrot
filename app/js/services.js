var wordrotServices = angular.module('wordrotServices', ['ngResource']);

wordrotServices.factory('Word', ['$resource',
    function($resource){
        return $resource('/words/:word', {}, {
            query: {method:'GET', params:{word:''}, isArray:true},
            save: {method:'POST'}
        });
    }]);