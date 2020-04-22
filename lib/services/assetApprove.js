module.exports = function(options) {
      check(options, Object)
      if (Meteor.isClient) return;

      var me = Meteor.user()

      addPointsToUser(144)

      var project = Projects.findOne({slug: options.project.slug})
      var backers = project.backers || [];
      if (Meteor.user()&&Meteor.user()._id) {
        if (backers.indexOf(Meteor.user()._id)===-1) backers.push(Meteor.user()._id);
      };

      Projects.update({slug: project.slug}, { $set: { backers: backers } })

      createNotification({
        user: options.offer.offer.user.id,
        name: options.offer.offer.user.name,
        message: ['Your offer for leasing assets was accepted for the campaign ', options.project.title, '.'].join(''),
        title: options.project.title,
        slug: options.project.slug,
        purpose: 'assets',
        subject: ['Your offer for leasing assets was accepted for the campaign ', options.project.title, '.'].join('')
      })

      createReceipt({
        order: options,
        owner: options.offer.offer.user.id,
        email: myEmail(),
        slug: 'resource leasing',
        amount: options.offer.offer.amount,
        purpose: 'resource leasing'
      });

      markOffersPendingOff([options.offer])

      return 'Congratulations, you have leased this item. Please follow-up with the resource owner.'
    }