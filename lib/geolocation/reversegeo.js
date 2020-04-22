var Secrets = require('../.secrets.json')
var Gkey = Secrets.google.key
var request = require( 'request' )

module.exports = function(options) {
    check(options, Object)
    if (Meteor.isServer) {
        var requestParams = {
            uri:    ['https://maps.googleapis.com/maps/api/geocode/json?components=',options.zip,'|',options.country||'US','&key=', Gkey].join(''),
            method: 'GET'
        }
        var future = new (Npm.require('fibers/future'))()
        request( requestParams, Meteor.bindEnvironment(function ( err, response, body ) {
            if (err) return future.return(err.message)
            body = JSON.parse(body)
            if (!body.status||body.status!=='OK') {
                if (future) future.throw(new Meteor.Error("location code", "Invalid location, please enter a valid location code."))
                return
            } else {
                var results = body.results[0]
                var loc = results.geometry.location
                future.return([loc.lng, loc.lat])
            }
        }))
        return future.wait()
    }
}