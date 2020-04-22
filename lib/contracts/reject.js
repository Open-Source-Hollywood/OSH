var Helpers = require('../helpers')
var DEBUG = Helpers.DEBUG
var deleteRejectedOffers = Helpers.deleteRejectedOffers
var rejectedOffers = Helpers.rejectedOffers
var createNotification = Helpers.createNotification
var createReceipt = Helpers.createReceipt
var sendEmailNotification = Helpers.sendEmailNotification
var sendPhoneNotification = Helpers.sendPhoneNotification
var removeProjectMessages = Helpers.removeProjectMessages
var declinedUserRefund = Helpers.declinedUserRefund


module.exports = function(offers) {
    check(offers, Array)
    if (Meteor.isClient) return
    var message = ''
    var applicantId = offers[0]&&offers[0].offer&&offers[0].offer.user&&offers[0].offer.user.id||null
    if (!applicantId) return
    var slug = offers[0].slug
    var project = Projects.findOne({slug: slug})
    var message='Your application for '+project.title+' was declined.'
    var usersApplied = project.usersApplied
    var idxApplied = usersApplied.indexOf(applicantId)
    usersApplied.splice(idxApplied, 1)
    // make sure to have values here, default to empty array
    var crewApplicants = project.crewApplicants||[]
    var roleApplicants = project.roleApplicants||[]
    var refunds = project.refunds||[]
    for (var i = crewApplicants.length - 1; i >= 0; i--) {
        var ca = crewApplicants[i]
        if (ca.user&&ca.user.id===applicantId) crewApplicants.splice(i, 1)
    }

    for (var i = roleApplicants.length - 1; i >= 0; i--) {
        var ra = roleApplicants[i]
        if (ra.user&&ra.user.id===applicantId) roleApplicants.splice(i, 1)
    }
    var stripeTransactions = []
    var receipts = []
    var refundAmount = 0

    for (var i = 0; i < offers.length; i++) {
        var o = offers[i]
        if (o.receipts) {
            o.receipts.forEach(function(receipt) {
              stripeTransactions.push({
                  id: receipt.id,
                  amount: receipt.amount/100,
                  offerId: o._id
              })
              refundAmount+=receipt.amount/100
            })
        }
    }
    if (refundAmount>0) message = [message, 'You were refunded $' + (refundAmount/100).toFixed(2) + '.'].join(' ')

    function declinedUserTransactionsProcess(o) {
        if (!o) {
            return finalRejectApplicantHandler()
        } else {
          var tx = o.id||null
          var amount = o.amount||0
          var offerId = o.offerId
          return declinedUserRefund(tx, project, amount, receipts, function(err) {
              Receipts.update({ offer: offerId }, {$set: {
                pending: false,
                rejected: true,
                refund: receipts
              }}, { multi: true })
              return declinedUserTransactionsProcess(stripeTransactions.shift())
          }, applicantId)
        }
    }

    function finalRejectApplicantHandler() {
        refunds = refunds.concat(receipts)
        // reject all offers from this applicant to this project
        deleteRejectedOffers(offers)

        Projects.update({_id: project._id}, 
            { 
            $set: {
              usersApplied: usersApplied,
              crewApplicants: crewApplicants,
              roleApplicants: roleApplicants,
              refunds: refunds
            }
        })

        return createNotification({
            user:applicantId,
            message:message,
            title: project.title,
            slug: project.slug,
            purpose: 'declined'
        })
    }

    return declinedUserTransactionsProcess(stripeTransactions.shift())
}