module.exports = function(email) {
    check(email, String);
    if (Meteor.isServer) {
		Subscribers.insert({
			email: email,
			date: new Date()
		});
    };
}