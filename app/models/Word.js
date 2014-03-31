define([
	"underscore",
	"backbone",
	"config"],
	function(_, Backbone, config) {

  "use strict";

  var Word = Backbone.Model.extend({
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