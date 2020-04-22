allowIsBoardAdmin = function(userId, board) {
	console.log('allowIsBoardAdmin')
	var user = Users.findOne(userId)
    return _.contains(_.pluck(_.where(board.members, {isAdmin: true}), 'userId'), user._id);
};

allowIsBoardMember = function(userId, board) {
	console.log('allowIsBoardMember')
	var user = Users.findOne(userId)
    return _.contains(_.pluck(board.members, 'userId'), user._id);
};

allowIsShareOwner = function(userId, share) {
	console.log('allowIsShareOwner')
    return userId === share.currentOwner;
};

isServer = function(callback) {
    return Meteor.isServer && callback();
};

exports.Secrets = require('../secrets')