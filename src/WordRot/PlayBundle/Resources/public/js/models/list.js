// js/models/list.js

app.List = Backbone.Model.extend({
	urlRoot: app.params.rootUrl + 'play/lists',
    defaults: {
        id: -1,
        permalink: "",
        name: "",
        created_at: "",
        updated_at: "",
        last_activity_at: "",
        username: "",
        user_id: -1,
        description: "",
        number_words_in_list: -1,
        type: "PRIVATE"
    },
	initialize: function() {
        this.id ? console.log("Initializing new list...")
            : console.log("Loading List with ID " + this.id + "...");
	}
});