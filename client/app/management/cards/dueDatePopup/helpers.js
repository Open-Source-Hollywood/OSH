Template.dueDatePopup.onRendered(function() {
    this.$('.datetimepicker').datetimepicker();
});

Template.dueDatePopup.helpers({
    datecal: function() {
        setTimeout(function() {
            $('#glwiz').trigger('click');
        }, 110);
    }
})