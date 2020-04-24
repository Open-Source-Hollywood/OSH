Template.asssPopup.helpers({
    noAsss: function() {
        var x = Attachments.find({
            boardId: this._id
        }).count();
        return x === 0;
    },
    asss: function() {
        var was = this;
        var x = Attachments.find({
            boardId: this._id
        }).fetch();
        return _
            .chain(x)
            .groupBy('cardId')
            .map(function(value, key) {
                return {
                    // /boards/yYT2eu2wRLxAq7v5r/PsL61462418864/n24J3PZWQ8E2eM69o
                    card: '/boards/' + was._id + '/' + was.slug + '/' + key,
                    val: _.pluck(value, 'original')
                }
            })
            .value();
    }
});