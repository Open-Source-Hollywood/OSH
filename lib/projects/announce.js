var Helpers = require('../helpers')
var addPointsToUser = Helpers.addPointsToUser
var createNotification = Helpers.createNotification

module.exports = function(options) {
    check(options, Object);
    if (Meteor.isClient) return;
    // console.log('in addProjectMessage')
    var fullURL = 'https://csc5w.app.goo.gl?link=https://opensourcehollywood.org/message/project/' + options.slug + '/' + options.user;
    var miniURL = getMiniURL(fullURL);
    addPointsToUser(89)
    ProjectMessages.insert({
        project: options.project,
        slug: options.slug,
        title: options.title,
        user: options.user,
        text: options.text,
        ownerId: Meteor.user()._id,
        ownerName: Meteor.user().firstName + ' ' + Meteor.user().lastName,
        ownerAvatar:Meteor.user().avatar,
        createdAt: moment().format("MMMM D, YYYY"),
        createTimeActual: new Date()
    });

    return createNotification({
        user: options.user,
        message: ['You have a new message in your negotiations with', myName(), 'update in your negotiations.'].join(' '),
        title: options.title,
        slug: options.slug,
        purpose: 'new message',
        subject: 'Negotiations Update'
    })
}