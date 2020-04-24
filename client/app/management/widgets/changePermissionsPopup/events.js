var currentBoard = function() {
    return Boards.findOne(Router.current().params.boardId);
};

Template.changePermissionsPopup.events({
    'click .js-set-admin, click .js-set-normal': function(event, t) {
        var currentBoard = Boards.findOne(Router.current().params.boardId);
        var memberIndex = getMemberIndex(currentBoard, this.user);
        var isAdmin = $(event.currentTarget).hasClass('js-set-admin');
        var setQuery = {};
        setQuery[['members', memberIndex, 'isAdmin'].join('.')] = isAdmin;
        Boards.update(currentBoard._id, { $set: setQuery });
        Popup.back(1);
    }
});