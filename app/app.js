define([
  "jquery",
  "underscore",
  "backbone",
  "layoutmanager",
  "handlebars",
  "config",
  "models/User",
  "collections/Words"],
  function($, _, Backbone, Layout, Handlebars, config, User, Words) {

    "use strict";

    Backbone.Layout.configure({
      manage: true,
      prefix: "templates/",
      paths: {
        views: "../app/views"
      },

      // This method will check for prebuilt templates first and fall back to
      // loading in via AJAX.
      fetchTemplate: function(path) {
        // Check for a global JST object.  When you build your templates for
        // production, ensure they are all attached here.
        var JST = window.JST || {};

        path = path + ".html";

        // If the path exists in the object, use it instead of fetching remotely.
        if (JST[path]) {
          return JST[path];
        }

        // If it does not exist in the JST object, mark this function as
        // asynchronous.
        var done = this.async();

        $.ajax({
          url: path,
          global: false,
          async: false,
          success: function(contents) {
            done(JST[path] = Handlebars.compile(contents));
          }
        });
      }
    });

    var app = {
      // User data
      user: new User({}),
      words: new Words(),
      config: config,
      loadUser: function(async) {
        async = async || true;
        var that = this;
        $.ajax(config.apiRoot + '/auth/me', {
          async: async,
          dataType: 'json',
          success: function(userObject) {
            that.user.set(userObject);
          }
        });
      }
    };

    app.user.on('change', function() {
      app.words.fetch({reset:true});
    });

    return app;

});