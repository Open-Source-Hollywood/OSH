var Helpers = require('../helpers')
var sendEmailNotification = Helpers.sendEmailNotification

module.exports = function(options) {
    check(options, Object);
    var formattedMessage = '';
    // name, email, subject, message
    formattedMessage += 'Message FROM: ' + options.name;
    formattedMessage += ' (email: ' + options.email + ')';
    formattedMessage += '. Message SUBJECT: ' + options.subject + ' ... ... MESSAGE: ' + options.message;
    var _html = emailToHTML('NEW CONTACT US MESSAGE FROM O.S.H.', formattedMessage, null, null);
    var _text = formattedMessage;
    var _subject = "New Contact Us Message from O.S.H.";
    sendEmailNotification(['aug2uag@gmail.com'], _html, _text, _subject);
}