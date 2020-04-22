var Helpers = require('../helpers')
var createNotification = Helpers.createNotification

module.exports = function(options) {
    check(options, Object)
    // console.log('in approveLeaseRequest')
    // console.log(options)
    if (Meteor.isClient) return
    // update object to completed
    // money transfer to offeree

    Offers.update({ _id: options._id }, {
        $set: {
            accepted: true,
            pending: false,
        }
    })

    // console.log('offer updated')

    createNotification({
        user: options.offeree,
        message: ['Your offer for leasing ', options.assets.map(function(a) { return a.name }).join(', ') ,' assets was accepted.'].join(''),
        purpose: 'assets',
        offer: options._id,
        title: 'Your request for assets was accepted.'
    })

    var msg = ['You have now accepted to lease these assets.']
    if (options.receipt) {
        msg = msg.concat([['$', (options.receipt.amount/100), ' was applied to your account.'].join('')])
    };

    return msg.join(' ')
}