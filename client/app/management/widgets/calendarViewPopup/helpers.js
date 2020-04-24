var currentBoard = function() {
    return Boards.findOne(Router.current().params.boardId);
}

Template.calendarViewPopup.helpers({
    calendarOptions: function() {
        setTimeout(function() {
            var date = new Date();
            var d = date.getDate();
            var m = date.getMonth();
            var y = date.getFullYear();

            var board = currentBoard();
            var cards = Cards.find({boardId: board._id}).fetch();
            var events_array = [];
            cards.forEach(function(e) {
                if (e.dueDate) {
                    var url = '/boards/' + board._id + '/' + board.slug + '/' + e._id;
                    // http://fullcalendar.io/docs/event_data/Event_Object/
                    events_array.push({
                        start: e.dueDate,
                        title: e.title,
                        allDay: true,
                        url: url
                    });
                };
            });

            $('#calendar').fullCalendar({
                header: {
                    left: 'prev,next',
                    title: 'title',
                    right: ''
                },
                selectable: true,
                events: events_array,
                eventRender: function(event, element) {
                    element.attr('title', event.tip);
                }
            });
        }, 100);
    }
});
