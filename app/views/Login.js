define([
	"jquery",
	"underscore",
	"backbone"],
	function($, _, Backbone) {

  "use strict";

  var Login = Backbone.View.extend({
  	template: 'login',

    events: {
      "click button.login": "doLogin"
    },

    // Holdover pending real authentication
    doLogin: function(e) {
      e.preventDefault();
      var $username = this.$el.find('input[name=username]')
        , username = $.trim($username.val());
      if(_.isEmpty(username)) {
        return;
      }
      $.ajax({
        // @todo put API root in config
        url: '/wordrot-api/auth/switch-user/' + username
      });
    }
  });

  return Login;

});