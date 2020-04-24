Template.WindowAttachmentsModule.events({
    'click .js-attach': Popup.open('cardAttachments'),
    'click .js-confirm-delete': Popup.afterConfirm('attachmentDelete', function() {
        Attachments.remove(this._id);
        Popup.close();
    }),
    // If we let this event bubble, Iron-Router will handle it and empty the
    // page content, see #101.
    'click .js-open-viewer, click .js-download': function(event) {
        event.stopPropagation();
    },
    'click .js-add-cover': function() {
        Cards.update(this.cardId, { $set: { coverId: this._id } });
    },
    'click .js-remove-cover': function() {
        Cards.update(this.cardId, { $unset: { coverId: "" } } );
    }
});