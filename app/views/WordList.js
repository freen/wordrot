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
      this.words = window.wordrot.words;
  		var view = this;
  		this.words.on('change', function(){
  			view.render();
  		});
      window.wordrot.user.on('change', function() {
        view.words.fetch();
      });
  	},

  });

  return WordListView;

});