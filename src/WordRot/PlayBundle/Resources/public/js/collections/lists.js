// js/collections/lists.js

app.ListCollection = Backbone.Collection.extend({
    model: app.List,
    url: app.params.rootUrl + 'play/lists'
});