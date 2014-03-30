define([
	"jquery",
	"underscore",
	"backbone"],
	function($, _, Backbone) {

  "use strict";

  var WordAddView = Backbone.View.extend({
  	template: 'wordAdd'
  });

  return WordAddView;

});