// js/views/app.js

app.AppView = Backbone.View.extend({
	initialize: function() {
		console.log("Initializing AppView...");

		// Fetch User
		var user = new app.User({ id: app.params.userId });
		user.fetch({
			success: function (user) {
				// Load User Summary
				app.userSummaryView = new app.UserSummaryView({ model: user });
			}
		});

		this.render();
	},
	render: function() {}
});