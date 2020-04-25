Template.dueDatePopup.events({
    'click .js-due-date-submit': function() {
        var _d = $('#task-due-date').val();
        if (_d) {
            Cards.update(this.card._id, {$set: {dueDate: _d}});
            vex.alert('task assigned due date of ' + _d);
        };
        Popup.close();
    }
});