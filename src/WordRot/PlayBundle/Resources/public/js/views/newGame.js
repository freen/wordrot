// js/views/newGame.js

/** To start a new game. */

app.NewGameView = Backbone.View.extend({
    el: 'div.new_game_prompt',
    template: $('#new_game_prompt').html(),

    // The <ul> to which we will append the ListViews (<li>'s)
    $ul: null,

    initialize: function( availableLists ) {
        this.collection = availableLists;
        this.render();
    },

    render: function() {
        // Frame for new game prompt
        var template = _.template( this.template );
        this.$el.html( template );
        this.$ul = this.$('ul.list_options');

        // Fill in the list options with lists from server
        _.each( this.collection.models, function( item ) {
            this.renderListOption( item );
        }, this );
    },

    renderListOption: function( item ) {
        var newGameListOption = new app.NewGameListOptionView({
            model: item
        });
        this.$ul.append( newGameListOption.render().el );
    }
});