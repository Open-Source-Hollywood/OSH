Template.memberPopup.helpers({
    user: function() {
        return Users.findOne({'_id': this.user});
    },
    memberType: function() {
        var type = Users.findOne({'_id': this.user}).isBoardAdmin() ? 'admin' : 'normal';
        return TAPi18n.__(type).toLowerCase();
    }
});
