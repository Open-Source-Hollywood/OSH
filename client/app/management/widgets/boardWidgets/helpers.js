var widgetTitles = {
    filter: 'filter-cards',
    background: 'change-background'
};


Template.boardWidgets.helpers({
    currentWidget: function() {
        return Session.get('currentWidget') + 'Widget';
    },
    currentWidgetTitle: function() {
        return TAPi18n.__(widgetTitles[Session.get('currentWidget')]);
    }
});