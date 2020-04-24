Template.WindowSidebarModule.events({
    'click .js-change-card-members': Popup.open('cardMembers'),
    'click .js-edit-labels': Popup.open('cardLabels'),
    'click .js-archive-card': function(event, t) {
        // Update
        Cards.update(this.card._id, {
            $set: {
                archived: true
            }
        });
        event.preventDefault();
    },
    'click .js-unarchive-card': function(event, t) {
        Cards.update(this.card._id, {
            $set: {
                archived: false
            }
        });
        event.preventDefault();
    },
    'click .js-delete-card': Popup.afterConfirm('cardDelete', function() {
        Cards.remove(this.card._id);

        // redirect board
        Utils.goBoardId(this.card.board()._id);
        Popup.close();
    }),
    'click .js-more-menu': Popup.open('cardMore'),
    'click .js-attach': Popup.open('cardAttachments'),
    'click .js-due-date': Popup.open('dueDate')
});