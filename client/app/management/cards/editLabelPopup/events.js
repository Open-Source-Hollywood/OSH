Template.editLabelPopup.events({
    'click .js-delete-label': Popup.afterConfirm('deleteLabel', function(){
        var boardId = Router.current().params.boardId;
        Boards.update(boardId, {
            $pull: {
                labels: {
                    _id: this._id
                }
            }
        });
        Popup.back(2);
    }),
    'submit .edit-label': function(event, tpl) {
        var name = tpl.$('#labelName').val().trim();
        var boardId = Router.current().params.boardId;
        var getLabel = Utils.getLabelIndex(boardId, this._id);
        var selectLabel = Blaze.getData(tpl.$('.js-palette-select:not(.hide)').get(0));
        var $set = {};

        // set label index
        $set[getLabel.key('name')] = name;

        // set color
        $set[getLabel.key('color')] = selectLabel.color;

        // update
        Boards.update(boardId, { $set: $set });

        // return to the previous popup view trigger
        Popup.back();

        event.preventDefault();
    },
    'click .js-select-label': function() {
        Cards.remove(this.cardId);

        // redirect board
        Utils.goBoardId(this.boardId);
    }
});