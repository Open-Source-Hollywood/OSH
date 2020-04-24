Template.board.rendered = function() {

    // update height add, update, remove resize board height.
    Boards.find().observe({
        added: Utils.resizeHeight('.board-canvas', Utils.widgetsHeight),
        updated: Utils.resizeHeight('.board-canvas'),
        removed: Utils.resizeHeight('.board-canvas')
    });

    // resize not update observe changed.
    jQuery(window).resize(Utils.resizeHeight('.board-canvas', Utils.widgetsHeight));

    // if not is authenticated then show warning..
    if (!Utils.is_authenticated()) Utils.Warning.open('Want to subscribe to these cards?');

    // scroll Left getSession
    Utils.boardScrollLeft();

    $.getScript('//cdnjs.cloudflare.com/ajax/libs/fullcalendar/2.7.3/fullcalendar.min.js', function(){
        
    });
};

var jsAutofocus = function() {
    this.find('.js-autofocus').focus();
};


Template.board.helpers({
    isStarred: function() {
        var boardId = Boards.findOne()._id,
            user = Meteor.user();
        return boardId && user && user.hasStarred(boardId);
    },
    onboarded: function() {
    	var user = Meteor.user()
    	if (!user.onboardBoarding) {
    		vex.dialog.alert({
    			input: [
    				'<p>This is your project board.</p>',
    				'<p>You can assign or be assigned tasks.</p>',
    				'<p>Tasks are accessed in the cards that contain information when you click into them.</p>'
    			].join(''),
    			callback: function() {
    				Meteor.call('userBoardDidOnboard')
    			}
    		})
    	};
    }
});

Template.boardChangePermissionPopup.helpers({
    check: function(perm) {
        return this.permission === perm;
    }
});
