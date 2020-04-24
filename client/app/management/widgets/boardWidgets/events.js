Template.boardWidgets.events({
    'click .js-show-sidebar': function(event, t) {
        Session.set('sidebarIsOpen', true);
    },
    'click .js-hide-sidebar': function() {
        Session.set('sidebarIsOpen', false);
    },
    'click .js-pop-widget-view': function() {
        Session.set('currentWidget', 'home');
    }
});