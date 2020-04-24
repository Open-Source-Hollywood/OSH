Template.setLanguagePopup.events({
    'click .js-set-language': function(event) {
        Users.update(Meteor.userId(), {
            $set: {
                'profile.language': this.tag
            }
        });
        event.preventDefault();
    }
});