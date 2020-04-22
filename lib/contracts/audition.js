module.exports = function(options) {
      check(options, Object);
      /** options.url append to application object */
      if (Meteor.isClient) return;
      Offers.update({_id: options.offer._id}, {$set: { url: options.url }});
}