var Helpers = require('../helpers')
var addPointsToUser = Helpers.addPointsToUser
var myEmail = Helpers.myEmail
var Secrets = require('../utils').Secrets
var StripeServerKey = Secrets.stripe.test.server

module.exports = function() {
    // console.log('createBankingAccount')
    if (!Meteor.user()) return;
    if (!Meteor.user().account&&Meteor.isServer) {
        // console.log(Meteor.user())
        var ipAddr = this.connection&&this.connection.clientAddress||'127.0.0.1';
        var userAgent = this.connection&&this.connection.httpHeaders['user-agent']||'user-agent';
        var stripe = require("stripe")(StripeServerKey)

        stripe.customers.create({
            email: myEmail(),
            metadata: {
                uid: Meteor.user()._id
            }
        }, Meteor.bindEnvironment(function(err, customer) {
            if (err) return;
            /** 
            TODO:
            add support fields and others for CUSTOM type account
            https://stripe.com/docs/api/accounts/create
            */
            stripe.accounts.create({
                country: 'US',
                type: 'custom',
                tos_acceptance : {
                    date: Math.round(new Date().getTime()/1000),
                    ip: ipAddr,
                    user_agent: userAgent
                }
            }, Meteor.bindEnvironment(function(err, account) {
                if (err) return
                // asynchronously called
                stripe.products.create({
                    name: 'donation id:' + Meteor.user()._id,
                    type: 'service',
                    metadata: {
                        user: Meteor.user()._id,
                        type: 'donation'
                    }
                }, Meteor.bindEnvironment(function(err, product) {
                    if (err) return
                    addPointsToUser(889)
                    Meteor.users.update({_id: Meteor.user()._id}, {$set: { 
                        account: account,
                        customer: customer,
                        donate: product 
                    }})
                }))
            }))
        }))
    }
}