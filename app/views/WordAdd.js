define([
  "jquery",
  "underscore",
  "backbone",
  "layoutmanager",
  "models/Word",
  "app"],
  function($, _, Backbone, Layout, Word, app) {

  "use strict";

  var WordAddView = Backbone.Layout.extend({

    template: 'wordAdd',

    initialize: function () {
      this.words = window.wordrot.words;
      var that = this;
      app.user.on('change', function () {
        that.render();
      });
    },

    serialize: function () {
      var context = {
        user: app.user.toJSON()
      };
      return context;
    },

    events: {
      'click button.add': function (e) {
        e.preventDefault();
        var $word = this.$el.find("input[name=word]")
          , word = $word.val();
        if(_.isEmpty(word)) {
          return;
        }
        var existing = this.words.where({word:word});
        if(existing.length > 0) {
          return;
        }
        this.words.create({word:word});
        $word.val('');
      }

    }
  });

  return WordAddView;

});