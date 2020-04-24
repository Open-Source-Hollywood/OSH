Template.memberMenuPopup.events({
    'click .js-language': Popup.open('setLanguage'),
    'click .js-logout': function(event, t) {
        event.preventDefault();

        Meteor.logout(function() {
            Router.go('Home');
        });
    }
});