var Secrets = require('../utils').Secrets
var StripeServerKey = Secrets.stripe.test.server

module.exports = function(options) {
    check(options, Object)
    if (Meteor.isClient) return

    if (!Meteor.user()||!Meteor.user().customer) {
        return 'You must update your profile for this feature to be available.'
    }

    var model = options.type==='user' ? Users.findOne({_id:options.user}) : Projects.findOne({slug:options.slug})

    var customerId = Meteor.user().customer.id
    var donationId = model.donate.id
    options.stripeAmount = options.amount * 100

    var future = new (Npm.require('fibers/future'))()
    var stripe = require("stripe")(StripeServerKey)

    stripe.customers.createSource(customerId, {
        source: options.token.id
    }, Meteor.bindEnvironment(function(err, source) {
        if (err) future.return('There was an error processing your request, please try again.')
        stripe.plans.create({
        amount: options.stripeAmount,
        interval: options.frequency,
        product: donationId,
        currency: "usd",
    }, Meteor.bindEnvironment(function(err, plan) {
        // asynchronously called
        if (err) future.return('There was an error processing your request, please try again.')
        stripe.subscriptions.create({
            customer: customerId,
            items: [{ plan: plan.id }]
    }, Meteor.bindEnvironment(function(err, subscription) {
        // asynchronously called
        if (err) future.return('There was an error processing your request, please try again.')

        options.subscription = subscription
        options.owner = Meteor.user()._id
        options.created = new Date()
        options.subscriber = miniMe()
        // create subscription object
        Subscriptions.insert(options)

        // update project funded
        if (options.slug) Projects.update({slug: options.slug}, {$inc: {funded: options.amount}})

        future.return('Your subscription was processed successfully.')

    }))
    }))
    }))
    return future.wait()
}