Template.config.helpers({
	needsEmail: function() {
        var u = Meteor.user()
        return u&&u.notification_preferences&&u.email||false
	}
})