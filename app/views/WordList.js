define([
  "jquery",
  "underscore",
  "backbone",
  "layoutmanager",
  "models/Word"],
  function($, _, Backbone, Layout, Words) {

  "use strict";

  var WordListView = Backbone.Layout.extend({
    template: 'wordList',

    initialize: function () {
      var that = this;
      this.collection.on('sync', function(){
        that.render();
      });
    },

    serialize: function () {
      var context = {words: _.clone(this.collection.models)};
      return context;
    }

  });

  return WordListView;

});