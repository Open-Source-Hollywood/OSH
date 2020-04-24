var Helpers = require('../helpers')
var uploadToS3 = Helpers.uploadToS3
var userGiftsToProducts = Helpers.userGiftsToProducts

module.exports = function(gift) {
    check(gift, Object)
    if (Meteor.isClient) return;
    if (gift.data) {
        var fn = guid() + new Date().getTime();
        uploadToS3({
            name: fn,
            data: gift.data
        });
        gift.url = 'https://s3-us-west-2.amazonaws.com/producehour/headshots/' + fn;
        delete gift['data'];
    } 

    // TODO: make new collection for gifts
    var gifts = Meteor.user().gifts || []
    gifts.push(gift)
    addPointsToUser(221)

    Users.update({ _id: myId() }, { $set: { gift: gift } })
    userGiftsToProducts()
}