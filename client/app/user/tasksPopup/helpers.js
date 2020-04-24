Template.tasksPopup.helpers({
    tasks: function() {
        var x = Cards.find({boardId: this._id}).fetch();
        var o = {};
        o.tasksTotal = x.length;
        o.tasksCompleted = 0;
        x.forEach(function(t) {
            if (t.archived) o.tasksCompleted += 1;
        });
        o.tasksRemaining = o.tasksTotal - o.tasksCompleted;
        return o;
    }
});