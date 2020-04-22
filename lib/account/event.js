var Secrets = require('../utils').Secrets
var Gkey = Secrets.google.key
var Helpers = require('../helpers')
var addPointsToUser = Helpers.addPointsToUser

module.exports = function (options, cb) {
    check(options, Object);

    if (Meteor.isClient) return

    addPointsToUser(13)

    // var ownerId = Meteor.user()._id
    var future = new (Npm.require('fibers/future'))();

    var address = options.address
    var title = options.title
    var directions = options.directions
    var contact = options.contact

    var requestParams = {
        uri:    [
                    'https://maps.googleapis.com/maps/api/geocode/json?address=',
                    address,
                    '&key=',
                    Gkey
                ].join(''),
        method: 'GET'
    };
    request( requestParams, Meteor.bindEnvironment(function ( err, response, geoOptions ) {
        if (!geoOptions) {
            future.throw(new Meteor.Error("Error: invalid address", "Invalid location, please enter a valid address."));
            return
        };

        geoOptions = JSON.parse(geoOptions);

        if (!geoOptions.status||geoOptions.status.toUpperCase()!=='OK') {
            future.throw(new Meteor.Error("Error: invalid zip", "Invalid location, please enter a valid ZIP or postal code."));
            return
        };

        var results = geoOptions.results[0];
        var text = [results.formatted_address, title, directions, contact].join(' !!@!! ')

        sendEmailNotification('aug2uag@gmail.com', text, text, 'New Event Request');

        if(future)future.return('Your event request is under process. If approved your event will be listed on the Open Source HOLLYWOOD Meetup.com page!');           
    })); 

    if (future) return future.wait();
}