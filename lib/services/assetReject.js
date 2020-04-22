module.exports = function(options) {
      check(options, Object)
      
      createNotification({
        user: options.offer.offer.user.id,
        name: options.offer.offer.user.name,
        message: ['Your offer for leasing assets was rejected for the campaign ', options.project.title, '.'].join(''),
        title: options.project.title,
        slug: options.project.slug,
        purpose: 'assets',
        subject: ['Your offer for leasing assets was rejected for the campaign ', options.project.title, '.'].join('')
      })

      rejectedOffers([options.offer])
    }