//Notifications
Meteor.publish('getComms', function(z) {
    return Notifications.find({
    });
});

//ProjectMessages
Meteor.publish('getProjectMessages', function(z) {
    return ProjectMessages.find({
    });
});

//Offers
Meteor.publish('offers', function(z) {
    return Offers.find({
    });
});