//Notifications
Meteor.publish('getComms', function() {
    check(this.userId, String);
    return Notifications.find({
    });
});

//ProjectMessages
Meteor.publish('getProjectMessages', function() {
    check(this.userId, String);
    return ProjectMessages.find({
    });
});

//Offers
Meteor.publish('offers', function() {
    check(this.userId, String);
    return Offers.find({
    });
});

//Offers
Meteor.publish('accounts', function() {
    check(this.userId, String);
    return BankAccounts.find({
    	user: this.userId
    });
});