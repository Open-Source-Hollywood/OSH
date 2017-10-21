Meteor.publish('getReceipts', function() {
    check(this.userId, String);
    return Receipts.find({
        userId: this.userId
    });
});

//Notifications
Meteor.publish('getComms', function() {
    check(this.userId, String);
    return Notifications.find({
        // $or: [
        // 	{
        // 		user: this.userId
        // 	},
        // 	{
        // 		from: this.userId
        // 	}
        // ]
    });
});