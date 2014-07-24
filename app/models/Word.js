define([
  "underscore",
  "backbone",
  "models/Base",
  "config"],
  function(_, Backbone, BaseModel, config) {

  "use strict";

  var Word = BaseModel.extend({
    url: config.apiRoot + "/words/",
    defaults: {
      hits: 0,
      misses: 0,
      created: function() { return new Date; },
      modified: function() { return new Date; }
    }
  });

  return Word;

});