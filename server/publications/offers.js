Meteor.publish('myOffers', function() {
    check(this.userId, String);
    return Offers.find({
        offeror: this.userId
    });
});

Meteor.publish('myCurrentOffers', function() {
    check(this.userId, String);
    return Offers.find({
        $or:[
            { offeree: this.userId },
            { offeror: this.userId }
        ],
        pending: {$ne: false}
    });
});

Meteor.publish('myCompletedOffers', function() {
    check(this.userId, String);
    return Offers.find({
        $or:[
            { offeree: this.userId },
            { offeror: this.userId }
        ],
        pending: false,
        rejected: {$ne: true}
    });
});

Meteor.publish('projAssetOffers', function(slug, owner) {
    check(slug, String);
    check(owner, String);
    return Offers.find({
        slug: slug,
        offeree: owner,
        type: 'assets'
    });
});

Meteor.publish('offerById', function(id) {
    check(id, String);
    return Offers.find({
        _id: id
    });
});