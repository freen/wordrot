/**
 * Backbone Views
 * (@WordRotPlayBundle/Resources/public/js/backbone/views.js)
 */

var UserSummaryView = Backbone.View.extend({
	initialize: function() {
		console.log("Initializing UserSummaryView...");
		this.render();
	},
	render: function() {
		var variables = this.model.toJSON();
		variables.wordCount = 0;
		variables.listCount = 0;
		var template = _.template( $("#user_summary_template").html(), variables);
		this.$el.html( template );
	}
});