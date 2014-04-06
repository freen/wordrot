define([
  "underscore",
  "backbone",
  "models/Word"],
  function(_, Backbone, Word) {

  "use strict";

  var Words = Backbone.Collection.extend({
    model: Word,
    url: '/wordrot-api/words'
  });

  return Words;

});