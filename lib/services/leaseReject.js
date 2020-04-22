module.exports = function(options) {
      check(options, Object)
      if (Meteor.isClient) return
      // refund if receipt
      // update object to rejected
      // notify rejection and/or refund 
      if (options.receipt) {
        var future = new (Npm.require('fibers/future'))();
        var stripe = require("stripe")(
            StripeServerKey
        );
        stripe.refunds.create({
            charge: options.receipt.id,
        }, Meteor.bindEnvironment(function(err, receipt) {
            if (err) return future.return(err.message);

            Offers.update({ _id: options._id }, {
              $set: {
                rejected: true,
                pending: false,
                refund: receipt
              }
            })

            createNotification({
                user: options.offeree,
                message: ['Your offer for leasing ', options.assets.map(function(a) { return a.name }).join(', '), ' assets was rejected, and you were refunded your escrow amount of $', options.receipt.amount/100, ' that will be automatically transferred to you.'].join(''),
                purpose: 'assets',
                offer: options._id,
                title: 'Your request for assets was rejected.'
            })

            future.return('You have successfully rejected this offer, and any escrow money deposited was refunded.');
        }));

        return future.wait();
      };

      Offers.update({ _id: options._id }, {
        $set: {
          rejected: true,
          pending: false,
        }
      })

      createNotification({
          user: offer.offeree,
          message: ['Your offer for leasing ', options.assets.map(function(a) { return a.name }).join(', ') ,' assets was rejected.'].join(''),
          purpose: 'assets',
          offer: options._id,
          title: 'Your request for assets was rejected.'
      })

      return 'You have successfully rejected this offer.'
    }