var Helpers = require('../helpers')
var myId = Helpers.myId
var myEmail = Helpers.myEmail
var miniMe = Helpers.miniMe
var createNotification = Helpers.createNotification

module.exports = function(options) {
    check(options, Object)

    if (Meteor.isClient) return;

    var project = options.project
    delete options['project']

    var me = Meteor.user()

    var o = {
        ctx: 'offer',
        type: 'assets',
        assets: options.assets,

        expressOffer: {
            offer: parseInt(options.offer),
            days: parseInt(options.days),
            message: options.message
        },

        offeror: me._id,
        offeree: project.ownerId,
        slug: project.slug,
        title: project.title,
        banner: project.banner,
        pending: true,
        offer: {
            ctx: 'assets',
            appliedFor: 'campaign asset leasing',
            message: 'campaign asset leasing',
            position: options.assets.map(function(a) { return a.name }).join(', '),
            amount: 0,
            paid: 0
        },
        parties: [project.ownerId, myId()]
    }

    o.offer.user = miniMe()
    o.offer.user.email = myEmail()

    if (o.expressOffer.days) {
        var d = new Date()
        d.setHours(d.getHours() + ((o.expressOffer.days||10) * 24))
        o.expiration = d
    };

    o.created = new Date()

    var offer = Offers.insert(o)
    createNotification({
        user: o.offeree,
        message: ['You have a new request for leasing ', options.assets.map(function(a) { return a.name }).join(', '), ' assets. Please check your active negotiations under DASHBOARD to access this item.'].join(''),
        purpose: 'assets',
        offer: offer,
        title: 'New request for your assets.'
    })

    if (!o.offer.user.email)
        return 'You successfully offered this resource. Without your email notifications, your ability to be reached is limited. Please configure your email in your profile settings.'

    return 'You successfully offered this resource.'
}
