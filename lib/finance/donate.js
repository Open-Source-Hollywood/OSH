var Secrets = require('../utils').Secrets
var StripeServerKey = Secrets.stripe.test.server
var Helpers = require('../helpers')
var myName = Helpers.myName
var createNotification = Helpers.createNotification
var createReceipt = Helpers.createReceipt
var emailToHTML = Helpers.emailToHTML
var sendEmailNotification = Helpers.sendEmailNotification
var sendPhoneNotification = Helpers.sendPhoneNotification

module.exports = function(options, cb) {
    check(options, Object);
    if (options.amount<1) return 'donations need to be at least one dollar'
    if (Meteor.isClient) return
    options.user = Meteor.user() ?  {
                                        id: Meteor.user()._id,
                                        name: myName(),
                                        avatar: Meteor.user().avatar
                                    } : {
                                        id: 'anon',
                                        name: 'patron',
                                        avatar: '/img/star.png'
                                    }
    var project = Projects.findOne({slug: options.slug})
    var stripe = require("stripe")(StripeServerKey)
    var future = new (Npm.require('fibers/future'))()
    stripe.charges.create({
        amount: Math.floor(options.amount * 100),
        currency: "usd",
        source: options.token.id,
        transfer_group: project.slug
    }, Meteor.bindEnvironment(function(err, charge) {
        if (err) return future.return(err.message)
        if (charge) {
            delete options['token']
            options.receipt = charge
            options.created = new Date()
            var donations = project.donations || []
            donations.push(options)

            var backers = project.backers || []
            if (Meteor.user()&&Meteor.user()._id) {
                if (backers.indexOf(Meteor.user()._id)===-1) {
                    backers.push(Meteor.user()._id)
                }
            }

            var newTotal = project.funded + options.amount
            // update project
            Projects.update({_id: project._id}, { $set: { backers: backers, donations: donations, funded: newTotal }});

            // create receipts
            // show to who donated
            createReceipt({
                order: {
                    donation: true,
                    subscription: false
                },
                title: project.title,
                slug: project.slug,
                owner: project.ownerId,
                amount: options.amount,
                purpose: 'donation',
                receipt: charge,
                type: 'debit',
                link: ['/message/project/', project.slug,'/',Meteor.user()._id].join(''),
            });

            // show to project owner
            createReceipt({
                order: {
                    donation: true,
                    subscription: false
                },
                title: project.title,
                slug: project.slug,
                owner: project.ownerId,
                user: project.ownerId,
                amount: options.amount,
                purpose: 'donation',
                receipt: charge,
                type: 'credit',
                link: ['/message/project/', project.slug,'/',Meteor.user()._id].join(''),
            });

            var donationMessage = myName() + ' donated $' + (options.amount).toFixed(2);
            // create notification
            createNotification({
                user:project.ownerId,
                message: donationMessage,
                title: project.title,
                slug: project.slug,
                purpose: 'donation'
            });

            if (Meteor.user()) {
                var donationMessage = 'You donated $' + (options.amount).toFixed(2);
                // create notification
                createNotification({
                    user:Meteor.user(),
                    message: donationMessage,
                    title: project.title,
                    slug: project.slug,
                    purpose: 'donation'
                });
            };

            var projectOwner = Users.findOne({_id: project.ownerId});
            var notification_preferences = projectOwner.notification_preferences || {};
            var email_preferences = notification_preferences.email || {};
            var phone_preferences = notification_preferences.phone || {};
            /**
            sendEmailNotification(email, html, text, subject)
            sendPhoneNotification(phone, body)
            */
            var textMessage = donationMessage + ' to your project titled: ' + project.title + '.'
            if (email_preferences.email&&email_preferences.verification===true) {
                /** send email notification */
                var html = emailToHTML('NEW DONATION!', textMessage);
                sendEmailNotification(email_preferences.email, html, textMessage, 'New Donation from O . S . H .');
            }

            if (phone_preferences.phone&&phone_preferences.verification===true) {
                /** send phone notification */
                sendPhoneNotification(phone_preferences.phone, textMessage);
            }

            future.return('payment was processed, thank you for your donation !');
        } else {
            future.throw(new Meteor.Error("donation", "payment failed"));
            return
        }
    }));
    return future.wait();
}
