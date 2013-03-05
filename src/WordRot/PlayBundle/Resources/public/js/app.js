// js/app.js

app.run = function(params) {
	_.extend(this.params, params);
	new app.AppView();
}