require(["require.config"], function(config) {

  require([
    "jquery",
    "underscore",
    "backbone",
    "layoutmanager",
    "handlebars",
    "app",
    "views/Nav",
    "views/WordAdd",
    "views/WordList",
    "views/Login",
    "views/Play"],
    function($, _, Backbone, Layout, Handlebars, app, NavView, WordAddView, WordListView, LoginView, PlayView) {

      "use strict";

      Backbone.Layout.configure({
        manage: true
      });

      window.wordrot = app;

      app.user.fetch();

      var main = new Backbone.Layout({
        manage: true,
        template: 'layout',
        views: {
          "nav": new NavView(),
          ".new-word": new WordAddView(),
          ".login": new LoginView(),
          ".list-word": new WordListView({collection:app.words}),
          ".play": new PlayView()
        }
      });

      app.layout = main;

      var Router = Backbone.Router.extend({
        routes: {
          '': 'home',
          'play': 'play',
        },

        initialize: function() { },

        home: function() {
          app.layout.views['.list-word'].$el.show();
          app.layout.views['.play'].$el.hide();
        },

        play: function() {
          app.layout.views['.list-word'].$el.hide();
          app.layout.views['.play'].$el.show();
        }
      });

      app.Router = new Router();

      Backbone.history.start({pushState: true});

      main.$el.appendTo('#wordrot-app');
      main.render();

      /**
       * Hijack links for push state
       * https://gist.github.com/michaelkoper/9402728
       */

      // Use absolute URLs  to navigate to anything not in your Router.
      var openLinkInTab = false;

      // Only need this for pushState enabled browsers
      if (Backbone.history && Backbone.history._hasPushState) {
        
        $(document).keydown(function(event) {
          if (event.ctrlKey || event.keyCode === 91) {
            openLinkInTab = true;
          }
        });
        
        $(document).keyup(function(event) {
          openLinkInTab = false;
        });

        // Use delegation to avoid initial DOM selection and allow all matching elements to bubble
        $(document).delegate("a", "click", function(evt) {
          // Get the anchor href and protcol
          var href = $(this).attr("href");
          var protocol = this.protocol + "//";

          // Ensure the protocol is not part of URL, meaning its relative.
          // Stop the event bubbling to ensure the link will not cause a page refresh.
          if (!openLinkInTab && href.slice(protocol.length) !== protocol) {
            evt.preventDefault();

            // Note by using Backbone.history.navigate, router events will not be
            // triggered.  If this is a problem, change this to navigate on your
            // router.
            Backbone.history.navigate(href, true);
          }
        });

      }

  });

});