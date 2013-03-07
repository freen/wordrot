// js/views/app.js

app.AppView = Backbone.View.extend({
	initialize: function() {
		console.log("Initializing AppView...");

		// Load User Summary
		app.userSummaryView = new app.UserSummaryView();
		this.render();
	},
	render: function() {}
});