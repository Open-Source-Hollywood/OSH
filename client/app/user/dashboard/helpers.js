function ConvertToCSV(json) {
  var order = json.order
  var csv = 'Purchaser, Email, Phone, Shipping Name, Shipping Address 1, Shipping Address 2, Order, Purchase ID, Order ID, Total Units, Total Order\n'
  csv += [
    order.user.name, order.email, order.phone, order.name, order.address, [order.city, order.state, order.zip].join(' '),
    order.order.map(function(o) {
      return ['item: ', o.key, ' - quantity: ', o.quantity].join('')
    }).join(' ... '),
    order.receipt.id, 
    json._id, 
    order.totalUnits, 
    ['$', order.amount].join('')
  ].join(', ')

  var data, filename, link;

  filename = [json._id,'.csv'].join('');

  csv = 'data:text/csv;charset=utf-8,' + csv;
  data = encodeURI(csv);

  link = document.createElement('a');
  link.setAttribute('href', data);
  link.setAttribute('download', filename);
  link.click();
}

function quantOrdersTable(quantOrders, o, msrp) {
  var _order = [], totalOrder = 0
  quantOrders.forEach(function(o) {
    totalOrder+=o.quantity
    _order = _order.concat([
      '<tr><td>',
        o.key,
      '</td>',
      '<td>',
        o.quantity,
      '</td><td class="center">--</td></tr>'
    ])
  })

  _order = _order.concat([
      '<tr><td class="center">&nbsp;</td><td class="center">&nbsp;</td>',
      '<td>$',
        totalOrder * msrp,
      '</td></tr>'
  ])

  return _order.join('')
}

function iAmOfferee(offereeId) {
	if (Meteor.user()._id===offereeId) return true;
	return false
}

Template.dashboard.helpers({
	stringify: function() {
		return JSON.stringify(this)
	},
	subType: function() {
		if (this.type==='user') return 'fa-user'
		return 'fa-sitemap'
	},
	subLink: function() {
		if (this.type==='user') return '/profile/' + this.user
		return '/projects/' + this.slug  + '/' + this.projectOwnerId
	},
	subURL: function() {
		return this.avatar||this.banner
	},
	subDescription: function() {
		return this.description.replace('O . S . H . ', '')
	},
	subFreq: function() {
		return {
			day: 'Daily Subscription',
			week: 'Weekly Subscription',
			month: 'Monthly Subscription',
			year: 'Annual Subscription'
		}[this.frequency]
	},
	orderChannel: function() {
		if (this.slug==='personal merchandise') return 'personal merch';
		return this.title
	},
	contractLink: function() {
		if (this.ctx&&this.ctx==='offer') {
			if (!this.slug) {
				if (iAmOfferee(this.offeree)) {
					return ['/message/project/', this.offeror, '/', this._id].join('')
				} else {
					return ['/message/project/', this.offeree, '/', this._id].join('')
				}
			};
			return ['/message/project/', this.slug, '/', this._id].join('')
		};
		// console.log(this)
		var userId = typeof this.user === 'string' ? this.user : this.offer&&this.offer.user ? this.offer.user.id : ''
		if (!userId) return false;
		return ['/message/project/', this.slug, '/', userId].join('')
	},
	offerLink: function() {
		// console.log(this)
		if (iAmOfferee(this.offeree)) {
			return '/profile/' + this.offer.user.id
		};

		if (!this.slug) {
			if (iAmOfferee(this.offeree)) {
				return '/profile/' + this.offeror
			} else {
				return '/profile/' + this.offeree
			}
		};

		return ['/projects/',this.slug,'/',this.offeree].join('')
	},
	offerName: function() {
		if (iAmOfferee(this.offeree)) {
			return this.offer.user.name	
		};

		if (this.title) return this.title

		if (this.offer) {
			if (this.offer.user&&this.offer.user.name) {
				return [this.offer.user.name, this.offer.message].join(' ')
			};

			if (this.offer.message) return this.offer.message;
		};
		
		return 'Active Contract Negotiation'
	},
	offerImg: function() {
		if (iAmOfferee(this.offeree)||!this.slug) {
			return this.offer.user.avatar	
		};
		
		return this.banner
	},
	was: function() {
		setTimeout(function() {
			// var switchNav = localStorage.getItem('switchnavDashboard')
			// console.log('switchNav', switchNav)
			
		}, 667)
	},
	leaseTotals: function() {
		if (this.assetLeases.length<=1) {
		  return this.assetLeases[0]&&this.assetLeases[0].amount||0
		};
		return this.assetLeases.reduce(function(a,b) {
		  return a.amount + b.amount
		})
	},
	orderDate: function() {
		return new Date(this.created).toDateString()
	},
	fulfilled: function() {
		if (this.fulfilled) return true;
		return false
	},
	giftTotals: function() {
		if (this.giftPurchases.length<=1) {
		  return this.giftPurchases[0]&&this.giftPurchases[0].amount||0
		};
		return this.giftPurchases.reduce(function(a,b) {
		  return a.amount + b.amount
		})
	},
	purchaseStatus: function() {
		return this.status||'unfulfilled'
	},
	createAccount: function() {
		Meteor.call('createBankingAccount');
	},
	equityCamps: function() {
		/** 
			if my id is in list of equity holders:
				id:
				details: {
					value: percent equity
					date assigned:
					considerationType: author | patron | cast | crew | resource
					considerationValue: amount | role | resource -- details
				}
		*/
		var _id = Meteor.user()._id;
		return Projects.find({
			$or: [
				{
					$and: [
			          { archived: true },
			          { ownerId: _id }
			        ]
				},
				{
					"equity.id": _id
				}
			]
	    });
	},
	activeCamps: function() {
		var _id = Meteor.user()._id;
		var _x = Projects.find({
	        $and: [
	          { archived: false },
	          { usersApproved: _id }
	        ]
	    }).fetch();
	    var x = _x.map(function(p) {
	    	p.scope = 'approved';
	    	return p;
	    });

		var _y = Projects.find({
	        $and: [
	          { archived: false },
	          { ownerId: _id }
	        ]
	    }).fetch();
	    var y = _y.map(function(p) {
	    	p.scope = 'created';
	    	return p;
	    });

	    return x.concat(y);
	},
	archivedCamps: function() {
		var _id = Meteor.user()._id;
		var _x = Projects.find({
	        $and: [
	          { archived: true },
	          { usersApproved: _id }
	        ]
	    }).fetch();
	    var x = _x.map(function(p) {
	    	p.scope = 'approved';
	    	return p;
	    });

		var _y = Projects.find({
	        $and: [
	          { archived: true },
	          { ownerId: _id }
	        ]
	    }).fetch();
	    var y = _y.map(function(p) {
	    	p.scope = 'created';
	    	return p;
	    });

	    return x.concat(y);
	},
	isCreated: function() {
		if (this.scope==='created') return true;
		return false;
	},	
	account: function() {
		if (Meteor.user().account) return true;
		return false;
	},
	bank: function() {
		return Meteor.user()&&Meteor.user().bank||false;
	},
	bank_name: function() {
		return Meteor.user().bank.bank_name;
	},
	account_no: function() {
		return '********'+Meteor.user().bank.last4;
	},
	routing_no: function() {
		return Meteor.user().bank.routing_number;
	},
	messages: function() {
		/** 
			THIS METHOD IS COMPLETELY FUCKED
				- used to show each message
				- now it's one negotiations tab (set)

		  	IT SHOULD SHOW UNIQUE PROJ BY OFFERS, not messages
		  */
		var projects = Projects.find({
	        $and: [
	          {archived: false},
	          {ownerId: Meteor.user()._id}
	        ]
	    }).fetch().map(function(p) {
	    	return p._id;
	    });
		var messages = ProjectMessages.find({ 
			$or: [
				{ 
					user: Meteor.user()._id,
					archived: { $ne: true }
				} , 
				{ 
					project: { $in: projects },
					archived: { $ne: true }
				}
			] 
		}, { 
				sort: { createTimeActual: -1 } 
		}).fetch();

		var projs = messages.map(function(p) {
			return p.project;
		});

		var returnArr = [], duplicatesArr = [];

		for (var i = 0; i < messages.length; i++) {
			var m = messages[i];
			if (duplicatesArr.indexOf(m.project)===-1) {
				returnArr.unshift(m);
				duplicatesArr.push(m.project);
			};
		};

		return returnArr;
	},
	textify: function() {
		if (this.ownerName==='Open Source Hollywood'&&this.ownerId===Meteor.user()._id) {
			return '';
		};
		return this.text;
	},
	receiptsList: function() {
	    return Receipts.find({user: Meteor.user()._id}).fetch();
	},
	formatDate: function() {
	    return moment(this.created).format('MMMM Do YYYY, h:mm:ss a');
	},
	formatTitle: function() {
	    return this.projTitle||this.projectTitle||this.title||'undefined';
	},
	formatAmount: function() {
	    return '$' + this.amount.toFixed(2);
	},
	formatRefund: function() {
	    if (this.refunded) return 'REFUNDED';
	    if (this.error) return 'REFUND ERROR, CONTACT US';
	    return 'PAID';
	}
});

Template.dashboard.events({
	'click .gotoleaseview': function() {
		simulateClick(document.getElementById('view_lease_data'))
	},
	'click .gotobankconfig': function() {
		simulateClick(document.getElementById('view_bank_config_data'))
	},
	'click .gotosoldmerch': function() {
		simulateClick(document.getElementById('view_sold_merch'))
	},
	'click .showSubDetail': function(e) {
		console.log(this)
	},
	'click #add_account': function(e) {
		e.preventDefault();
		var opts = {};
		opts.country = $('#country').val();
		opts.currency = $('#currency').val();
		opts.account_holder_name = $('#account_holder_name').val();
		opts.account_holder_type = $('#account_holder_type').val();
		opts.routing_number = $('#routing_number').val();
		opts.account_number = $('#account_number').val();
		opts.default_for_currency = true;
		opts.object = 'bank_account';
		Meteor.call('updateBanking', opts, function(err, result) {
			console.log(err, result)
			if (err) return vex.dialog.alert('there was an error updating your account information, please try again later or contact us if you need assistance');
			return vex.dialog.alert(result||'account updated');
		});
	},
	'click .reset_transfer': function(e) {
		Meteor.call('deleteBanking');
	},
	'click .dash_show_subs': function(e) {
	    $('.dash_show_subs_el').hide()
	    $('.dash_show_subs').removeClass('bold')
	    $(e.target).addClass('bold')
	    var v= $(e.target).attr('val')
	    var id = '#' + v
	    $(id).show()
	},
	'click .dash_show_merchant': function(e) {
	    $('.merch_view_opts').hide()
	    $('.dash_show_merchant').removeClass('bold')
	    $(e.target).addClass('bold')
	    var v= $(e.target).attr('val')
	    var id = '#' + v
	    $(id).show()
	},
	'click .dash_show_camps': function(e) {
	    $('.camp_view_opts').hide()
	    $('.dash_show_camps').removeClass('bold')
	    $(e.target).addClass('bold')
	    var v= $(e.target).attr('val')
	    var id = '#' + v
	    $(id).show()
	},
	'click .dash_show_ks': function(e) {
	    $('.dash_ks').hide()
	    $('.dash_show_ks').removeClass('bold')
	    $(e.target).addClass('bold')
	    var v= $(e.target).attr('val')
	    var id = '#' + v
	    $(id).show()
	},
	'click .fulfill_gift': function(e) {
	    e.preventDefault();
	    var was = this
	    o={gift:this.order.gift}
	    var orderSummary = [
	      '<div class="row">',
	        '<div class="col-sm-7">',
	        this.order.gift.name,
	        '<br>Order Summary</div>',
	        '<div class="panel-body">',
	          '<table class="table"><thead><tr><th>Type</th><th>Quantity</th><th>Total</th></tr></thead><tbody>',
	          quantOrdersTable(this.order.order, o, this.order.gift.msrp),
	          '</tbody></table>',
	        '</div>',
	      '</div>'
	    ].join('')
	    orderSummary = orderSummary + [
	      '<div class="row">',
	        '<div class="col-sm-7">Shipping Details</div>',
	        '<div class="panel-body">',
	          '<table class="table"><tbody>',
	          '<tr><td>name</td><td>',this.order.name,'</td>',
	          '<tr><td>address</td><td>',this.order.address,'</td>',
	          '<tr><td>city</td><td>',this.order.city,'</td>',
	          '<tr><td>state, zip</td><td>',[this.order.state, this.order.zip].join(', '),'</td>',
	          '<tr><td>contact</td><td>',[this.order.email, this.order.phone].join('; '),'</td>',
	          '</tbody></table>',
	        '</div>',
	      '</div>'
	    ].join('')

	    var buttons = [
	        $.extend({}, vex.dialog.buttons.NO, { text: 'Close' })
	    ]

	    if (!was.fulfilled) {
	      buttons.unshift($.extend({}, vex.dialog.buttons.NO, { text: 'Mark as Fulfilled', className: 'aquamarineB', click: function($vexContent, event) {
	          this.value = 'fulfill';
	          this.close()
	      }}))
	    }

	    if (was.order&&Object.keys(was.order).length>5) {
	    	buttons.unshift($.extend({}, vex.dialog.buttons.NO, { text: 'Download', className: 'lemonB', click: function($vexContent, event) {
		        this.value = 'report';
		        this.close()
		    }}))
	    };

	    var user_name = this.user && this.user.name || '';
	    var user_avatar = this.user && this.user.avatar || '';
	    var vexOpen = true;
	    var _vex = vex.dialog.open({
	      title: 'Gift Fulfillment',
	      input: orderSummary,
	      buttons: buttons,
	      callback: function (data) {
	        if (!vexOpen) return;
	        vexOpen = false;
	          if (!data) {
	              return
	          }
	          
	          if (data==='fulfill') {
	            Meteor.call('markMerchFulfillment', was)
	          };

	          if (data==='report') {
	            ConvertToCSV(was)
	          };

	          _vex.close();
	      }
	    });
	},
	
})

Template.dashboard.onRendered(function(){
	/* Create the popover with Header Content and Footer */
	$('.popover-markup>[data-toggle="popover"]').popover({
	  html: true,
	  title: function() {
	    return $(this).parent().find('.head').html();
	  },
	  /********** 
	    In the content method, return a class 'popover-content1' wrapping the actual 'contents', 
	    concatenated with a class 'popover-footer' wrapping the footer.
	  ************/
	  content: function() {


	  	setTimeout(function() {
	  		$('.delSub').off()
	  		$('.delSub').on('click', function(e) {
	  			Meteor.call('cancelSubscription', JSON.parse($(e.target).attr('val')), function(err, res) {
	  				console.log(err, res)
	  				vex.dialog.alert(err||res||'there was an error, please contact us with ID #' + Meteor.user()._id)
	  			})
	  		})
	  	}, 1597)


	      return '<div class="popover-content1">' + $(this).parent().find('.content').html()||'- inactive -' +
	        '</div>';
	    }    
	});

	/**
	  Allow the popover to be closed by clicking anywhere outside it.
	**/
	$('body').on('click', function(e) {
	  $('.popover-markup>[data-toggle="popover"]').each(function() {
	    //the 'is' for buttons that trigger popups
	    //the 'has' for icons within a button that triggers a 
	    if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
	      $(this).popover('hide');
	    }
	  });
	});
})

Template.soldMerch.helpers({
	orderDate: function() {
		return moment(this.created).format("MMMM D, YYYY")
	},
	orderChannel: function() {
		if (this.slug.indexOf('personal')>-1) {
			return 'personal merch'
		};

		return this.purpose
	}
})

Template.soldMerch.events({
	'click .gotoleaseview': function() {
		simulateClick(document.getElementById('view_lease_data'))
	},
	'click .gotobankconfig': function() {
		simulateClick(document.getElementById('view_bank_config_data'))
	},
	'click .gotosoldmerch': function() {
		simulateClick(document.getElementById('view_sold_merch'))
	},
})