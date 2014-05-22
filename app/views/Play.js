define([
  "jquery",
  "underscore",
  "backbone",
  "layoutmanager"],
  function($, _, Backbone, Layout) {

  "use strict";

  var Play = Backbone.Layout.extend({

    template: 'play',

    events: { },

    initialize: function () { }

  });

  return Play;

});


