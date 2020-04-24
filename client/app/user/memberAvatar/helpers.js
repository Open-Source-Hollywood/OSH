Template.memberAvatar.helpers({
    username: function() {
        var user = Users.findOne({'_id': this.user})
        if (user && user.services && user.services.auth0) return user.firstName + ' ' + user.lastName;
    },
    name: function() {
        var user = Users.findOne({'_id': this.user})
        if (user && user.services && user.services.auth0) return user.firstName + ' ' + user.lastName;
    },
    thumbnailUrl: function() {
        var user = Users.findOne({'_id': this.user})
        if (user && user.services && user.services.auth0) return user.avatar;
    },
    status: function() {
        var user = Users.findOne({'_id': this.user})
        if (user && user.services && user.services.auth0) return user.status === 'online';
    },
    memberType: function() {
        var user = Users.findOne({'_id': this.user})
        if (user && user.services && user.services.auth0) return user.isBoardAdmin() ? 'admin' : 'member';
    }
});