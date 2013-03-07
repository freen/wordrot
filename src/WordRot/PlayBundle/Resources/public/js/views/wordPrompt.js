// js/views/wordPrompt.js

/** Frames the word prompt interface */

app.WordPromptView = Backbone.View.extend({
    el: $( '#prompt' ),

    initialize: function( initialBooks ) {
        this.collection = new app.Library( initialBooks );
        this.render();
    },

    render: function() {
        _.each( this.collection.models, function( item ) {
            this.renderBook( item );
        }, this );
    },

    renderBook: function( item ) {
        var bookView = new app.BookView({
            model: item
        });
        this.$el.append( bookView.render().el );
    }
});