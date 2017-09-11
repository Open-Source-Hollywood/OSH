Projects = new Mongo.Collection('projects');
Comments = new Mongo.Collection('comments');

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
