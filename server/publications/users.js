/*
*
* To make this available on the client, use a reactive cursor,
* such as by creating a publication on the server:
*/
Meteor.publish('connectUser', function() {

    var user = Users.findOne(this.userId);

    // if user then ready subscribe
    if (user) {

        // status offline then
        if (!user.status) {

            // User profile.status update online
            Users.update(this.userId, { $set: { 'status': 'online' }});
        }

        // user close subscribe onStop callback update user.profile.status 'offline'
        this.onStop(function() {

            // update offline user
            Users.update(this.userId, { $set: { 'status': false }});
        });
    }


    // subscribe ready
    this.ready();
});

Meteor.publish('profile', function(_id) {
    check(_id, Object);
    return Users.find({ '_id': _id });
});

Meteor.publish('getUsers', function() {
    return Users.find({ 
    });
});
