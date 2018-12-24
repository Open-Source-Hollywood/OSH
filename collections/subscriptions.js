Subscriptions = new Mongo.Collection('subscriptions');


Subscriptions.allow({
    insert: function(userId, doc) {
        return true;//allowedUser(userId);
    },
    update: function(userId, doc) {
        return true;//allowedUser(userId);
    },
    remove: function(userId, doc) {
      // only allow posting if you are logged in
      return true;
    }
});