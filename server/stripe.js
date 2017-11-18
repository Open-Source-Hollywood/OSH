Meteor.startup(function() {
	ShareIt.configure({
        sites: {
            'facebook': {
                'appId': '1790348544595983'
            }
        }
    });
});