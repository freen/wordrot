require(["config"], function() {

  require([
    "jquery",
    "underscore",
    "backbone",
    "layoutmanager",
    "handlebars",
    "views/WordAdd",
    "views/Login"],
    function($, _, Backbone, Layout, Handlebars, WordAddView, LoginView) {

    "use strict";

    Layout.configure({
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

    var main = new Backbone.Layout({
      template: 'layout',
      views: {
        ".new-word": new WordAddView(),
        ".login": new LoginView()
      }
    });

    main.$el.appendTo('#wordrot-app');
    main.render();

  });

});