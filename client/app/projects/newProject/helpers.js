Template.newProject.onRendered(summernoteRender);


Template.newProject.helpers({
  noUserEmail: function() {
    if (Meteor.user()&&Meteor.user().notification_preferences&&Meteor.user().notification_preferences.email&&Meteor.user().notification_preferences.email.verification) {
      return false
    };

    if (Meteor.user()&&Meteor.user().notification_preferences&&Meteor.user().notification_preferences.phone&&Meteor.user().notification_preferences.phone.verification) {
      return false
    };

    return true
  },
  cachedNewProject: function() {
    var hasCached = false
    try {
      var obj = JSON.parse(localStorage.getItem('projectnew'));
      for (var propName in obj) { 
        if (obj[propName] === null || obj[propName] === undefined) {
          delete obj[propName];
        }
      }
      if (Object.keys(obj).length>0) hasCached = true;
    } catch(e) { } finally {
      return hasCached
    }
  },
  needs: function() {
    var needs = Session.get('needs');
    var _needs = needs.map(function(el, idx) {
      return {
        need: el.need,
        tags: el.tags,
        id: idx
      }
    });
    return _needs;
  },
  gifts: function() {
    var gifts = Session.get('gifts');
    return gifts;
  },
  hasGifts: function() {
    var gifts = Session.get('gifts');
    return gifts && gifts.length > 0;
  },
  basicsTab: function() {
    return Session.get('basicsTab');
  },
  rewardsTab: function() {
    return Session.get('rewardsTab');
  },
  storyTab: function() {
    return Session.get('storyTab');
  },
  aboutTab: function() {
    return Session.get('aboutTab');
  },
  accountTab: function() {
    return Session.get('accountTab');
  },
  previewTab: function() {
    return Session.get('previewTab');
  },
  projectFiles: function() {
    return Session.get('campaignFiles').map(function(f, idx) {
      f.idx = idx;
      return f;
    });
  },
  hasCampaignFiles: function() {
    var files = Session.get('campaignFiles');
    return files && files.length > 0;
  }
});
