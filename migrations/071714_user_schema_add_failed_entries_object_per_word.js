db.users.find().forEach(function(user) {
	// printjson(user);
	// return;
	user.words.forEach(function(word) {
		// printjson(word);
		var wordMispelled = word.word + 'z';
		word.missAttempts = {};
		word.missAttempts[wordMispelled] = Math.ceil(Math.random() * 10);
	});
	db.users.save(user);
});