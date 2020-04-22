module.exports = function(options) {
      check(options, Object);
      if (Meteor.isServer) {
        var project = Projects.findOne({slug: options.slug});
        delete options['slug'];
        options.user = miniMe()


        options.user.email = myEmail()
        options.created = new Date();
        options.message = myName()+' offered to lend '+options.asset+' for $'+ options.offer;
        var offeredResources = project.offeredResources || [];
        var mappedStings = offeredResources.map(function(o){return o.user.id});

        Projects.update({_id: project._id}, { $addToSet: { offeredResources: options }});
        // user, message, title, slug, purpose
        createNotification({
          user:project.ownerId,
          message:options.message,
          title: project.title,
          slug: project.slug,
          purpose: 'lend'
        });
        options.uid = Meteor.user()._id;
        options.parties = [project.ownerId, myId()]
        Offers.insert(options);

        var projectOwner = Users.findOne({_id: project.ownerId});
        var notification_preferences = projectOwner.notification_preferences || {};
        var email_preferences = notification_preferences.email || {};
        var phone_preferences = notification_preferences.phone || {};
        /**
            sendEmailNotification(email, html, text, subject)
            sendPhoneNotification(phone, body)
          */
        var textMessage = options.message;
        if (email_preferences.email&&email_preferences.verification===true) {
          /** send email notification */
          var html = emailToHTML('RESOURCE OFFER!', textMessage);
          sendEmailNotification(email_preferences.email, html, textMessage, 'New Resource Offer from O . S . H .');
        }

        if (phone_preferences.phone&&phone_preferences.verification===true) {
          /** send phone notification */
          sendPhoneNotification(phone_preferences.phone, textMessage);
        }
      }
    }