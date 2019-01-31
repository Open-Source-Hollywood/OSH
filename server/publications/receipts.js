Meteor.publish('getReceipts', function() {
    check(this.userId, String);
    return Receipts.find({
        user: this.userId
    });
});

Meteor.publish('getReceipt', function(id) {
    check(id, String);
    check(this.userId, String);
    return Receipts.find({
        _id: id,
        parties: this.userId
    });
});

Meteor.publish('projReceipts', function(slug) {
    check(slug, String);
    return Receipts.find({
        slug: slug
    });
});

Meteor.publish('ownerReceipts', function(owner) {
    check(owner, String);
    return Receipts.find({
        owner: owner
    });
});