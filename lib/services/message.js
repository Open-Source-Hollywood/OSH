var Helpers = require('../helpers')
var addPointsToUser = Helpers.addPointsToUser

module.exports = function(options) {
    check(options, Object)
    if (Meteor.isClient) return;
    addPointsToUser(144)
    var o = Offers.findOne({_id: options.offer})

    var messages = o.messages||[]
        messages.push({
        text: options.text,
        ownerId: Meteor.user()._id,
        ownerName: Meteor.user().firstName + ' ' + Meteor.user().lastName,
        ownerAvatar:Meteor.user().avatar,
        createdAt: moment().format("MMMM D, YYYY"),
        createTimeActual: new Date()
    })

    Offers.update({_id: o._id}, {$set: {messages: messages}})
}