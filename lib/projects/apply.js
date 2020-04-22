var Secrets = require('../utils').Secrets
// use stripe.prod for prod
var StripePublicKey = Secrets.stripe.test.public
var StripeServerKey = Secrets.stripe.test.server
var Helpers = require('../helpers')
var DEBUG = Helpers.DEBUG
var addPointsToUser = Helpers.addPointsToUser
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
    check(options, Object)
    if (Meteor.isClient) return

    var project = Projects.findOne({slug: options.slug})
    if (project.ownerId===Meteor.user()._id) return 'not allowed, this is your own campaign'

    function notifyProjectOwner(ownerId, message) {
        var projectOwner = Users.findOne({_id: ownerId, message})
        var notification_preferences = projectOwner.notification_preferences || {}
        var email_preferences = notification_preferences.email || {}
        var phone_preferences = notification_preferences.phone || {}
        /**
            sendEmailNotification(email, html, text, subject)
            sendPhoneNotification(phone, body)
          */
        var textMessage = message
        if (email_preferences.email&&email_preferences.verification===true) {
            /** send email notification */
            var html = emailToHTML('NEW APPLICANT!', textMessage)
            sendEmailNotification(email_preferences.email, html, textMessage, 'New Applicant from O . S . H .')
        }

        if (phone_preferences.phone&&phone_preferences.verification===true) {
            /** send phone notification */
            sendPhoneNotification(phone_preferences.phone, textMessage)
        }
    }

    var key=options.ctx==='crew' ? 'crewApplicants' : 'roleApplicants'
    var __key =options.ctx==='crew' ? 'crew' : 'cast'

    options.audition = project[__key].audition||'N/A'
    var usersApplied = project.usersApplied

    options.uid = Meteor.user()._id
    if (usersApplied.indexOf(options.uid)===-1) usersApplied.push(options.uid)

    options.user = miniMe()

    options.user.email = myEmail()
    options.created = new Date()

    var mappedValues = project[key] || []
    var mappedStings = mappedValues.map(function(o){return o.user.id})
    // prevent duplicates
    var updateObj = {$set:{usersApplied: usersApplied}}
    // if (mappedStings.indexOf(Meteor.user()._id)===-1) mappedValues.push(options)
    mappedValues.push(options)
    updateObj['$set'][key] = mappedValues

    var successMessage = 'Your application was successful. You can communicate on your offer by visiting your contracts in dashboard.'
    // create notifications

    function appliedForSuccessHandler() {
        addPointsToUser(233)
        Projects.update({_id: project._id}, updateObj)
        createNotification({
            user: Meteor.user()._id,
            message: ['You successfully applied for' + options.appliedFor, 'on campaign titled', project.title,'and the campaign owner was notified.'].join(' '),
            title: project.title,
            slug: project.slug,
            purpose: 'apply',
            viewed: false
        })

        createNotification({
            user: project.ownerId,
            message: [Meteor.user().firstName||'', Meteor.user().lastName||'', 'applied for', options.appliedFor, 'to your campaign.'].join(' '),
            title: project.title,
            slug: project.slug,
            purpose: 'apply',
            viewed: false
        })
    }

    var offerOptions = {
        type: options.ctx,
        offer: options,
        purpose: 'apply',
        pending: true,
        offeror : Meteor.user()._id,
        offeree : project.ownerId,
        slug : project.slug,
        title: project.title,
        banner: project.banner,
        parties: [project.ownerId, myId()]
    }

    if (options.type==='hired'||!options.pay) {
        Offers.insert(offerOptions)
        appliedForSuccessHandler()
        return successMessage
        // END
    } else {

        var stripe = require("stripe")(StripeServerKey)
        var future = new (Npm.require('fibers/future'))()
      
        stripe.charges.create({
            amount: Math.floor(options.pay * 100),
            currency: "usd",
            source: options.token.id,
            transfer_group: project.slug
        }, Meteor.bindEnvironment(function(err, charge) {
            if (err) return future.return(err.message)
            if (charge) {
                delete options['token']
                offerOptions.receipts = [charge]

                var d = new Date()
                d.setHours(d.getHours() + (5*24))
                offerOptions.expiration = d

                // create offer
                var offer = Offers.insert(offerOptions)

                // create receipt
                createReceipt({
                    order: {
                        application: true,
                        refunded: false
                    },
                    title: project.title,
                    slug: project.slug,
                    owner: myId(),
                    name: myName(),
                    amount: options.amount,
                    user: project.ownerId,
                    purpose: 'apply',
                    offer: offer,
                    type: 'credit',
                    pending: true,
                    link: ['/message/project/', project.slug,'/',myId()].join(''),
                    linkTitle: 'Access Contract',
                    parties: [project.ownerId, myId()]
                })

                createReceipt({
                    order: {
                        application: true,
                        refunded: false
                    },
                    title: project.title,
                    slug: project.slug,
                    owner: myId(),
                    name: myName(),
                    amount: options.amount,
                    purpose: 'apply',
                    type: 'debit',
                    receipt: charge,
                    pending: true,
                    link: ['/message/project/', project.slug,'/',myId()].join(''),
                    linkTitle: 'Access Contract',
                    parties: [project.ownerId, myId()],
                    offer: offer
                })

                appliedForSuccessHandler()

                future.return(successMessage)
            } else {
                future.throw(new Meteor.Error("apply", "payment failed"))
                return
            }
        }))
        return future.wait()
    }
}