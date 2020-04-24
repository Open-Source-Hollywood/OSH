Template.cardAttachmentsPopup.events({
    'change .js-attach-file': function(event, t) {
        var card = this.card;
        FS.Utility.eachFile(event, function(f) {
            var file = new FS.File(f);

            // set Ids
            file.boardId = card.boardId;
            file.cardId  = card._id;

            // upload file
            Attachments.insert(file);

            Popup.close();
        });
    },
    'click .js-computer-upload': function(event, t) {
        t.find('.js-attach-file').click();
        event.preventDefault();
    }
});