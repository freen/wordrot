define([
  "jquery",
  "underscore",
  "backbone",
  "layoutmanager",
  "app"],
  function($, _, Backbone, Layout, app) {

  "use strict";

  var Play = Backbone.Layout.extend({

    template: 'play',

    events: { },

    initialize: function () {
      this.model = app.wordOnDeck;
      var that = this;
      this.model.on('change', function(){
        that.render();
      });
    },

    serialize: function () {
      if(!this.model.attributes.word) {
        return;
      }
      var wordOnDeck = this.model.toJSON()
        , wordText = wordOnDeck.word.word
        , definitions = wordOnDeck.word.definitions
        , randomDefinition = _.sample(definitions);
      randomDefinition.sequence = parseInt(randomDefinition.sequence) + 1;
      // Remove occurrences of the word from its definition
      var re = new RegExp(wordText, "gi");
      randomDefinition.text = randomDefinition.text.replace(re, "_____");
      return {definition: randomDefinition};
    }

  });

  return Play;

});


