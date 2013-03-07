// js/views/newGame.js

/** To start a new game. */

app.NewGameView = Backbone.View.extend({
    el: 'div.new_game_prompt',
    template: $('#new_game_prompt').html(),

    // The <ul> to which we will append the ListViews (<li>'s)
    $ul: null,

    initialize: function( availableLists ) {
        this.$ul = this.$('ul.list_options');
        this.collection = availableLists;
        console.log(this.collection);
        this.render();
    },

    render: function() {
        this.$ul.html('');
        _.each( this.collection.models, function( item ) {
            this.renderListOption( item );
        }, this );
    },

    renderListOption: function( item ) {
        var listView = new app.NewGameListOptionView({
            model: item
        });
        this.$ul.append( listView.render().el );
    }
});