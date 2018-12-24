Projects = new Mongo.Collection('projects');
Comments = new Mongo.Collection('comments');
Notifications = new Mongo.Collection('notifications');
ProjectMessages = new Mongo.Collection('projectMessages');
Offers = new Mongo.Collection('offers');
BankAccounts = new Mongo.Collection('bankAccounts');
Products = new Mongo.Collection('products');


function allowedUser(userId) {
  var allowedUser = Meteor.users.findOne({username:"admin"});
  return (userId && allowedUser && userId === allowedUser._id);
}

Projects.allow({
  insert: function(userId, doc) {
    // only allow posting if you are logged in
    return !! userId;
  },
  update: function(userId, doc) {
    // only allow posting if you are logged in
    return !! userId;
  },
  remove: function(userId, doc) {
    // only allow posting if you are logged in
    return !! userId;
  }
});

Notifications.allow({
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

Offers.allow({
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

BankAccounts.allow({
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

Products.allow({
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
