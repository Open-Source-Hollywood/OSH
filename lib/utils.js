allowIsBoardAdmin = function(userId, board) {
	console.log('allowIsBoardAdmin', userId)
    return _.contains(_.pluck(_.where(board.members, {isAdmin: true}), 'userId'), userId);
};

allowIsBoardMember = function(userId, board) {
	console.log('allowIsBoardMember', userId)
    return _.contains(_.pluck(board.members, 'userId'), userId);
};

allowIsShareOwner = function(userId, share) {
	console.log('allowIsShareOwner', userId)
    return userId === share.currentOwner;
};

isServer = function(callback) {
    return Meteor.isServer && callback();
};

exports.Secrets = require('../secrets')