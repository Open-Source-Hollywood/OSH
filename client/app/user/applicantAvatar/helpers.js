Template.applicantAvatar.helpers({
    contribution: function() {
        return this.user.contribution;
    },
    username: function() {
        return this.user.username;
    },
    name: function() {
        return this.user.name;
    },
    thumbnailUrl: function() {
        return this.user.thumbnailUrl;
    }
});