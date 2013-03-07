// js/views/newGameListOption.js

/** To start a new game. */

app.NewGameListOptionView = Backbone.View.extend({
    tagName: 'li',
    className: 'list_option_view',
    template: $('#new_game_prompt_list_option').html(),

    render: function() {
        var tmpl = _.template( this.template );
        this.$el.html( tmpl( this.model.toJSON() ) );
        return this;
    }
});