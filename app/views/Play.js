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

    events: {
      'keypress input[name=answer]': 'submitAnswer',
      'click button[name=skip]': 'skipWord'
    },

    initialize: function () {
      this.model = app.wordOnDeck;
      var that = this;
      this.model.on('change', function(){
        that.render();
      });
    },

    submitAnswer: function(e) {
      if(e.keyCode != 13) return;

    },

    skipWord: function(e) {
      app.wordOnDeck.skipWord(function(err) {
        if(err) throw err;
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
      randomDefinition.sequenceInt = parseInt(randomDefinition.sequence) + 1;

      // Remove occurrences of the word from its definition
      var re = new RegExp(wordText, "gi");
      randomDefinition.text = randomDefinition.text.replace(re, "_____");

      var context = {
        definitions: []
      };
      definitions.forEach(function(definition) {
        if(definition.sequence != randomDefinition.sequence) {
          context.definitions.push({});
          return;
        }
        context.definitions.push(randomDefinition);
      });

      return context;

    }

  });

  return Play;

});
