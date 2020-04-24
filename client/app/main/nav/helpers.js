document.title = "Open Source Hollywood";

Template.nav.onRendered(function() {
  $('.login').mouseenter();
});

Template.nav.helpers({
  finishedLoading: function() {
    return Session.get('connectReady');
  },
  superAdmin: function() {
    return (Meteor.user()._id==='NtwHRpqPZCRiMkbsK' || Meteor.user()._id==='RKgbrBSd9gEfm4cJP' || Meteor.user()._id==='h6hMjCTqgvju6S6ES' || Meteor.user()._id==='Kf4kzSmLze9jYPYh3' || Meteor.user()._id==='k69vzFMz9MhwxqQv2');
  },
  view: function() {
    try {
      if (Meteor.user().iamRoles.indexOf('view')>-1||Meteor.user().iamRoles.indexOf('roles')>-1||Meteor.user().iamRoles.indexOf('assets')>-1||Meteor.user().iamRoles.indexOf('assets')>-1) {
        return true
      };
    } catch(e) {}
    return false
  },
  producer: function() {
    try {
      if (Meteor.user().iamRoles.indexOf('producer')>-1) {
        return true
      };
    } catch(e) {}
    return false
  },
  artist: function() {
    try {
      if (Meteor.user().iamRoles.indexOf('producer')>-1||Meteor.user().iamRoles.indexOf('roles')>-1) {
        return true
      };
    } catch(e) {}
    return false
  },
  assets: function() {
    try {
      if (Meteor.user().iamRoles.indexOf('assets')>-1) {
        return true
      };
    } catch(e) {}
    return false
  },
})

