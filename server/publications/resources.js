Meteor.publish('getResourcesByOwner', function(_id) {
    check(this.userId, String);
    return Resources.find({
        owner: _id
    });
});

Meteor.publish('getResourcesByProject', function(_id) {
    check(this.userId, String);
    return Resources.find({
        project: _id
    });
});