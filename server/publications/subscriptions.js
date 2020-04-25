Meteor.publish('mySubscriptions', function() {
    if (!this.userId) return this.ready();
    check(this.userId, String)
    return Subscriptions.find({ owner: this.userId })
});

Meteor.publish('projectSubscriptions', function(slug) {
    check(slug, String)
    return Subscriptions.find({ slug: slug })
});

Meteor.publish('allSubscribers', function() {
    if (!this.userId) return this.ready();
    check(this.userId, String)
    return Subscriptions.find({ 
    	$or: [
    		{ user: this.userId },
    		{ projectOwnerId: this.userId }
    	]
    })
});