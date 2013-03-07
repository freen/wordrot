// js/routers/router.js

var GameRouter = Backbone.Router.extend({
	routes: {
		'': 'index',
	},

	index: function() {
		/** Is a game in progress? */
		if(app.params.activeGameId) {
			console.log("Game in progress with ID " + app.params.activeGameId);
			// Load it
			// ...
		}
		/** Start a new game */
		else {
			console.log("No game in progress.");
			// Load user's lists
			var availableLists = new app.ListCollection();
			availableLists.fetch({
				success: function( availableLists ) {
					// Prompt to start a new game
					app.NewGamePrompt = new app.NewGameView(availableLists);
				}
			});
		}
	}
});

app.GameRouter = new GameRouter();
Backbone.history.start();