Template.menuWidget.events({
    'click .js-open-card-filter': function() {
        Session.set('currentWidget', 'filter');
    },
    'click .js-change-background': function() {
        Session.set('currentWidget', 'background');
    },
    'click .js-change-calendarView': Popup.open('calendarView'),
    'click .js-language': Popup.open('setLanguage'),
    'click .js-toggle-widget-nav': function(event, t) {
        Session.set('menuWidgetIsOpen', ! Session.get('menuWidgetIsOpen'));
    }
});