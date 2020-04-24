var Secrets = require('../utils').Secrets
var StripeServerKey = Secrets.stripe.test.server

var Helpers = require('../helpers')
var myId = Helpers.myId
var myName = Helpers.myName
var myEmail = Helpers.myEmail
var miniMe = Helpers.miniMe
var createNotification = Helpers.createNotification
var createReceipt = Helpers.createReceipt
var emailToHTML = Helpers.emailToHTML
var sendEmailNotification = Helpers.sendEmailNotification
var sendPhoneNotification = Helpers.sendPhoneNotification

module.exports = function(options, cb) {
    check(options, Object);
    if (Meteor.isClient) return

    var user = Users.findOne({_id: options.uid})

    var stripe = require("stripe")(StripeServerKey)
    var future = new (Npm.require('fibers/future'))()
    stripe.charges.create({
        amount: Math.floor(options.amount * 100),
        currency: "usd",
        source: options.token.id,
        transfer_group: user._id
    }, Meteor.bindEnvironment(function(err, charge) {
        if (err) return future.return(err.message)
        if (charge) {
            options.user = miniMe()

            options.user.email = myEmail()
            options.message = options.user.name+' purchased '+options.gift.name+' for $'+options.amount.toFixed(2)
            options.created = new Date()
            options.receipt = charge
            options.purchaser = myName()
            options.type = 'gift'
            options.parties = [user._id, myId()]
            delete options.gift['data']
            // create offer notice
            Offers.insert(options)

            // decrement merch quantity and save
            var gifts = Meteor.user().gifts || [];
            var _gifts = [];
            for (var i = gifts.length - 1; i >= 0; i--) {
                var g = gifts[i];
                if (g.name===options.gift.name&&g.description===options.gift.description&&g.msrp===options.gift.msrp&&g.url===options.gift.url) {
                    // CHANGE QUANTITY OF GOODS HERE
                    options.order.forEach(function(o) {
                        g.quantity[o.key] = g.quantity[o.key] - o.quantity
                    })
                };
                _gifts.push(g);
            };

            delete options['receipt']
            // create receipt
            createReceipt({
                order: options,
                owner: user._id,
                title: options.artistName,
                slug: 'personal merchandise',
                amount: options.amount,
                purpose: 'gift purchase',
                receipt: charge,
                type: 'gift'
            });
            createReceipt({
                order: options,
                user: user._id,
                title: 'personal merch purchase',
                slug: 'personal merchandise',
                amount: options.amount,
                purpose: 'gift purchase',
                receipt: charge,
                type: 'gift'
            });

            // create notification
            createNotification({
                user: user._id,
                message: options.message,
                title: options.user.name,
                slug: 'personal merchandise',
                purpose: options.name + ' purchase'
            });


            var notification_preferences = user.notification_preferences || {};
            var email_preferences = notification_preferences.email || {};
            var phone_preferences = notification_preferences.phone || {};
            /**
            sendEmailNotification(email, html, text, subject)
            sendPhoneNotification(phone, body)
            */
            var textMessage = options.message;
            if (email_preferences.email&&email_preferences.verification===true) {
                /** send email notification */
                var html = emailToHTML('GIFT PURCHASE!', textMessage);
                sendEmailNotification(email_preferences.email, html, textMessage, 'New Gift Purchase from O . S . H .');
            }

            if (phone_preferences.phone&&phone_preferences.verification===true) {
                /** send phone notification */
                sendPhoneNotification(phone_preferences.phone, textMessage);
            }

            future.return('your gift purchase was successful, your order will be fulfilled by this artist.');

        } else {

            future.throw(new Meteor.Error("donation", "payment failed"));
            return
        }
    }));
    return future.wait();
}