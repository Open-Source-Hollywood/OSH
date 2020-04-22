module.exports = function(options) {
      check(options, Object);
      if (Meteor.isServer) {
        var applicantId = options.user._id
        var project = Projects.findOne({_id: options.project._id});
        var usersApproved = project.usersApproved || [];
        var usersApplied = project.usersApplied || [];
        var crewApplicants = project.crewApplicants || [];
        var castApplicants = project.roleApplicants || []

        // refund moneys if any
        crewApplicants.forEach(function(a) {
          if (a.receipt) {
            declinedUserRefund(a.receipt.id, project, a.receipt.amount, null, function() {})
          }
        })

        castApplicants.forEach(function(a) {
          if (a.receipt) {
            declinedUserRefund(a.receipt.id, project, a.receipt.amount, null, function() {})
          }
        })


        // remove user from crewApplicants & roleApplicants
        for (var i = crewApplicants.length - 1; i >= 0; i--) {
          var a = crewApplicants[i]
          if (a.user.id===applicantId) crewApplicants.splice(i, 1)
        }

        for (var i = castApplicants.length - 1; i >= 0; i--) {
          var a = castApplicants[i]
          if (a.user.id===applicantId) castApplicants.splice(i, 1)
        }

        // remove offers ( user + project )
        deleteRejectedOffers(options.offers)

        // remove communications
        ProjectMessages.remove({user: options.user._id, project: project._id})
        // ProjectMessages.update({user: options.user._id, project: project._id}, {$set: {archived:true}})

        // email author and notify
        var projectAuthor = Users.findOne({_id: project.ownerId})
        var notification_preferences = projectAuthor.notification_preferences || {}
        var email_preferences = notification_preferences.email || {}
        var phone_preferences = notification_preferences.phone || {}
        /**
          sendEmailNotification(email, html, text, subject)
          sendPhoneNotification(phone, body)
        */
        var textMessage = 'Applicant rejected your counter-offer for campaign: ' + project.title + '. '
        if (email_preferences.email&&email_preferences.verification===true) {
            /** send email notification */
            var html = emailToHTML('counteroffer rejected', textMessage)
            sendEmailNotification(email_preferences.email, html, textMessage, 'Counteroffer rejected on O . S . H .')
        }

        if (phone_preferences.phone&&phone_preferences.verification===true) {
            /** send phone notification */
            sendPhoneNotification(phone_preferences.phone, textMessage)
        }
      }
    }