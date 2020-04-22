/*
	user roles for onboarding and menu options
*/

module.exports = function() {
	return Meteor.user().iamRoles
}