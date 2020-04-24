Template.cardMemberPopup.helpers({
    user: function() {
        if (!this.user && !this.userId) return;
        if (this.userId) return Users.findOne({'_id': this.userId});
        return this.user;
    }
});