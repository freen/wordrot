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
		var variables = {
			username: '',
			wordCount: 0,
			listCount: 0
		};
		var template = _.template( $("#user_summary_template").html(), variables);
		this.$el.html( template );
	}
});