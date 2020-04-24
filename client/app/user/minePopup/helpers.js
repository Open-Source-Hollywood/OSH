Template.minePopup.helpers({
    mine: function() {
        var was = this;
        var x = Cards.find({
            boardId: this._id,
            userId: Meteor.user()._id
        }).fetch(); 
        return x.map(function(c) {
            return {
                href: '/boards/' + was._id + '/' + was.slug + '/' + c._id,
                title: c.title,
            }
        });
    }
});