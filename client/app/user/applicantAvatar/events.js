Template.applicantAvatar.events({
    'click .accept': function(event) {
        $('.accept').attr("disabled", true);
        $('.reject').attr("disabled", true);
        Meteor.call('acceptUserToProject', this.user.id, this.user.contribution, Router.current().params.slug);
    },
    'click .reject': function(event) {
        $('.accept').attr("disabled", true);
        $('.reject').attr("disabled", true);
        Meteor.call('rejectUserFromProject', this.user.id, Router.current().params.slug);
    }
})