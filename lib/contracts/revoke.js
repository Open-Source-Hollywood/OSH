var Helpers = require('./helpers')
var declinedUserRefund = Helpers.declinedUserRefund

module.exports = function(options) {
    // console.log(options)
    check(options, Array)
    if (Meteor.isClient) return
    var receipts = []
    var project
    var projectOwner
    try {
        for (var i = options.length - 1; i >= 0; i--) {
            var o = options[i]
            if (o.slug) {
                project = Projects.findOne({ slug: o.slug })
                break
            }
        }
    } catch(e) {}

    try {
        options.forEach(function(o) {
            if (!o) return
            var offerId = o._id
            // console.log(new Array(100).join('0 '))
            // console.log(o)
            if (o.receipts) {
                var receipt = o.receipts[0]
                // console.log(new Array(100).join('@ '))
                // console.log(o)

                return declinedUserRefund(o.receipts[0].id, project, o.receipts[0].amount, receipts, function(err, receipts) { 
                    // console.log(err, receipts)
                    if (receipts) {
                        Receipts.update({ offer: offerId }, {$set: {
                            pending: false,
                            revoked: true,
                            refund: receipts
                        }}, { multi: true })
                        // console.log(new Array(100).join('! '))
                        // console.log('refund receipts here')
                        // remove offer
                        Offers.remove({_id: offerId})
                        finalRevokeNotificationsHandler()
                    }
                })
            } else {
                // remove offer
                Offers.remove({_id: offerId})
                finalRevokeNotificationsHandler()
            }

            function finalRevokeNotificationsHandler() {
                if (project) {
                    // notification object project creator
                    Notifications.insert({
                        user: project.ownerId,
                        name: project.ownerName,
                        message: [myName(), 'revoked their offer for', o.message].join(' '),
                        from: myName(),
                        avatar: myAvatar(),
                        title: project.title,
                        slug: project.slug,
                        offer: o,
                        purpose: 'offer was revoked',
                        created: new Date(),
                        viewed: false
                    })
                }

                // notification object revoker
                Notifications.insert({
                    user: myId(),
                    name: myName(),
                    message: options.message,
                    from: myName(),
                    avatar: project.banner,
                    title: project.title,
                    slug: project.slug,
                    offer: o,
                    purpose: 'offer was revoked',
                    created: new Date(),
                    viewed: false
                })
            }
        })
    } catch(e) {}
}