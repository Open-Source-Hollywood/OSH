Router.route('/boards/:boardId/:slug', {
    name: 'Board',
    template: 'board',
    layoutTemplate: 'BoardsLayout',
    bodyClass: 'page-index large-window body-board-view bgBoard',
    onAfterAction: function() {
        if (!Meteor.user()) {
            Router.go('Home');
            return
        }
        $(document).fadeIn();
        document.title = 'Campaign Board';
        Session.set('sidebarIsOpen', true);
        Session.set('currentWidget', 'home');
        Session.set('menuWidgetIsOpen', false);
        Session.set('superCalendarReady', true);
    },
    waitOn: function() {
        var params = this.params;

        return [

            // Update currentUser profile status
            // Meteor.subscribe('connectUser'),

            Meteor.subscribe('getUsers'),

            // Board page list, cards members vs
            Meteor.subscribe('board', params.boardId, params.slug),

            Meteor.subscribe('getProject', params.slug),

            Meteor.subscribe('getTasks', params.boardId),

            Meteor.subscribe('getMyTasks', params.boardId),

            Meteor.subscribe('getAssets', params.boardId),

            Meteor.subscribe('getMe')

            // Meteor.subscribe('getExpiringTasks', params.boardId)
        ];
    },
    data: function() {
        return Boards.findOne({_id: this.params.boardId});
    }
});

// Reactively set the color of the page from the color of the current board.
Meteor.startup(function() {
    Tracker.autorun(function() {
        var currentRoute = Router.current();
        // We have to be very defensive here because we have no idea what the
        // state of the application is, so we have to test existence of any
        // property we want to use.
        // XXX There is one feature of coffeescript that rely shine in this kind
        // of code: `currentRoute?.params?.boardId` -- concise and clear.
        var currentBoard = Boards.findOne(currentRoute &&
                                          currentRoute.params &&
                                          currentRoute.params.boardId);
        if (currentBoard &&
            currentBoard.background &&
            currentBoard.background.type === "color") {
            $(document.body).css({
                backgroundColor: currentBoard.background.color
            });
        } else {
            $(document.body).css({ backgroundColor: '' });
        }
    });
});
