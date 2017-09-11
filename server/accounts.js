Meteor.startup(function() {
  Accounts.onCreateUser(function(options, user) {

    return user
  });
});