Template.addCardForm.events({
    'click .js-cancel': function(event, t) {
        var composer = t.$('.card-composer');

        // Keep the old value in memory to display it again next time
        var inputCacheKey = "addCard-" + this.listId;
        var oldValue = composer.find('.js-card-title').val();
        InputsCache.set(inputCacheKey, oldValue);

        // add composer hide class
        composer.addClass('hide');
        composer.find('.js-card-title').val('');

        // remove hide open link class
        $('.js-open-card-composer').removeClass('hide');
    },
    'keydown .js-card-title': function(event, t) {
        var code = event.keyCode;
        // Pressing enter submit the form and add the card
        if (code === 13) { 
            t.$('#AddCardForm').submit();
            event.preventDefault();
        // Pressing escape close the form
        } else if (code === 27) {
            t.$('.js-cancel').click();
            event.preventDefault();
        }
    },
    'submit #AddCardForm': function(event, t) {
        var title = t.$('.js-card-title'),
            list = title.parents('.list'),
            cards = list.find('.card'),
            sort = cards.last().length ? (Blaze.getData(cards.last()[0]).sort +1) : 0;

        // Clear the form in-memory cache
        var inputCacheKey = "addCard-" + this.listId;
        InputsCache.set(inputCacheKey, '');

        // title trim if not empty then
        if ($.trim(title.val())) {
            Cards.insert({
                title: title.val(),
                listId: this.listId,
                boardId: this.board._id,
                sort: sort
            }, function(err, _id) {
                // In case the filter is active we need to add the newly
                // inserted card in the list of exceptions -- cards that are
                // not filtered. Otherwise the card will disappear instantly.
                // See https://github.com/libreboard/libreboard/issues/80
                Filter.addException(_id);
            });

            // empty and focus.
            title.val('').focus();

            // focus complete then scroll top
            Utils.Scroll(list.find('.list-cards')).top(1000, true);
        }
        event.preventDefault();
    }
});