require.config({
  paths: {
    // Libraries
    "jquery":         "lib/jquery",
    "underscore":     "lib/underscore",
    "handlebars":     "lib/handlebars.min",
    "backbone":       "lib/backbone",
    "layoutmanager":  "lib/backbone.layoutmanager",

    // Application
    "app":          "app",
    "config":       "app.config",
    "views":        "views",
    "collections":  "collections"
  },
  shim: {
    'handlebars': {
      exports: 'Handlebars'
    },
    'config': {
      exports: 'config'
    }
  }
});