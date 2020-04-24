Template.filterWidget.helpers({
    foo: function() {
        var cards = Cards.find({boardId: this.board._id}).fetch();
        var _cards = cards.map(function(i) {
            if (i.dueDate !== undefined) {
                var _dStr = '';
                var _i = new Date(i.dueDate);
                var m = _i.getMonth() + 1;
                var d = _i.getDate();
                var y = _i.getYear() + 1900;
                _dStr = m + '/' + d + '/' + y;
                return {
                    _id: i._id,
                    title: i.title,
                    listId: i.listId,
                    dueDate: i.dueDate,
                    formattedDate: _dStr
                };
            };
        });
        return _cards;
    }
})