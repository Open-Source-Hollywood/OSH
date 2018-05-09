//Notifications
Meteor.publish('getComms', function() {
    check(this.userId, String);
    return Notifications.find({
    });
});


Meteor.publish('getProjectMessages', function() {
    check(this.userId, String);
    return ProjectMessages.find();
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

Meteor.publish('blogs', function() {
    check(true, Boolean);
    return Blogs.find({});
})