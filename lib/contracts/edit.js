module.exports = function(_id, options) {
    check(_id, String)
    check(options, Object)
    if (Meteor.isClient) return
    var u = {}
    if (options.offer) u['expressOffer.offer'] = options.offer
    if (options.message) u['expressOffer.message'] = options.message
    Offers.update({ _id: _id }, { $set: u })
}