Router.route('/comms', {
    name: 'Comms',
    template: 'comms',
    layoutTemplate: 'StaticLayout',
    bodyClass: '.col-xs-12,.col-sm-12,.col-md-12,.col-lg-12{margin-bottom: 20px;}',
    waitOn: function() {
        if (!Meteor.user()) Router.go('Home');
        return [
            Meteor.subscribe('getComms')
        ];
    }
});

Template.comms.helpers({
    comms: function() {
        return Notifications.find({
            user: Meteor.user()._id
        });
    }
});
