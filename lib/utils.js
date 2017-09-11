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

isServer = function(callback) {
    return Meteor.isServer && callback();
};
