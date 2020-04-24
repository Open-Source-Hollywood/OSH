/*
	toggles user onboarded state to true on first login
*/

module.exports = function() {
	Meteor.users.update({_id: Meteor.user()._id}, {$set: {
		onboardBoarding: true
	}});
}