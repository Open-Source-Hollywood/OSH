Subscribers = new Mongo.Collection('subscribers');

Blogs = new Mongo.Collection('blogs');

Receipts = new Mongo.Collection('receipts');

// XXX To improve pub/sub performances a card document should included a
// de-normalized number of comments so we don't have to publish the whole list
// of comments just to display the number of them in the board view.
// Receipts.attachSchema(new SimpleSchema({
//     userId: {
//         type: String
//     },
//     projTitle: {
//         type: String
//     },
//     projectId: {
//         type: String
//     },
//     projAccepted: {
//         type: Boolean
//     },
//     projStarted: {
//         type: Boolean
//     },
//     amount: {
//         type: Number
//     },
//     refundAmount: {
//         type: Number
//     },
//     refunded: {
//         type: Boolean
//     },
//     forProjectCreate: {
//         type: Boolean
//     },
//     forProjectApply: {
//         type: Boolean
//     },
//     created: {
//         type: Date
//     },
//     outstandingBalance: {
//         type: Number
//     },
//     receipt: {
//         type: Object
//     }
// }));

// function allowedUser(userId) {
//   var allowedUser = Meteor.users.findOne({_id: userId});
//   return (userId && allowedUser && userId === allowedUser._id);
// }

// // ALLOWS
Receipts.allow({
    insert: function(userId, doc) {
        return true;//allowedUser(userId);
    },
    update: function(userId, doc) {
        return true;//allowedUser(userId);
    },
    remove: function(userId, doc) {
        return false;
    }
});

Subscribers.allow({
    insert: function(userId, doc) {
        return true;//allowedUser(userId);
    }
});

Blogs.allow({
    insert: function(userId, doc) {
        return true;//allowedUser(userId);
    }
});