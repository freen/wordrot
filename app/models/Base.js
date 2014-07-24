define([
  "underscore",
  "backbone"],
  function(_, Backbone) {

  "use strict";

  var BaseModel = Backbone.Model.extend({
    
    toJSON: function(options) { 
      return _.clone(this.attributes);
    }
    
  });

  return BaseModel;

});