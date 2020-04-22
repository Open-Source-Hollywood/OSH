var Secrets = require('../utils').Secrets
var StripeServerKey = Secrets.stripe.test.server
var Helpers = require('../helpers')
var createReceipt = Helpers.createReceipt
var emailToHTML = Helpers.emailToHTML

module.exports = function(options, cb) {
    // origin, account transfer from
    // to = Meteor.user().bank.id
    check(options, Object)
    if (Meteor.isServer) {
    if (!Meteor.user().bank||!Meteor.user().bank.currency||!Meteor.user().bank.account) return 'please configure your transfer configurations in EDIT PROFILE to continue'
    var project = Projects.findOne({slug:options.slug})
    // calculate how much to transfer
    // do transfer 90%
    // keep 10% in account
    var fundsTransferred = project.fundsTransferred||0
    var funded = project.funded
    var availableTransfer = funded-fundsTransferred
    if (availableTransfer*1.1<1) return 'insufficient funds available for transfer'
    fundsTransferred+=availableTransfer

    var future = new (Npm.require('fibers/future'))()
    var stripe = require("stripe")(StripeServerKey)
    stripe.transfers.create({
        amount: Math.floor(availableTransfer*.90),
        currency: Meteor.user().bank.currency,
        destination: Meteor.user().bank.account,
        transfer_group: project.slug,
    }, Meteor.bindEnvironment(function(err, transfer) {
        // asynchronously called
        if (err) return future.return(err.message)
        Projects.update({_id:project._id}, { $set: {fundsTransferred:fundsTransferred}})
        createReceipt({
            order: {
                transfer: true
            },
            title: project.title,
            slug: project.slug,
            owner: project.ownerId,
            amount: availableTransfer*0.9,
            purpose: 'transfer',
            receipt: transfer,
        })
        future.return('a $'+(availableTransfer*0.9).toFixed(2)+' transfer was made, and will be processed during the next business week')
    }))
    return future.wait()
    }
}