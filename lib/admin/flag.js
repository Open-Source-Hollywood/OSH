var prettyHtml = require('json-pretty-html').default;
var Helpers = require('../helpers')
var sendEmailNotification = Helpers.sendEmailNotification

module.exports = function(options) {
	check(options, Object);
	var html = prettyHtml(options, options.complaint);
	if (Meteor.isServer) sendEmailNotification('aug2uag@gmail.com', html, JSON.stringify(options, null, 4), 'FLAGGED CONTENT!!')
	if (Meteor.isClient) vex.dialog.alert('this content has been flagged for review, thank you for your report');
}