var Secrets = require('../utils').Secrets
var StripeServerKey = Secrets.stripe.test.server
var Helpers = require('../helpers')
var createNotification = Helpers.createNotification
var myId = Helpers.myId
var myEmail = Helpers.myEmail
var miniMe = Helpers.miniMe


module.exports = function(options) {
    check(options, Object)
    if (Meteor.isClient) return;

    // create offer in the state of offereeDecision  + consideration data etc. 
    var user = options.user // id, name, avatar
    var asset = options.assets[0]

    var me = Meteor.user()
    var d = new Date()

    var o = {
        ctx: 'offer',
        type: 'assets',
        assets: options.assets,

        expressOffer: {
            offer: parseInt(options.offer),
            days: parseInt(options.days),
            message: options.message
        },

        offeree: me._id,
        offeror: user.id,
        avatar: user.avatar,
        pending: true,
        offereeDecision: true,
        consideration: options,
        offerMadeOn: d,
        offerEndsOn: new Date(d.setHours(d.getHours() + 72)),
        offer: {
            ctx: 'assets',
            appliedFor: 'campaign asset leasing',
            message: 'campaign asset leasing',
            position: options.assets.map(function(a) { return a.name }).join(', '),
        },
        parties: [user.id, myId()]
    }

    o.offer.user = miniMe()
    o.offer.user.email = myEmail()
    o.created = new Date()

    function finishDirectLeaseOffer(isFuture) {
        var offer = Offers.insert(o)
        var msg = ['You have a new request for leasing ', o.assets.map(function(a) { return a.name }).join(', '), ' assets. Please check your active negotiations under DASHBOARD to access this item.']

        if (o.receipt) {
            msg = msg.concat([' An escrow payment of $', (o.receipt.amount/100).toFixed(2), ' is collected and available for this item upon approval.'].join(''))
        }

        createNotification({
            user: o.offeree,
            message: msg.join(''),
            purpose: 'assets',
            offer: offer,
            title: 'New request for your assets.'
        })

        if (isFuture) {
            if (!o.offer.user.email)
                return future.return('You successfully offered this resource. Without your email notifications, your ability to be reached is limited. Please configure your email in your profile settings.')

                future.return('You successfully mad the offer requesting this resource.')
        } else {
            if (!o.offer.user.email)
                return 'You successfully offered this resource. Without your email notifications, your ability to be reached is limited. Please configure your email in your profile settings.'

            return 'You successfully mad the offer requesting this resource.' 
        }  
    }

    if (options.token) {
        // console.log('in token handler')
        var future = new (Npm.require('fibers/future'))();
        var stripe = require("stripe")(StripeServerKey)
        stripe.charges.create({
            amount: Math.floor(options.stripePaid * 100),
            currency: "usd",
            source: options.token.id,
            transfer_group: options.user.id
        }, Meteor.bindEnvironment(function(err, charge) {
            if (err) return future.return(err.message);
            if (charge) {
                o.receipt = charge
                finishDirectLeaseOffer(true)
            } else {
                future.throw(new Meteor.Error("error", "payment failed"));
            }
        }));
        return future.wait();
    } else {
        finishDirectLeaseOffer()
    }
}
