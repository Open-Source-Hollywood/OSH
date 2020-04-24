Template.addMemberPopup.rendered = function() {
    // Input autofocus
    this.find('.search-with-spinner input').focus();

    // resize widgets
    Utils.widgetsHeight();
};


Template.addMemberPopup.helpers({
    isBoardMember: function() {
        var user = Users.findOne({'_id': this._id});
        return user && user.isBoardMember();
    }
});
