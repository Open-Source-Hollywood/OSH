Template.editProject.helpers({
  projCrew: function() {
    return Session.get('crew')
  },
  projCast: function() {
    return Session.get('cast')
  },
  projNeeds: function() {
    return Session.get('needs')
  },
  projSocial: function() {
    return Session.get('social')
  },
  roleStar: function() { if (this.consideration.indexOf('pay')>-1) { return true } return false },
  roleTime: function() { if (this.consideration.indexOf('time')>-1) { return true } return false },
  roleDollar: function() { if (this.consideration.indexOf('escrow')>-1) { return true } return false },
  self: function() {
    return JSON.stringify(this)
  },
  noUserEmail: function() {
    if (Meteor.user()&&Meteor.user().notification_preferences&&Meteor.user().notification_preferences.email&&Meteor.user().notification_preferences.email.verification) {
      return false
    };

    if (Meteor.user()&&Meteor.user().notification_preferences&&Meteor.user().notification_preferences.phone&&Meteor.user().notification_preferences.phone.verification) {
      return false
    };

    return true

  },
  init: function() {
    gifts = this.gifts;
    currentSlug = this._slug;
    currentTitle = this.title;
  },
  neededCheck: function() {
    if (!this.status || this.status==='needed') {
      return 'checked'
    };
  },
  fulfilledCheck: function() {
    if (this.status==='fulfilled') {
      return 'checked'
    };
  },
  thisProjectString: function() {
    return JSON.stringify(this.project)
  }
});

Template.editProject.onRendered(summernoteRender);