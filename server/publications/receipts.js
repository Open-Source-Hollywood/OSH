Meteor.publish('getReceipts', function() {
    check(this.userId, String);
    return Receipts.find({
        userId: this.userId
    });
});
