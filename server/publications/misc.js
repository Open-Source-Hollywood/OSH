//Notifications
Meteor.publish('getComms', function() {
    check(this.userId, String);
    return Notifications.find({
    });
});

//Receipts
Meteor.publish('getReceipts', function() {
    check(this.userId, String);
    return Receipts.find({
    });
});

//ProjectMessages
Meteor.publish('getProjectMessages', function() {
    check(this.userId, String);
    return ProjectMessages.find({
    });
});