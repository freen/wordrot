/**
 * WordRot Application Container
 * (@WordRotPlayBundle/Resources/public/js/application.js)
 */

var WordRot = {
	run: function(userId) {
		var user = new User({ id: userId });
		user.fetch({
			success: function (user) {
				console.log	(user.toJSON());
				var userSummaryView = new UserSummaryView({
					el: $("header .user-summary"),
					model: user
				});
			}
		});
	}
};