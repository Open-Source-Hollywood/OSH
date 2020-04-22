var Secrets = require('../.secrets.json')
var StripeServerKey = Secrets.stripe.test.server


var Helpers = require('./helpers')
var addPointsToUser = Helpers.addPointsToUser
var myId = Helpers.myId
var myEmail = Helpers.myEmail
var miniMe = Helpers.miniMe
var createNotification = Helpers.createNotification
var createReceipt = Helpers.createReceipt
var emailToHTML = Helpers.emailToHTML
var sendEmailNotification = Helpers.sendEmailNotification
var sendPhoneNotification = Helpers.sendPhoneNotification

module.exports = function(options, cb) {
    check(options, Object)
    if (Meteor.isServer) {
    var project = Projects.findOne({slug: options.slug})
    options.uid = Meteor.user()&&Meteor.user()._id||'anon'
    var stripe = require("stripe")(
    StripeServerKey
    )
    var future = new (Npm.require('fibers/future'))()
    stripe.charges.create({
        amount: Math.floor(options.amount * 100),
        currency: "usd",
        source: options.token.id,
        transfer_group: project.slug
    }, Meteor.bindEnvironment(function(err, charge) {
        if (err) return future.return(err.message)
        if (charge) {
            options.user = miniMe()
            options.user.email = myEmail()
            options.message = options.user.name+' purchased '+options.gift.name+' for $'+options.amount.toFixed(2)
            options.uid = Meteor.user()&&Meteor.user()._id||'anon'
            options.slug = project.slug
            options.created = new Date()
            delete options['token']
            delete options.gift['data']
            options.type = 'gift'
            options.receipt = charge

            var backers = project.backers || []
            if (Meteor.user()&&Meteor.user()._id) {
            if (backers.indexOf(Meteor.user()._id)===-1) backers.push(Meteor.user()._id)
            }

            var newTotal = project.funded + options.amount
            var gifts = project.gifts || []
            var _gifts = []
            for (var i = gifts.length - 1; i >= 0; i--) {
                var g = gifts[i]
                var gift = options.gift
                if (g.name===gift.name&&g.description===gift.description&&g.msrp===gift.msrp) {
                    // CHANGE QUANTITY OF GOODS HERE
                    options.order.forEach(function(o) {
                        if (g.quantity.hasOwnProperty(o.key)) {
                            // console.log('hasOwnProperty KEY')
                            g.quantity[o.key] = parseFloat(g.quantity[o.key]) - parseFloat(o.quantity)
                        } else if (g.quantity.hasOwnProperty('all')) {
                            // console.log('hasOwnProperty ALL')
                            g.quantity.all = parseFloat(g.quantity.all) - parseFloat(o.quantity)
                        } else {
                            // console.log('NO MATCH')
                        }
                    })
                }
                _gifts.push(g)
            }

            var soldGifts = project.soldGifts || []
            soldGifts.push({user: options.user})

            // update project
            Projects.update({_id: project._id}, { $set: { backers: backers, soldGifts: soldGifts, gifts: _gifts, funded: newTotal }})

            options.parties = [project.ownerId, myId()]
            // create offer notice
            Offers.insert(options)
            // create receipt
            delete options['receipt']
            createReceipt({
                order: options,
                title: project.title,
                slug: project.slug,
                owner: project.ownerId,
                amount: options.amount,
                purpose: 'gift purchase',
                receipt: charge,
                type: 'gift'
            })

            createReceipt({
                order: options,
                user: project.ownerId,
                title: project.title,
                slug: project.slug,
                owner: project.ownerId,
                amount: options.amount,
                purpose: 'gift purchase',
                receipt: charge,
                type: 'gift'
            })

            // create notification
            createNotification({
                user:project.ownerId,
                message: options.message,
                title: project.title,
                slug: project.slug,
                purpose: 'gift purchase'
            })

            var projectOwner = Users.findOne({_id: project.ownerId})
            var notification_preferences = projectOwner.notification_preferences || {}
            var email_preferences = notification_preferences.email || {}
            var phone_preferences = notification_preferences.phone || {}
            /**
            sendEmailNotification(email, html, text, subject)
            sendPhoneNotification(phone, body)
            */
            var textMessage = options.message
            if (email_preferences.email&&email_preferences.verification===true) {
                /** send email notification */
                var html = emailToHTML('GIFT PURCHASE!', textMessage)
                sendEmailNotification(email_preferences.email, html, textMessage, 'New Gift Purchase from O . S . H .')
            }

            if (phone_preferences.phone&&phone_preferences.verification===true) {
                /** send phone notification */
                sendPhoneNotification(phone_preferences.phone, textMessage)
            }

            // add 444 points to InfluenceScore
            addPointsToUser(444)

            // email receipt to purchaser
            var buyerEmail = options.email
            var purchaseReceipt = [
                'You have just now purchased ',
                options.totalUnits,
                ' units of ',
                options.gift.name,
                ' at a total price of $',
                (charge.amount/100).toFixed(2),
                '. Your transaction receipt for this purchase is: ',
                charge.id,
                '. Please keep this for your records. You can follow up with your purchase by emailing the seller at: ',
                email_preferences.email,
                ' for any further follow-up related to this order.'
            ].join('')

            var html = emailToHTML('PURCHASE RECEIPT!', purchaseReceipt)
            sendEmailNotification(email_preferences.email, html, textMessage, 'New Gift Purchase from O . S . H .')

            future.return('your gift purchase was successful, your order will be fulfilled by the campaign creator')

        } else {
            future.throw(new Meteor.Error("donation", "payment failed"))
            return
        }
    }))
    return future.wait()
    }  
}