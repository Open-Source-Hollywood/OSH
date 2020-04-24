Template.cardMemberPopup.events({
    'click .js-remove-member': function(event, t) {
        var thisUser = this.userId ? this.userId : this.user && this.user._id || null;
        Cards.update(this.cardId, {$pull: {members: thisUser}});
        Popup.close();
    }
});