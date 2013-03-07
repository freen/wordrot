// js/models/user.js

app.User = Backbone.Model.extend({
	urlRoot: app.params.rootUrl + 'play/users',
	initialize: function() {
		console.log("Loading User with ID " + this.id + "..." );
	}
});