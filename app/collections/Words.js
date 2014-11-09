define([
  "underscore",
  "backbone",
  "models/Word",
  "config"],
  function(_, Backbone, Word, config) {

  "use strict";

  var Words = Backbone.Collection.extend({
    model: Word,
    url: config.apiRoot + '/words'
  });

  return Words;

});