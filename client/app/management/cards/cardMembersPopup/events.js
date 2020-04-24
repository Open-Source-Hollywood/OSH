Template.cardMembersPopup.events({
    'click .js-select-member': function(event, tpl) {
        var cardId = Template.parentData(2).data.card._id;
        var memberId = this.userId;
        var operation;
        if (Cards.find({ _id: cardId, members: memberId}).count() === 0)
            operation = '$addToSet';
        else
            operation = '$pull';

        var query = {};
        query[operation] = {
            members: memberId
        };
        Cards.update(cardId, query);
        event.preventDefault();
    }
});