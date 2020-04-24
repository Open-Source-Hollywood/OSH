Template.addMemberPopup.events({
    'click .pop-over-member-list li:not(.disabled)': function(event, t) {
        var userId = this._id;
        var boardId = t.data.board._id;
        Boards.update(boardId, {
            $push: {
                members: {
                    userId: userId,
                    isAdmin: false
                }
            }
        });
        Popup.close();
    }
});