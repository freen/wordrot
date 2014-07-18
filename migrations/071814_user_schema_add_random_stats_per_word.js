db.users.find().forEach(function(user) {
	user.words.forEach(function(word) {
		word.misses = Math.ceil(Math.random() * 10);
		word.hits = Math.ceil(Math.random() * 10);
	});
	db.users.save(user);
});