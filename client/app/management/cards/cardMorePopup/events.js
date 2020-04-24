Template.cardMorePopup.events({
    'click .js-delete': Popup.afterConfirm('cardDelete', function() {
        Cards.remove(this.card._id);

        // redirect board
        Utils.goBoardId(this.card.board()._id);
    })
});