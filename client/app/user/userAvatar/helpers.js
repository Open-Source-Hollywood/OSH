Template.userAvatar.helpers({
    username: function() {
        if (!this.user || !this.user._id) return;
        var user = Users.findOne({_id: this.user._id});
        if (user && user.services && user instanceof Object) {return user.firstName + ' ' + user.lastName;}
    },
    name: function() {
        if (!this.user || !this.user._id) return;
        var user = Users.findOne({_id: this.user._id})
        if (user && user.services && user instanceof Object) {return user.firstName.toLowerCase() + user.lastName.toLowerCase();}
    },
    thumbnailUrl: function() {
        if (!this.user || !this.user._id) return;
        var user = Users.findOne({_id: this.user._id})
        if (user && user.services && user instanceof Object) {return user.avatar;}
    }
});