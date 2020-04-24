Template.cardLabelsPopup.helpers({
    isLabelSelected: function(cardId) {
        return _.contains(Cards.findOne(cardId).labelIds, this._id);
    }
});