Template.cardMembersPopup.helpers({
    isCardMember: function() {
        if (!this.user && !this.userId) return;
        var cardId = Template.parentData().card._id;
        var cardMembers = Cards.findOne(cardId).members || [];
        return _.contains(cardMembers, this.userId);
    },
    user: function() {
        if (!this.user && !this.userId) return;
        return Users.findOne({'_id': this.userId});
    }
});