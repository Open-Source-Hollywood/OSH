Template.membersThumbnail.helpers({
    user: function() {
        if (!this.user && !this.userId) return;
        return Users.findOne({_id: this.userId});
    }
});