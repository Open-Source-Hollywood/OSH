var Helpers = require('../helpers')
var BASE_URL = Helpers.BASE_URL
var guid = Helpers.guid
var sendEmailNotification = Helpers.sendEmailNotification
var sendPhoneNotification = Helpers.sendPhoneNotification

module.exports = function(options) {
    check(options, Object)
    if (Meteor.isClient) return
    var phone, email, notification_preferences
    phone = options.phone && options.phone.replace(/ /g, '')
    email = options.email && options.email.replace(/ /g, '')
    notification_preferences = Meteor.user().notification_preferences || {}
    email_preferences = notification_preferences.email || {}
    phone_preferences = notification_preferences.phone || {}
    var responseMsg = ''
    if (email) {
        /* The following example sends a formatted email: */
        var guid1 = guid()
        var guid2 = guid()
        if (email_preferences.email!==email) {
            /** set guids to user */
            email_preferences.email = email
            email_preferences.verification = false
            notification_preferences.email = email_preferences
            Meteor.users.update({_id: Meteor.user()._id}, {$set: {'guid1': guid1, 'guid2': guid2, notification_preferences: notification_preferences}})
            var verificationURL = BASE_URL + 'verify/' + guid2 + '/' + guid1
            var _html = emailToHTML('VERIFY EMAIL', 'Your email was provided as a source for notifications on O . S . H .. To verify, please select the following:', verificationURL, 'SELECT TO VERIFY')
            var _text = "Your email was provided as a source for notifications on O . S . H .. To verify, please visit the following URL: " + verificationURL
            var _subject = "Verify Email for Notifications from O . S . H ."
            sendEmailNotification(email, _html, _text, _subject)
            responseMsg += 'A verification email was dispatched to ' + email + '.\n'
        }
    }

    if (phone) {
        /** get 4 digit code, set to user and SMS user */
        // console.log(new Array(100).join('#'))

        phone = phone.replace(/\D/g,'')
        // console.log(phone)
        if (phone.length!==10) {
            responseMsg += 'The phone number you provided did not match the (xxx)xxx-xxxx format, please try again.'
        } else if (phone_preferences.phone!==phone) {
            phone = '+1' + phone
            var verificationCode = Math.floor(1000 + Math.random() * 9000)
            phone_preferences.phone = phone
            phone_preferences.verification = false
            notification_preferences.phone = phone_preferences
            Meteor.users.update({_id: Meteor.user()._id}, {$set: {'phone_verification_code': verificationCode, notification_preferences: notification_preferences}})
            var _body = verificationCode + ' is your verification code for O . S . H ..'
            sendPhoneNotification(phone, _body)
            responseMsg += 'Please enter the verification code to verify your phone:'
        }
        return(responseMsg)
    }
}