Meteor.publish('getReceipts', function() {
    check(this.userId, String);
    return Receipts.find({
        user: this.userId
    });
});

Meteor.publish('projReceipts', function(slug, owner) {
    check(slug, String);
    check(owner, String);
    return Receipts.find({
        slug: slug,
        owner: owner
    });
});

Meteor.publish('ownerReceipts', function(owner) {
    check(owner, String);
    return Receipts.find({
        owner: owner
    });
});