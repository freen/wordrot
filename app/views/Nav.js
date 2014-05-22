define([
  "jquery",
  "underscore",
  "backbone",
  "layoutmanager"],
  function($, _, Backbone, Layout) {

  "use strict";

  var Nav = Backbone.Layout.extend({
    template: 'nav',

    events: { },

    initialize: function () { }

  });

  return Nav;

});