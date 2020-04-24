var currentBoard = function() {
    return Boards.findOne(Router.current().params.boardId);
}

Template.changePermissionsPopup.helpers({
    isAdmin: function() {
        return Users.findOne({'_id': this.user}).isBoardAdmin();
    },
    isLastAdmin: function() {
        if (! Users.findOne({'_id': this.user}).isBoardAdmin())
            return false;
        var nbAdmins = _.where(currentBoard().members, { isAdmin: true }).length;
        return nbAdmins === 1;
    }
});