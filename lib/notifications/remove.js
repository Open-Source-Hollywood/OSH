module.exports = function(notificationType) {
    check(notificationType, String);
    if (Meteor.isClient) return;
    var notification_preferences = Meteor.user().notification_preferences || {};
    if (notificationType==='email') {
        delete notification_preferences['email'];
    } else {
        delete notification_preferences['phone'];
    };
    Meteor.users.update({_id: Meteor.user()._id}, {$set: {notification_preferences: notification_preferences}});
    return('Notification preferences were updated.');
}