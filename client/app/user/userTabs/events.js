Template.userTabs.helpers({
  counts3: function() {
    var x = Session.get('uCount');
    x = x || 0;
    return x > 3 && Meteor.user();
  },
  counts30: function() {
    var x = Session.get('uCount');
    x = x || 0;
    return x > 30;
  },
  users: function () {
        // producer
        // roles
        // view
        var uLimit = Session.get('uLimit') || 30;
        Session.set('uLimit', uLimit);
        if (Session.equals('uorder', 'all')) {
          var p = Users.find({privacy: false}, {sort: {createdAt: 1}, skip: Session.get('uSkip'), limit: Session.get('uLimit')});
          Session.set('uCount', p.count());
          return p;
        }
        else if (Session.equals('uorder', 'viewer')){
          var p = Users.find({privacy: false, iam: {$in: ['viewer', 'view']}}, {sort: {createdAt: 1}, skip: Session.get('uSkip'), limit: Session.get('uLimit')});
          Session.set('uCount', p.count());
          return p;
        }
        else if (Session.equals('uorder', 'writer')) {
          var p = Users.find({privacy: false, iam: {$in: ['writer', 'producer', 'roles']}}, {sort: {createdAt: 1}, skip: Session.get('uSkip'), limit: Session.get('uLimit')});
          Session.set('uCount', p.count());
          return p;
        }
        else if (Session.equals('uorder', 'actor')) {
          var p = Users.find({privacy: false, iam: {$in: ['actor', 'roles']}}, {sort: {createdAt: 1}, skip: Session.get('uSkip'), limit: Session.get('uLimit')});
          Session.set('uCount', p.count());
          return p;
        }
        else if (Session.equals('uorder', 'director')) {
          var p = Users.find({privacy: false, iam: {$in: ['director', 'producer']}}, {sort: {createdAt: 1}, skip: Session.get('uSkip'), limit: Session.get('uLimit')});
          Session.set('uCount', p.count());
          return p;
        }
        else if (Session.equals('uorder', 'producer')) {
          var p = Users.find({privacy: false, iam: {$in: ['producer']}}, {sort: {createdAt: 1}, skip: Session.get('uSkip'), limit: Session.get('uLimit')});
          Session.set('uCount', p.count());
          return p;
        }
        else if (Session.equals('uorder', 'cinematographer')) {
          var p = Users.find({privacy: false, iam: {$in: ['cinematographer', 'producer', 'roles']}}, {sort: {createdAt: 1}, skip: Session.get('uSkip'), limit: Session.get('uLimit')});
          Session.set('uCount', p.count());
          return p;
        }
        else { /*by default the tab is on hot, in hot order */
          var p = Users.find({privacy: false}, {sort: {createdAt: 1}, skip: Session.get('uSkip'), limit: Session.get('uLimit')});
          Session.set('uCount', p.count());
          return p;
        }
  },
  formattedName: function() {
    return this.firstName + ' ' + this.lastName;
  },
  formattedAvatar: function() {
    return this.avatar;
  },
  formattedBio: function() {
    return this.bio || 'this user has not updated their bio';
  },
  userScore: function() {
    return this.score || 1000
  },
  userRating: function() {
    return this.score || 5
  },
  "click .next": function() {
    var s = Session.get('uSkip');
    s = s + 30;
    Session.set('uSkip', s);
  },
  "click .prev": function() {
    var s = Session.get('uSkip');
    if (s !== 0 && s > 0){
      s = s - 30;
      Session.set('uSkip', s);
    }
  }
});