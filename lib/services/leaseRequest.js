module.exports = function(options) {
      check(options, Object)
      if (Meteor.isClient) return;
      var _id = options.offer._id

      function updateOfferLeaseReq() {
        var offer = Offers.findOne({ _id: _id})
        var msg1 = ['You have a new offer for your Asset. The offer includes time specifications, and may also include a payment of escrow that is pending your decision. We will automatically decline this offer if there is no response within 72 hours.'], msg2 = ['You have made an offer for assets with time specifications. We are now waiting for the owner of the assets to make their decision. If they reject your offer, you will be notified and your funds returned to you. Thanks for your order and for using O . S . H .'], msg3
        delete options['assets']
        delete options['offer']

        var u = { offereeDecision: true }

        if (options.receipt) {
          msg3 = [' An escrow payment of $', (options.receipt.amount/100).toFixed(2), ' is collected and available for this item upon approval.'].join('')
          u.receipt = options.receipt
          delete options['receipt']
        }
        
        u.consideration = options
        var d = new Date()
        u.offerMadeOn = d
        u.offerEndsOn = new Date(d.setHours(d.getHours() + 72))
        Offers.update({ _id: _id }, { $set: u })

        // create notifications for both parties
        var offereeMsg = msg3 ? msg2.concat(msg3).join(' ') : msg2.join('')
        var offerorMsg = msg3 ? msg1.concat(msg3).join(' ') : msg1.join('')
        createNotification({
            user: offer.offeror,
            message: offerorMsg,
            title: 'Assets leasing offer.',
            slug: 'Resource procurement for ' + myName() + '.',
            purpose: 'assets'
        })

        createNotification({
            user: offer.offeree,
            message: offereeMsg,
            title: 'Assets leasing offer.',
            slug: 'Resource procurement for ' + myName() + '.',
            purpose: 'assets'
        })
      }


      if (options.token) {

        var stripe = require("stripe")(
          StripeServerKey
        );


        var future = new (Npm.require('fibers/future'))();

        stripe.charges.create({
          amount: Math.floor(options.stripePaid * 100),
          currency: "usd",
          source: options.token.id,
          transfer_group: options.offer.offeror
        }, Meteor.bindEnvironment(function(err, charge) {
          if (err) return future.return(err.message);
          if (charge) {
            
            options.receipt = charge
            updateOfferLeaseReq()

            future.return('Your payment succeeded and is currently in escrow.\n\nYou may revoke your offer anytime prior to it\'s acceptance.');
          } else {
            future.throw(new Meteor.Error("error", "payment failed"));
            return
          }
        }));

        return future.wait();

      };

      updateOfferLeaseReq()
    }