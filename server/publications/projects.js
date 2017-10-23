Meteor.publish('projectsList', function() {
  // Ensure that the user is connected
    //check(this.userId, String);
    return Projects.find({
        archived: false
    });
});

Meteor.publish('activeProjects', function() {
  // Ensure that the user is connected
    check(this.userId, String);
    return Projects.find({
        $and: [
          {archived: false},
          {$or: [
            {ownerId: this.userId},
            {usersApproved: {$elemMatch: {id: this.userId}}}
          ]}
        ]
    });
});

Meteor.publish('receiptsHistory', function() {
  check(this.userId, String);
  return Users.find({_id: this.userId});
})

Meteor.publish('userActiveProjects', function(_id) {
  // Ensure that the user is connected
    check(_id, String);
    return Projects.find({
        $and: [
          {archived: false},
          {ownerId: _id}
        ]
    });
});

Meteor.publish('activeProjectsApplied', function(_id) {
  // Ensure that the user is connected
    check(_id, String);
    return Projects.find({
        archived: false,
        $or: [
          {crewApplicants: {$elemMatch: {'user.id': _id}}},
          {roleApplicants: {$elemMatch: {'user.id': _id}}}
        ]
    });
});

Meteor.publish('activeProjectsApproved', function(_id) {
  // Ensure that the user is connected
    check(_id, String);
    return Projects.find({
        $and: [
          {archived: false},
          {usersApproved: {$elemMatch: {id: _id}}}
        ]
    });
});

Meteor.publish('getProject', function(slug) {
    check(slug, String)
    return Projects.find({slug: slug});
});

Meteor.publish('commentsList', function(slug) {
  check(slug, String)
  return Comments.find({projectId: slug});
});

Meteor.publish('tagsList', function() {
  return Tags.find();
});

Meteor.publish('usersList', function() {
  return Meteor.users.find({});
});

Meteor.publish('getUser', function(_id) {
  check(_id, String);
  return Meteor.users.find({'_id': _id});
});

Meteor.publish('paidForProjects', function() {
  check(this.userId, String);
  // get projects live with accepted user = this.userId
  return Projects.find({live: true, usersApproved: {$elemMatch: {id: this.userId}}});
});

/*  WITH FIELDS ON

  Meteor.publish('getUser', function(meetupId) {
    check(meetupId, String);
    return Meteor.users.find({'profile.meetupId': meetupId}, {fields: {
      _id: 1,
      "profile.bio": 1,
      "profile.createdAt": 1,
      "profile.meetupId": 1,
      "profile.name": 1,
      "profile.socialLinks": 1,
      "profile.thumbnailUrl": 1
    }});
  });

*/