Events = new Mongo.Collection('Events');

Events.attachSchema(new SimpleSchema({
    title: {
        type: String
    },
    location: {
        type: String
    },
    address: {
        type: String
    },
    directions: {
        type: String
    },
    time: {
        type: String
    },
    date: {
        type: Boolean
    },
    timezone: {
        type: Date,
        denyUpdate: true
    },
    // attendees: {
    //     type: Array
    // },
    createdBy: {
        type: String
    }
}));

// ALLOWS
Events.allow({
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

// HELPERS
Events.helpers({
    people: function() {
        return Users.find({ _id: {$in: this.attendees} });
    }
});


isServer(function() {

    // Let MongoDB ensure that a member is not included twice in the same board
    Meteor.startup(function() {
        Events._collection._ensureIndex({
            '_id': 1,
            'members.userId': 1
        }, { unique: true });
    });

    // Genesis: the first activity of the newly created board
    Events.after.insert(function(userId, doc) {

        // notify by email

    });

});
