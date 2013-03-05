// js/app.js

var app = app || {};

app.run = function(params) {
	this.params = params;
	new app.AppView();
}