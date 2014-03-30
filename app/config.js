require.config({
  paths: {
    "jquery":         "lib/jquery",
    "underscore":     "lib/underscore",
    "handlebars":     "bower_components/handlebars/handlebars.min",
    "backbone":       "lib/backbone",
    "layoutmanager":  "lib/backbone.layoutmanager",
    // "views": "views"
  },
  shim: {
      'handlebars': {
          exports: 'Handlebars'
      }
  }
});