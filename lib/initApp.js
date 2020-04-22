/**
	initializes state on client
  */

exports.init = function() {
  Meteor.startup(function () {
    //search
    Session.set('query', '');
    //pagination
    Session.set('iSkip', 0);
    Session.set('iLimit', 30);
    Session.set('pSkip', 0);
    Session.set('pLimit', 30);
    // portal tabs
    Session.set('register', false);
    Session.set('signin', true);
    Session.set('forgot', false);
    delete Session.keys['order'];
    delete Session.keys['locationFilter'];
    delete Session.keys['selectedCategory'];
    delete Session.keys['selectedGenre'];
    delete Session.keys['needsResetOption'];
  });
}