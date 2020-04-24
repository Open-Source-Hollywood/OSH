Template.createLabelPopup.events({
    // Create the new label
    'submit .create-label': function(event, tpl) {
        var name = tpl.$('#labelName').val().trim();
        var boardId = Router.current().params.boardId;
        var selectLabel = Blaze.getData(tpl.$('.js-palette-select:not(.hide)').get(0));
        Boards.update(boardId, {
            $push: {
                labels: {
                    _id: Random.id(6),
                    name: name,
                    color: selectLabel.color
                }
            }
        });
        Popup.back();
        event.preventDefault();
    }
});