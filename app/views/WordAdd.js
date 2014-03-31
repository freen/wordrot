define([
	"jquery",
	"underscore",
	"backbone",
	"layoutmanager",
	"models/Word"],
	function($, _, Backbone, Layout, Word) {

  "use strict";

  var WordAddView = Backbone.Layout.extend({
  	template: 'wordAdd',
  	initialize: function () {
  		this.words = window.wordrot.words;
  	},
    events: {
      'click button.add': function (e) {
        e.preventDefault();
        var $word = this.$el.find("input[name=word]")
          , word = $word.val();
        if(_.isEmpty(word)) {
          return;
        }
        var existing = this.words.where({word:word});
        console.log(existing);
        if(existing.length > 0) {
          return;
        }
        var newWord = new Word({word:word});
        newWord.save();
        this.words.add(newWord);
      }
    }
  });

  return WordAddView;

});