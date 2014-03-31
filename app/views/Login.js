define([
	"jquery",
	"underscore",
  "backbone",
	"layoutmanager"],
	function($, _, Backbone, Layout) {

  "use strict";

  var Login = Backbone.Layout.extend({
  	template: 'login',

    events: {
      "click button.login": "doLogin",
      "click a.logout": "doLogout"
    },

    initialize: function () {
      this.model = window.wordrot.user;
      var that = this;
      this.model.on('change', function(){
        console.log('user changed', arguments);
        that.render();
      });
    },

    doLogout: function(e) {
      e.preventDefault();
      var that = this;
      $.ajax(window.wordrot.apiRoot + '/auth/logout', {
        success: function() {
          window.wordrot.user.clear();
        }
      })
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
        url: '/wordrot-api/auth/switch-user/' + username,
        success: function() {
          window.wordrot.loadUser();
        }
      });
    }
  });

  return Login;

});