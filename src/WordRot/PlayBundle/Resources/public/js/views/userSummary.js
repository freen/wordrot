// js/views/userSummary.js

app.UserSummaryView = Backbone.View.extend({
	initialize: function() {
		console.log("Initializing UserSummaryView...");
		this.render();
	},
	render: function() {
		var variables = this.model.toJSON();
		var template = _.template( $("#user_summary_template").html(), variables);
		this.$el.html( template );
	}
});