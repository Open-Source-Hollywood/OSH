var Helpers = require('./helpers')
var approveUserToProject = Helpers.approveUserToProject
var markOffersPendingOff = Helpers.markOffersPendingOff

module.exports = function(options) {
    check(options, Object)
    if (!Meteor.isClient) return;
    approveUserToProject(options)
    markOffersPendingOff(options.offers)
    return true
}