Template.WindowActivityModule.events({
    'click .js-new-comment:not(.focus)': function(event, t) {
        var $this = $(event.currentTarget);
        $this.addClass('focus');
    },
    'submit #CommentForm': function(event, t) {
        var text = t.$('.js-new-comment-input');
        if ($.trim(text.val())) {
            CardComments.insert({
                boardId: this.card.boardId,
                cardId: this.card._id,
                text: text.val()
            });
            text.val('');
            $('.focus').removeClass('focus');
        }
        event.preventDefault();
    }
});