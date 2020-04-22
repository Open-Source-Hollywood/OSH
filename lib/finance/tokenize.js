var Secrets = require('../.secrets.json')
var StripeServerKey = Secrets.stripe.test.server
var Helpers = require('./helpers')
var addPointsToUser = Helpers.addPointsToUser
var myEmail = Helpers.myEmail
var miniMe = Helpers.miniMe
var createNotification = Helpers.createNotification
var createReceipt = Helpers.createReceipt
var emailToHTML = Helpers.emailToHTML
var sendEmailNotification = Helpers.sendEmailNotification
var sendPhoneNotification = Helpers.sendPhoneNotification


module.exports = function(options) {
    check(options, Object)
    var user = Meteor.user()
    var project = Projects.findOne({slug: options.slug})
    var totalShares = project.availableShares
    var sharesPurchased = 0
    var _shares = options.donationObject.shares
    while (_shares> 0) {
        if (totalShares > _shares) {
            sharesPurchased+=_shares
            totalShares-=_shares
            _shares = 0
        } else {
            _shares-=1
        }
    }
    if (Meteor.isServer) {
        addPointsToUser(899)
        var stripe = require("stripe")(StripeServerKey)
        var future = new (Npm.require('fibers/future'))()
        options.amount = sharesPurchased * project.mpps
        var stripeAmount = Math.floor(options.amount * 100)
        stripe.charges.create({
            amount: stripeAmount,
            currency: "usd",
            source: options.token.id,
            transfer_group: project.slug
        }, Meteor.bindEnvironment(function(err, charge) {
            if (err) return future.return(err.message)
            if (charge) {
                options.user = miniMe()

                options.user.email = myEmail()
                options.message = 'Purchase ' + options.shares + ' shares'
                options.uid = Meteor.user()&&Meteor.user()._id||'anon'
                options.slug = project.slug
                options.created = new Date()
                delete options['token']
                options.receipt = charge

                /**
                create Shares
                deprecate availableShares
                */
                var d = new Date
                var shares = Shares.insert({
                    total: project.totalShares,
                    shares: sharesPurchased,
                    currentOwner: options.user,
                    ownerHistory: [user._id],
                    transactionDates: [d],
                    lastTransaction: d,
                    projectId: project._id,
                    projectSlug: project.slug,
                    projectName: project.title,
                    earningsToDate: 0,
                    earnings: [],
                    projectOwner: {
                        name: project.ownerName,
                        id: project.ownerId 
                    }
                }) 
              
                var projectShares = project.shares || []
                projectShares.unshift(shares)
                var projectFunded = project.funded  + options.amount

                // update project
                Projects.update(
                    {
                        _id: project._id
                    }, { 
                    $set: { 
                        shares: projectShares, 
                        availableShares: totalShares,
                        funded: projectFunded
                    }
                })

                // create receipt
                createReceipt({
                    order: {
                        shares: true,
                        id: shares._id
                    },
                    title: project.title,
                    slug: project.slug,
                    owner: project.ownerId,
                    amount: options.amount,
                    purpose: 'shares purchase',
                    receipt: charge
                })

                // create notification
                createNotification({
                    user:project.ownerId,
                    message: options.message,
                    title: project.title,
                    slug: project.slug,
                    purpose: 'shares purchase'
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
                    var html = emailToHTML('SHARES PURCHASE!', textMessage)
                    sendEmailNotification(email_preferences.email, html, textMessage, 'New Shares Purchase from O . S . H .')
                }

                if (phone_preferences.phone&&phone_preferences.verification===true) {
                    /** send phone notification */
                    sendPhoneNotification(phone_preferences.phone, textMessage)
                }

                future.return('You purchased ' + sharesPurchased + ' shares at $' + project.mpps + ' per share. ' + new Date().toLocaleDateString() + ' @ O . S . H . Tell your friends about us on Facebook, Instagram, and Twitter. Tag us for you daily chance to win campaign shares!')
            } else {
                future.throw(new Meteor.Error("shares purchase", "payment failed"))
                return
            }
        }))
        
        return future.wait();
    }
}