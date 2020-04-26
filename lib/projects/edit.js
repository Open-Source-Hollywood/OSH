var Helpers = require('../helpers')
var DEBUG = Helpers.DEBUG
var projectGiftsToProducts = Helpers.projectGiftsToProducts
var createNotification = Helpers.createNotification
var uploadToS3 = Helpers.uploadToS3
var guid = Helpers.guid


module.exports = function (options) {
    check(options, Object)
    if (Meteor.isServer) {
        if (options._banner) {
            var fn = guid() + new Date().getTime()
            uploadToS3({
                name: fn,
                data: options._banner
            })
            // TODO: correct project banner path
            options.banner = 'https://s3-us-west-2.amazonaws.com/producehour/headshots/' + fn
            delete options['_banner']
        } else {
            // no new banner, do not update banner
            delete options['banner']
        }
        options.gifts = []
        options._gifts.forEach(function(obj) {
            if (obj.data) {
            var fn = guid() + new Date().getTime()
            uploadToS3({
                name: fn,
                data: obj.data
            })
            obj.url = 'https://s3-us-west-2.amazonaws.com/producehour/headshots/' + fn
            delete obj['data']
            options.gifts.push(obj)
        } else if (obj.url) {
            options.gifts.push(obj)
        }})
        delete options['_gifts']
        Projects.update({slug: options.slug}, {$set: options})
        var project = Projects.findOne({slug: options.slug})
        projectGiftsToProducts(project)
    }
}