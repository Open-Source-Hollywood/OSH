module.exports = function(options) {
    check(options, Object);
    if (Meteor.isClient) return;
    // var offerTypes = []
    // var offerRoles = []
    // var userObject = null
    // var toDeleteId = []

    // options.context.offers.forEach(function(o) {
    //   if (offerTypes.indexOf(o.ctx)===-1) offerTypes.push(o.ctx)
    //   if (offerRoles.indexOf(o.position)===-1) offerRoles.push(o.position)
    //   if (!userObject) userObject = o.user
    //   toDeleteId.push(o._id)
    // })

    // var o = Offers.findOne({_id: toDeleteId[0]})
    // delete o['_id']
    // delete o['offer']

    // o.offer = {
    //   ctx: offerTypes.join(', '),
    //   position: offerRoles.join(', '),
    //   type: 'hired',
    //   pay: parseInt(options.counteroffer.financials)||0,
    //   equity: parseInt(options.counteroffer.equities)||0,
    //   slug: options.context.project.slug,
    //   appliedFor: offerRoles.join(', '),
    //   audition: 'N/A',
    //   uid: userObject.id,
    //   user: userObject,
    //   needsApplicantAction: true,
    //   authorCounterOffer: true,
    //   customTerms: options.negotiationTerms,
    //   customLimits: options.negotiationDamages
    // }

    // Offers.insert(o)
}