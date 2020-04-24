Template.filterWidget.events({
    'click .js-toggle-label-filter': function(event) {
        Filter.labelIds.toogle(this._id);
        Filter.resetExceptions();
        event.preventDefault();
    },
    'click .js-toogle-member-filter': function(event) {
        Filter.members.toogle(this._id);
        Filter.resetExceptions();
        event.preventDefault();
    },
    'click .js-toogle-dueDate-filter': function(event) {
        Filter.dueDates.toogle(this._id);
        Filter.resetExceptions();
        event.preventDefault();
    },
    'click .js-clear-all': function(event) {
        Filter.reset()
        event.preventDefault();
    }
});