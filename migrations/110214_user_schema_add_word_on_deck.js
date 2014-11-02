db.users.find().forEach(function(user) {
	// if (!user.hasOwnProperty('wordOnDeck')) {
		user.wordOnDeck = '';
	// }
	db.users.save(user);
});