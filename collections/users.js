Users = Meteor.users;
// main ID = user.meetupId

// Search a user in the complete server database by its name or username. This
// is used for instance to add a new user to a board.
// var searchInFields = ['username', 'profile.name'];
// Users.initEasySearch(searchInFields, {
//     use: 'mongo-db',
//     returnFields: searchInFields
// });




// HELPERS
Users.helpers({
    boards: function() {
        return Boards.find({ userId: this._id });
    },
    hasStarred: function(boardId) {
        return this.profile.starredBoards && _.contains(this.starredBoards, boardId);
    },
    isBoardMember: function() {
        var board = Boards.findOne(Router.current().params.boardId);
        return _.contains(_.pluck(board.members, 'userId'), this._id);
    },
    isBoardAdmin: function() {
        var board = Boards.findOne(Router.current().params.boardId);
        return this.isBoardMember(board) && _.where(board.members, {userId: this._id})[0].isAdmin;
    }
});


// BEFORE HOOK
Users.before.insert(function (userId, doc) {
    // connect profile.status default =
    /** create Stripe managed account */
      if (doc.services&&doc.services.auth0&&doc.services.auth0.email) {
        doc.notification_preferences = {
          email: {
            verification: true,
            email: doc.services.auth0.email
          }
        }
      };
      doc.status = 'online';
      doc.didOnboard = false;
      doc.assets = [];
      doc.reels = [];
      doc.iam = [];
      doc.social = [];
      doc.firstName = doc.services && doc.services.auth0 && doc.services.auth0.given_name || '';
      doc.lastName = doc.services && doc.services.auth0 && doc.services.auth0.family_name || '';
      doc.avatar = 'https://s3-us-west-2.amazonaws.com/producehour/avatar.png';
      doc.influenceScore = 1000;
      doc.rating = 5;
      doc.didSetProfile = false;
      doc.privacy = false;    
});
