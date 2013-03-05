// js/views/appView.js

var app = app || {};

app.AppView = Backbone.View.extend({
	initialize: function() {
		console.log("Initializing AppView...");

		// Fetch User
		var user = new app.User({ id: app.params.user_id });
		user.fetch({
			success: function (user) {

				// Load User Summary
				app.userSummaryView = new app.UserSummaryView({
					el: "header .user-summary",
					model: user
				});
			}
		});

		this.render();
	},
	render: function() {
		// var variables = this.model.toJSON();
		// variables.wordCount = 0;
		// variables.listCount = 0;
		// var template = _.template( $("#user_summary_template").html(), variables);
		// this.$el.html( template );
	}
});