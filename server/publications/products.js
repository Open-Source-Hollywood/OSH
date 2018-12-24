Meteor.publish('getProducts', function() {
    check(this.userId, String)
    return Products.find({ owner: this.userId })
});

Meteor.publish('projectProducts', function(slug) {
    check(slug, String)
    return Products.find({ projSlug: slug })
});
