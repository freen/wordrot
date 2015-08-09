define([
  "underscore",
  "backbone",
  "models/Base",
  "config"],
  function(_, Backbone, BaseModel, config) {

  "use strict";

  // Model accessor to the current word in play
  var WordOnDeck = BaseModel.extend({

    url: config.apiRoot + '/play/word-on-deck',

    skipWord: function(callback) {
      $.ajax({
        url: this.url,
        type: 'DELETE',
        dataType: 'json',
        context: this
      }).done(function(data, status, jqXHR) {
        this.fetch({reset:true});
        callback();
      }).fail(function(jqXHR, status, errorThrown) {
        callback(new Error(errorThrown));
      });
    }

  });

  return WordOnDeck;

});