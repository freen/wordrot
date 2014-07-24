define([
  "jquery",
  "underscore",
  "backbone",
  "layoutmanager",
  "app"],
  function($, _, Backbone, Layout, app) {

  "use strict";

  var Nav = Backbone.Layout.extend({
    template: 'nav',

    events: { },

    initialize: function () {
      var that = this;
      app.user.on('change', function () {
        that.render();
      });
    },

    serialize: function () {
      var context = {};
      if(app.user.get('_id')) {
        context.user = app.user.toJSON();
      }
      return context;
    }

  });

  return Nav;

});