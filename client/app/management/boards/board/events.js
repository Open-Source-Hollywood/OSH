var toggleBoardStar = function(boardId) {
    var queryType = Meteor.user().hasStarred(boardId) ? '$pull' : '$addToSet';
    var query = {};
    query[queryType] = {
        'profile.starredBoards': boardId
    };
    Meteor.users.update(Meteor.userId(), query);
};

Template.board.events({
    'click .js-star-board': function(event, t) {
        toggleBoardStar(this._id);
    },
    'click #permission-level:not(.no-edit)': Popup.open('boardChangePermission'),
    'click .js-filter-cards-indicator': function(event) {
        Session.set('currentWidget', 'filter');
        event.preventDefault();
    },
    'click .js-filter-card-clear': function(event) {
        Filter.reset();
        event.stopPropagation();
    }
});
