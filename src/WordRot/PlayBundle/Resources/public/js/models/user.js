// js/views/userSummary.js

var app = app || {};

app.User = Backbone.Model.extend({
	urlRoot: ServerRoutes.playRootUrl + '/users',
	initialize: function() {
		console.log("Loading User with ID " + this.id + "..." );
	}
});