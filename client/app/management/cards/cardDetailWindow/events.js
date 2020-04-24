Template.cardDetailWindow.events({
    'click .editable .js-card-title': function(event, t) {
        var editable = t.$('.card-detail-title');

        // add class editing and focus
        $('.editing').removeClass('editing');
        editable.addClass('editing');
        editable.find('#title').focus();
    },
    'click .js-edit-desc': function(event, t) {
        var editable = t.$('.card-detail-item');

        // editing remove based and add current editing.
        $('.editing').removeClass('editing');
        editable.addClass('editing');
        editable.find('#desc').focus();

        event.preventDefault();
    },
    'click .js-cancel-edit': function(event, t) {
        // remove editing hide.
        $('.editing').removeClass('editing');
    },
    'submit #WindowTitleEdit': function(event, t) {
        var title = t.find('#title').value;
        if ($.trim(title)) {
            Cards.update(this.card._id, {
                $set: {
                    title: title
                }
            }, function (err, res) {
                if (!err) $('.editing').removeClass('editing');
            });
        }

        event.preventDefault();
    },
    'submit #WindowDescEdit': function(event, t) {
        Cards.update(this.card._id, {
            $set: {
                description: t.find('#desc').value
            }
        }, function(err) {
            if (!err) $('.editing').removeClass('editing');
        });
        event.preventDefault();
    },
    'click .member': Popup.open('cardMember'),
    'click .js-details-edit-members': Popup.open('cardMembers'),
    'click .js-details-edit-labels': Popup.open('cardLabels')
});