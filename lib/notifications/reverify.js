var Helpers = require('./helpers')
var sendEmailNotification = Helpers.sendEmailNotification
var sendPhoneNotification = Helpers.sendPhoneNotification

module.exports = function(reverify) {
    check(reverify, String)
    if (Meteor.isClient) return
    var notification_preferences = Meteor.user().notification_preferences || {}
    var email_preferences = notification_preferences.email || {}
    var phone_preferences = notification_preferences.phone || {}
    if (reverify==='email') {
        /** send email verification */
        var guid1 = Meteor.user().guid1
        var guid2 = Meteor.user().guid2
        var email = email_preferences.email
        var verificationURL = BASE_URL + 'verify/' + guid2 + '/' + guid1
        var _html = emailToHTML('VERIFY EMAIL', 'Your email was provided as a source for notifications on O . S . H .. To verify, please select the following: ', verificationURL, 'SELECT TO VERIFY')
        var _text = "Your email was provided as a source for notifications on O . S . H .. To verify, please visit the following URL: " + verificationURL
        var _subject = "Verify Email for Notifications from O . S . H ."
        sendEmailNotification(email, _html, _text, _subject)
        return('A verification email was dispatched to ' + email + '.')
    } else {
        var phone = phone_preferences.phone
        var verificationCode = Meteor.user().phone_verification_code
        var _body = verificationCode + ' is your verification code for O . S . H ..'
        sendPhoneNotification(phone, _body)
        // return('Please enter the verification code to verify your phone:');
        // show dialog to enter and verify phone PIN
    }
}
