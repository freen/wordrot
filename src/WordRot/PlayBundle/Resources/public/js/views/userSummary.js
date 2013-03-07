// js/views/userSummary.js

app.UserSummaryView = Backbone.View.extend({
    el: "header .user-summary",
    template: $("#user_summary_template").html(),
	initialize: function() {
		console.log("Initializing UserSummaryView...");

        this.model = new app.User({ id: app.params.userId });
        this.model.fetch();
		this.render();

        this.model.on('change', this.render, this);
	},
	render: function() {
		var variables = this.model.toJSON();
        // If we have more than the ID, the model is loaded and we can render
        // the template without error.
        if(_.keys(variables).length > 1) {
            var template = _.template(this.template, variables);
            this.$el.html( template );
        }
	}
});