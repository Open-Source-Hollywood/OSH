var currentBoard = function() {
    return Boards.findOne(Router.current().params.boardId);
}

Template.removeMemberPopup.helpers({
    user: function() {
        return Users.findOne({'_id': this.userId})
    },
    board: function() {
        return currentBoard();
    }
});