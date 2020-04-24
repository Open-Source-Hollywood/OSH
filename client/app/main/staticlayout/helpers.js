Template.StaticLayout.helpers({
  isUser: function() {
    if (Meteor.user()) return true;
    return false;
  },
  profileSet: function() {
    return Meteor.user().didSetProfile;
  },
  degenerateProfile: function() {
    return Meteor.user().degenerateIAM;
  },
  year: function() {
    return new Date().getYear() + 1900
  }
})