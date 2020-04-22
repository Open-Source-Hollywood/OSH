var Secrets = require('../utils').Secrets
var StripeServerKey = Secrets.stripe.test.server

module.exports = function(options, cb) {
    check(options, Object)
    if (Meteor.isServer&&Meteor.user().account&&Meteor.user().account.keys&&Meteor.user().account.keys.secret) {
    try {
        var future = new (Npm.require('fibers/future'))()
        var stripe = require("stripe")(StripeServerKey)
        stripe.accounts.createExternalAccount(
            Meteor.user().account.id,
            { external_account: options },
        Meteor.bindEnvironment(function(err, bank) {
            if (err) return future.return(err.message)
            if (bank) {
                Meteor.users.update({_id: Meteor.user()._id}, {$set: { bank: bank }})
                if (Meteor.user()._bank) {
                    // delete previously deleted account
                    stripe.accounts.deleteExternalAccount(
                        Meteor.user()._bank.account,
                        Meteor.user().id,
                    function(err, confirmation) {
                        // asynchronously called
                        if (confirmation) {
                            Meteor.users.update({_id: Meteor.user()._id}, {$set: { _bank: null }})
                        }
                    })
                }
                // console.log('did save')
                future.return('you may now use this account for transferring funds from your campaigns')
            } else {
                future.return('an unidentified error occurred, please record the steps you took to arrive here including Wifi signal strength and device used and report it to us')
            }
        }))

        return future.wait()
    } catch(e) {
        console.log(e)
        // console.log(Meteor.user())
        return 'an unidentified error occurred, please record the steps you took to arrive here including Wifi signal strength and device used and report it to us'
    }
    } else {
        // console.log(Meteor.user())
        return 'an account was not identified, if you feel this is a mistake please wait and try again or contact us'
    }
}