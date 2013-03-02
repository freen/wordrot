/**
 * Backbone Models
 * (@WordRotPlayBundle/Resources/public/js/backbone/models.js)
 */
var User = Backbone.Model.extend({
	urlRoot: ServerRoutes.playRootUrl + '/users',
	initialize: function() {}
});