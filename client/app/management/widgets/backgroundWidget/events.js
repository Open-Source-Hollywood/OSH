Template.backgroundWidget.events({
    'click .js-select-background': function(event) {
        var currentBoardId = Router.current().params.boardId;
        Boards.update(currentBoardId, {$set: {
            background: {
                type: 'color',
                color: this.toString()
            }
        }});
        event.preventDefault();
    }
});