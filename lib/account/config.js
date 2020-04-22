var Helpers = require('../helpers')
var myEmail = Helpers.myEmail
var sendEmailNotification = Helpers.sendEmailNotification


module.exports = function(options) {
      check(options, Object)
      // console.log('userConfig')
      if (Meteor.isClient) return;
      // console.log(options)

      if (!myEmail()&&!options.email) return 'Include your email as part of your agreement to the terms of services.';

      var uroles = Meteor.user().iam || []

      var idxP = uroles.indexOf('Producer')
      if (options.roles.indexOf('producer') > -1) {

        if (idxP==-1) {
          uroles.push('Producer')
        };

      } else {
        
        if (idxP>-1) {
          uroles.splice(idxP, 1)
        };
      }

      var u = { iamRoles: options.roles }
      u.didOnboard = true
      var email = options.email&&options.email.indexOf('@') > -1 ? options.email.trim() : options.phone&&options.phone.indexOf('@') > -1 ? options.phone.trim() : null
      // var phone = options.phone.indexOf('@') === -1 ? options.phone.trim() : options.email.indexOf('@') === -1 ? options.email.trim() :  null
      if (email) {
        u.email = email
        /* The following example sends a formatted email: */
        var guid1 = guid();
        var guid2 = guid();

        /** set guids to user */
        email_preferences.email = email;
        email_preferences.verification = true;
        notification_preferences.email = email_preferences;
        Meteor.users.update({_id: Meteor.user()._id}, {$set: {'guid1': guid1, 'guid2': guid2, notification_preferences: notification_preferences}});
        var verificationURL = BASE_URL + 'verify/' + guid2 + '/' + guid1;
        var _html = emailToHTML('VERIFY EMAIL', 'Your email was provided as a source for notifications on O . S . H .. To verify, please select the following:', verificationURL, 'SELECT TO VERIFY');
        var _text = "Your email was provided as a source for notifications on O . S . H .. To verify, please visit the following URL: " + verificationURL;
        var _subject = "Verify Email for Notifications from O . S . H .";
        sendEmailNotification(email, _html, _text, _subject);
      }
      Users.update({_id: Meteor.user()._id}, {$set: u})
      return
    }