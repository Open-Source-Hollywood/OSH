var Secrets = require('../utils').Secrets
var StripeServerKey = Secrets.stripe.test.server

module.exports = function(options) {
    check(options, Object)
    if (Meteor.isClient) return
    var subscription = Subscriptions.findOne({
        _id: options._id
    })
    var future = new (Npm.require('fibers/future'))()
    var stripe = require("stripe")(StripeServerKey)
    stripe.subscriptions.del(
        subscription.subscription.id,
    Meteor.bindEnvironment(function(err, confirmation) {
        // asynchronously called
        if (err) future.return('Error canceling your subscription, try again or email us (hello@opensourcehollywood.org).')
            Subscriptions.update({_id: subscription._id}, {$set:{ archived:true, cancel:confirmation }})
            future.return('Subscription canceled.')
        }
    ))
    return future.wait()
}