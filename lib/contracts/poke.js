var Helpers = require('../helpers')
var getMiniURL = Helpers.getMiniURL
var sendEmailNotification = Helpers.sendEmailNotification

module.exports = function(options) {
    check(options, Object)
    if (Meteor.isClient) return
    /** update all offers from user to this project */
    var project = Projects.findOne({slug: options.slug})
    var updateObj = { $set: null }
    var crewApplicants = []
    var ctx = options.ctx
    var position = options.position

    if (ctx==='crew') {
        (project.crewApplicants||[]).forEach(function(a) {
            if (a.uid === options.uid&&a.position===position) {
                a.poke = true
                crewApplicants.push(a)
            }
        })
        updateObj = { $set: { crewApplicants: crewApplicants }}
    } else {
        (project.roleApplicants||[]).forEach(function(a) {
            if (a.uid === options.uid&&a.position===position) {
                a.poke = true
                roleApplicants.push(a)
            }
        })
        updateObj = { $set: { roleApplicants: roleApplicants }}
    }

    Projects.update({slug: options.slug}, updateObj)
    /** send project message to initiate negotiations */
    var fullURL = 'https://csc5w.app.goo.gl?link=https://opensourcehollywood.org/message/project/' + options.slug + '/' + options.uid
    var miniURL = getMiniURL(fullURL)
    var msg = (options.audition&&options.audition!=='N/A') ? 'You\'ve been selected to submit audition information for the ' + ctx + ' role "' + position + '", please upload your audition.' : 'You have been elected to negotiate your offer for the ' + ctx + ' role "' + position + '".'
    ProjectMessages.insert({
        project: options.project,
        slug: options.slug,
        title: project.title,
        user: options.uid,
        text: msg,
        ownerId: Meteor.user()._id,
        ownerName: 'OPEN SOURCE HOLLYWOOD',
        ownerAvatar: '/img/logo.png',
        createdAt: moment().format("MMMM D, YYYY"),
        createTimeActual: new Date()
    })
    notifyByEmailAndPhone({
        user: options.uid,
        title: 'Congratulations, you have been elected to negotiate your offer.',
        message: msg + ' at (you must be logged in) ' + miniURL,
        subject: 'Invitation to negotiate || O . S . H .'
    })
}