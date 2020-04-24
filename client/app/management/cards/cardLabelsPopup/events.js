Template.cardLabelsPopup.events({
    'click .js-select-label': function(event, tpl) {
        var cardId = Template.parentData(2).data.card._id;
        var labelId = this._id;
        var operation;
        if (Cards.find({ _id: cardId, labelIds: labelId}).count() === 0)
            operation = '$addToSet';
        else
            operation = '$pull';

        var query = {};
        query[operation] = {
            labelIds: labelId
        };
        Cards.update(cardId, query);
        event.preventDefault();
    },
    'click .js-edit-label': Popup.open('editLabel'),
    'click .js-add-label': Popup.open('createLabel')
});