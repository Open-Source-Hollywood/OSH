module.exports = function(pin) {
    check(pin, String);
    if (Meteor.isClient) return;
    var verificationCode = Meteor.user().phone_verification_code;
    pin = parseInt(pin);
    if (pin===verificationCode) {
        var notification_preferences = Meteor.user().notification_preferences || {};
        var email_preferences = notification_preferences.email || {};
        var phone_preferences = notification_preferences.phone;
        if (phone_preferences.phone) {
            phone_preferences.verification = true;
            phone_preferences.verificationDate = new Date();
            notification_preferences.phone = phone_preferences;
            Meteor.users.update({_id: Meteor.user()._id}, {$set: {notification_preferences: notification_preferences}});
            return('This number is now verified.');
        } 
    } else {
        return('The verification code was invalid, please try again.');
    }
}