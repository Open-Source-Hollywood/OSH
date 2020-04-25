var currentBoard = function() {
    return Boards.findOne(Router.current().params.boardId);
};

Template.memberPopup.events({
    'click .js-change-role': Popup.open('changePermissions'),
    'click .js-remove-member:not(.disabled)': Popup.afterConfirm('removeMember', function(){
        var currentBoardId = Router.current().params.boardId;
        var board = Boards.findOne(currentBoardId);
        Popup.close();
        if (board.createdBy === this.user) {
            vex.alert('project creator cannot be removed');
            return;
        }
        Boards.update(currentBoardId, {$pull: {members: {'_id': this.userId}}});
    }),
    'click .js-leave-member': function(event, t) {
        // @TODO

        Popup.close();
    }
});