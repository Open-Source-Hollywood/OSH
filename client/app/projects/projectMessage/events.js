const StripePublicKey = 'pk_test_imJVPoEtdZBiWYKJCeMZMt5A'//'pk_live_GZZIrMTVcHHwJDUni09o09sq';

function makeStripeCharge(options) {
  StripeCheckout.open({
    key: StripePublicKey,
    amount: Math.abs(Math.floor(options.stripePaid*100))<1?1:Math.abs(Math.floor(options.stripePaid*100)),
    currency: 'usd',
    name: options.message,
    bitcoin: true,
    description: options.description || 'opensourcehollywood.org',
    panelLabel: 'Pay Now',
    token: function(_token) {
      if (_token) {
        options.token = _token;
		Meteor.call(options.route, options, function(err, result) {
			if (err) return vex.dialog.alert('your payment failed');
			vex.dialog.alert(result)
		});
      } else {
        vex.dialog.alert('your payment did not succeed');
      }
    }
  });
};

Template.projectMessage.events({
	'click #rejectUser': function(e) {
		vex.dialog.confirm({
	      message: "Please confirm: you are rejecting " + was.offers[0].offer.user.name,
	      buttons: [
	        $.extend({}, vex.dialog.buttons.YES, { text: 'Yes' }),
	        $.extend({}, vex.dialog.buttons.NO, { text: 'No' })
	      ],
	      callback: function (result) {
	        if (result) {
	          Meteor.call('rejectUserFromProject', was.offers);
	          vex.dialog.alert('applicant rejected');
	          setTimeout(function() { history.back() }, 1597);
	        };
	      }
	  	});
	},
	'click #revokeOffer': function(e) {
		vex.dialog.confirm({
	      message: "Please confirm: you are revoking " + was.project.title,
	      buttons: [
	        $.extend({}, vex.dialog.buttons.YES, { text: 'Yes' }),
	        $.extend({}, vex.dialog.buttons.NO, { text: 'No' })
	      ],
	      callback: function (result) {
	        if (result) {
	          Meteor.call('revokeOffer', was.offers);
	          vex.dialog.alert('your offer was revoked');
	          setTimeout(function() { history.back() }, 1597);
	        };
	      }
	  	});
	},
	'click #counterk': function(e) {
		e.preventDefault();
		// console.log('clicked counterk')
		var counteroffer = {
			negotiationTerms: $('#negotiationTerms').val(),
			negotiationDamages: $('#negotiationDamages').val(),
			financials: $('#financials').val(),
			equities: $('#equities').val()
		}
		Meteor.call('counterRoleOffer', {
			counteroffer: counteroffer,
			context: was
		});

		vex.dialog.alert('your counter offer was sent')
		setTimeout(function() { history.back() }, 1597);
	},
	'click #authorfinalizek': function(e) {
		e.preventDefault();

		var agg = []
		$('.offer_role_decision:checked').each(function() {
			var o = {}
			o[$(this).val()] = JSON.parse($(this).attr('val'))
			agg.push(o)
		})

		Meteor.call('authorFinalizeAgreement', {
			offers: agg,
			user: was.user,
			project: was.project
		}, function(err, result) {
			if (result===true) {
				vex.dialog.alert({
				    message: 'Applicant approved, this negotiations is complete',
				    callback: function () {
				        history.back()
				    }
				});
			};	
		});
	},
	'click #counterofferbtn': function(e) {
		$('#counteroffer').show();
		$('#equity_negotiations_block')[0].reset();
		window.scrollTo({
			'behavior': 'smooth',
			'left': 0,
			'top': document.getElementById('counteroffer').offsetTop
		});
	},
	'click #applicantfinalizek': function(e) {
		e.preventDefault();
		Meteor.call('applicantFinalizeAgreement', was, function(err, result) {
			if (result===true) {
				vex.dialog.alert({
				    message: 'Offer accepted, this negotiations is complete',
				    callback: function () {
				        history.back()
				    }
				});
			};	
		});
	},
	'click #applicantrejectoffer': function(e) {
		e.preventDefault();
		Meteor.call('applicantRejectOffer', was, function(err, result) {
			if (result===true) {
				vex.dialog.alert({
				    message: 'Offer accepted, this negotiations is complete',
				    callback: function () {
				        history.back()
				    }
				});
			};	
		});
	},
	'change .auditionURL': function(e) {
		this.url = $(e.target).val() || null;
		Meteor.call('addAuditionURL', this);
	},
	'click #assetsmakeoffer': function() {

		var that = this

		/**
			@function 
			calculate costs
			collect pay
			make request
		  */
		function evalThisOffer(_offer) {

			var _o = {
				hourly: [], 
				daily: [], 
				weekly: [],
				payment: []
			}

			var items = []
			var fixed = 0
			var maxDepositPercent = 0
			var maxDepositFixed = 0

			_offer.assets = $('.yes-button:checked').map(function() {
				return JSON.parse($(this).attr('val'))
			}).get()

			if (!_offer.assets||!_offer.assets.length) {
				// handle no offers selected
				return vex.dialog.confirm({
					message: 'None of the assets were marked accepted above.\n\nWould you like to reject this offer?', 
					callback: function(a) {
						if (a) {
							$('#assetsrejectoffer').click()
							return setTimeout(function() {
								Router.go('Dashboard')
							}, 987)
						};
					}
				})
			}


			/*
				assets each =>

					fixed: NaN, 
					hourly: 10, 
					daily: 50, 
					weekly: 100
			*/
			_offer.assets.forEach(function(a) {
				items.push({
					category: a.category,
					item: a.name,
					description: a.description
				})


				if (a.deposit) {
					if (a.deposit.type==='percent') {
						maxDepositPercent = Math.max(a.deposit.amount, maxDepositPercent)
					} else {
						maxDepositFixed = Math.max(a.deposit.amount, maxDepositFixed)
					}
				};


				for (var key in a.pricing) {
					if (a.pricing[key])
						if (_o[key])
							_o[key].push(a.pricing[key])
						else
							fixed += a.pricing[key]
				}
				// get pricing options
				a.paySchedule.forEach(function(_a) {
					if (_o.payment.indexOf(_a)===-1)
						_o.payment.push(_a)
				})
			})

			for (var key in _o) {
				if (key==='payment') continue
				_o[key] = (function() {
					var max = 0
					for (var i = 0; i < _o[key].length; i++) {
						if (!max||_o[key][i] > max) max = _o[key][i];
					};
					return max
				}())
			}

			_offer.order = _o

	        var totalWeeks = _offer.weeks
	        var totalDays = _offer.days + _offer.remDays
	        var totalHours = _offer.hours + _offer.remHours

	        var weeklyPrice = _offer.order.weekly
	        var dailyPrice = _offer.order.daily
	        var hourlyPrice = _offer.order.hourly

	        var weeklyCost = weeklyPrice * totalWeeks
	        var dailyCost = dailyPrice * totalDays
	        var hourlyCost = hourlyPrice * totalHours

	        // show request summary, expected charges, and amount owed now
	        // 1) only one pay mode? do it, else choose payment mode
			var dialogContent = [
	            '<div class="row">',
	              '<div class="col-sm-7">Confirm Request for this Asset</div>',
	              '<p>&nbsp;</p>',
	              '<p class="krown-column-container small">Items</p>',
	              '<div class="panel-body">',
	                '<table class="table"><tbody>'
	        ]

	        items.forEach(function(i) {
	        	dialogContent = dialogContent.concat([
	        		'<tr>',
	        			'<td>', i.category, '</td>',
	        			'<td>', i.item, '</td>',
	        			'<td>', i.description, '</td>',
	        		'</tr>',
	        	])
	        })

	        dialogContent = dialogContent.concat([
	            '</tbody></table>',
	              '</div>'
	        ])

	        if (weeklyCost||dailyCost||hourlyCost||fixed) {
		        // show pricing
		        dialogContent = dialogContent.concat([
		        	'<p class="krown-column-container small">Estimated Cost</p>',
		            '<div class="panel-body">',
		                '<table class="table"><tbody>'
		        ])

		        if (weeklyCost) {

		        	dialogContent = dialogContent.concat([
		        		'<tr>',
		        			'<td>Weekly Pricing</td>',
		        			'<td>', weeklyCost, '</td>',
		        		'</tr>',
		        	])

		        } else if (dailyCost) {

		        	dialogContent = dialogContent.concat([
		        		'<tr>',
		        			'<td>Daily Pricing</td>',
		        			'<td>', dailyCost, '</td>',
		        		'</tr>',
		        	])

		        } else if (hourlyCost) {

		        	dialogContent = dialogContent.concat([
		        		'<tr>',
		        			'<td>Hourly Pricing</td>',
		        			'<td>', hourlyCost, '</td>',
		        		'</tr>',
		        	])

		        } else if (fixed) {

		        	dialogContent = dialogContent.concat([
		        		'<tr>',
		        			'<td>Fixed Pricing</td>',
		        			'<td>', fixed, '</td>',
		        		'</tr>',
		        	])

		        }

		        dialogContent = dialogContent.concat([
		            '</tbody></table>',
		              '</div>'
		        ])
	        }

	        dialogContent = dialogContent.concat([
	        	'</div>'
	        ])

	        // payment options
		    var buttons = []
		    var payMaps = { none: 0 }
		    var fullAmount = weeklyCost||dailyCost||hourlyCost||fixed||0

		    if (_offer.order.payment.indexOf('full')>-1) {
		    	
		    	payMaps.full = fullAmount
				buttons.push($.extend({}, vex.dialog.buttons.NO, { 
					text: ['Pay Escrow in Full ($', fullAmount,')'].join(''), 
					className: 'aquamarineB krown-alert', 
					click: function($vexContent, event) {
						this.value = 'full'
						this.price = fullAmount
						this.close()
				}}))
		    }

		    if (_offer.order.payment.indexOf('deposit')>-1) {

		    	// define max per-cent
		    	var depositAmount = maxDepositFixed ? maxDepositFixed : (maxDepositPercent/100) * fullAmount
		    	payMaps.deposit = depositAmount
		    	console.log(maxDepositFixed, maxDepositPercent)
		    	if (depositAmount>0) {
		    		buttons.push($.extend({}, vex.dialog.buttons.NO, { 
			    		text: ['Pay Partial Deposit ($', depositAmount,')'].join(''),
			    		className: 'lemonB krown-alert', 
			    		click: function($vexContent, event) {
					        this.value = 'deposit'
					        this.close()
				    }}))
		    	};
		    }

		    if (!buttons.length||_offer.order.payment.indexOf('none')>-1) {
		    	buttons.push($.extend({}, vex.dialog.buttons.NO, { 
		    		text: 'Arrange without Payment', 
		    		className: 'thistle krown-alert', 
		    		click: function($vexContent, event) {
				        this.value = 'none'
				        this.close()
			    }}))
		    }

		    buttons.push($.extend({}, vex.dialog.buttons.NO, { text: 'Cancel' }))

			vex.dialog.open({
				input: dialogContent.join(''),
				buttons: buttons,
				callback: function(data) {
					if (payMaps[data]) {

						Object.assign(_offer, {
							stripePaid: payMaps[data],
							message: 'Asset Escrow Payment',
							description: ['$', payMaps[data], ' offer (', _offer.assets.length,' assets)'].join(''),
							route: 'leaseRequest',
						})
						console.log(_offer)
						// console.log(JSON.stringify(_offer, null, 4))
						makeStripeCharge(_offer)
					} else {
						_offer.free = true
						Meteor.call('leaseRequest', _offer, function(err, res) {
							console.log(err, res)
						})
					}
				}
			})
		}

        var h = parseInt($('#hours_ass').val())
        var sd = $('#start_date_ass').val()
        var st = $('#start_time_ass').val()
        var ed = $('#end_date_ass').val()
        var et = $('#end_time_ass').val()
        var offereeContact = {
        	phone: $('#phone_contact').val(),
        	email: $('#email_contact').val()
        }
        var escrow = 0

        var assets = this.offer.assets
        var payOptions, hours, days, weeks, remHours, remDays, startDate, endDate

        if (!h) {

        	if (!sd||!ed) {
        		return vex.dialog.alert('Please include start and end dates.')
        	};

        	// is end date after start date ?
        	startDate = new Date(sd)
        	endDate = new Date(ed)
        	var d = new Date()

        	if (startDate>endDate) {
        		return vex.dialog.alert('End date must be later than start date')
        	};

        	if (d>startDate) {
        		return vex.dialog.alert('Start date must be 1 day in the future')
        	};

        	var delta = endDate - startDate
        	var seconds = delta/1000
        	hours = parseFloat((seconds * 0.000277778).toFixed(2))
        	weeks = 0, remDays = 0, days = 0, remHours = 0

        	if (delta === 0) {
        		days = 1
        	} else {
	        	if (hours > 24) {
	        		days = hours/24
			    	remHours = hours%24
	        	};

	        	if (days > 7) {
	        		weeks = days / 7
	        		remDays = days%7
	        	};
        	}
        }

        evalThisOffer({
        	offer: that.offer,
        	assets: assets||[],
        	payOptions: payOptions||{},
        	weeks: parseInt(weeks||0),
        	days: parseInt(days||0),
        	remDays: parseInt(remDays||0),
        	hours: parseInt(hours||h||0),
        	remHours: parseInt(remHours||0),
        	startDate: startDate,
        	endDate: endDate,
        	offereeContact: offereeContact
        })
    },
	'click #submit-message': function(e) {
		e.preventDefault();
		var text = $('#message-box').val();
		$('#message-box').val('');
		Meteor.call('addProjectMessage', {
			user: this.user._id,
			project: this.project._id,
			slug: this.project.slug,
			title: this.project.title,
			text: text
		});
	}
})