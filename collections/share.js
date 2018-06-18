Shares = new Mongo.Collection('shares');

Shares.attachSchema(new SimpleSchema({
    total: {
        type: Number
    },
    shares: {
        type: Number
    },
    currentOwner: {
        type: Object
    },
    ownerHistory: {
        type: [String]
    },
    transactionDates: {
        type: [Date]
    },
    lastTransaction: {
        type: Date
    },
    projectId: {
        type: String
    },
    projectSlug: {
        type: String
    },
    projectName: {
        type: String
    },
    projectOwner: {
        type: Object
    },
    earningsToDate: {
        type: Number
    },
    earnings: {
        type: [Object]
    }
}));

// ALLOWS
Shares.allow({
    insert: function(userId, doc) {
        return true;
    },
    update: function(userId, doc) {
        return allowIsShareOwner(userId, Boards.findOne(doc.boardId));
    }
});

