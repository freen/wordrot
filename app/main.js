require(["require.config"], function(config, Backbone, Layout) {

  require([
    "jquery",
    "underscore",
    "backbone",
    "layoutmanager",
    "handlebars",
    "app",
    "views/WordAdd",
    "views/WordList",
    "views/Login"],
    function($, _, Backbone, Layout, Handlebars, app, WordAddView, WordListView, LoginView) {

      "use strict";

      Backbone.Layout.configure({
        manage: true
      });

      window.wordrot = app;

      // load user w/ blocking
      app.loadUser(false);

      var main = new Backbone.Layout({
        manage: true,
        template: 'layout',
        views: {
          ".new-word": new WordAddView(),
          ".login": new LoginView(),
          ".list-word": new WordListView({collection:app.words})
        }
      });

      main.$el.appendTo('#wordrot-app');
      main.render();

  });

});