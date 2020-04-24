Template.settings.helpers({
	artist: function() {
		try {
		  if (Meteor.user().iamRoles.indexOf('producer')>-1||Meteor.user().iamRoles.indexOf('roles')>-1) {
		    return true
		  };
		} catch(e) {}
		return false
	},
	producer: function() {
		var user = Meteor.user()
		return user.iamRoles&&user.iamRoles.indexOf('producer')>-1||false
	},
	actor: function() {
		var user = Meteor.user()
		return user.iamRoles&&user.iamRoles.indexOf('roles')>-1||false
	},
	assets: function() {
		var user = Meteor.user()
		return user.iamRoles&&user.iamRoles.indexOf('assets')>-1||false
	},
	viewer: function() {
		var user = Meteor.user()
		return user.iamRoles&&user.iamRoles.indexOf('view')>-1||false
	},
	noUserEmail: function() {
	  if (Meteor.user()&&Meteor.user().notification_preferences&&Meteor.user().notification_preferences.email&&Meteor.user().notification_preferences.email.verification) {
	    return false
	  };

	  if (Meteor.user()&&Meteor.user().notification_preferences&&Meteor.user().notification_preferences.phone&&Meteor.user().notification_preferences.phone.verification) {
	    return false
	  };

	  return true
	},
	r_foo: function() {
		return JSON.stringify(this).replace(/"/g, '\"')
	},
	gifts: function() {
		return Session.get('gifts')
	},
	resources: function() {
		return Session.get('resources');
	},
	init: function() {
		Session.set('resources', resources)
		Session.set('gifts', gifts)
		Meteor.call('createBankingAccount');
		if (Meteor.user().iamRoles&&Meteor.user().iamRoles.indexOf('producer')>-1) $('#roundedTwo1').prop('checked', true)
		if (Meteor.user().iamRoles&&Meteor.user().iamRoles.indexOf('roles')>-1) $('#roundedTwo2').prop('checked', true)
		if (Meteor.user().iamRoles&&Meteor.user().iamRoles.indexOf('view')>-1) $('#roundedTwo3').prop('checked', true)
	},
	giftPurchases: function() {
		return Meteor.user().giftPurchases||[]
	},
	purchaseAMT: function() {
		return this.token.receipt.amount/100
	},
	purchaseStatus: function() {
		return this.status||'unfulfilled'
	},
	hasEmail: function() {
		return Meteor.user().email!==null
	},
	hasGifts: function() {
		return Meteor.user().gifts&&Meteor.user().gifts.length
	},
	userGifts: function() {
		return Meteor.user().gifts||[]
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
	isCreated: function() {
		if (this.scope==='created') return true;
		return false;
	},
	bio: function() {
		return Meteor.user().bio || 'describe yourself and your experiences'
	},
	first_name: function() {
		return Meteor.user().firstName || 'First name';
	},
	last_name: function() {
		return Meteor.user().lastName || 'Last name';
	},
	website: function() {
		return Meteor.user().website || 'enter http://www.your.site'
	},
	avatar: function() {
		return Meteor.user().avatar;
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
	emailConfig: function() {
		var configs = Meteor.user().notification_preferences  || {};
		var _email = configs.email || {};
		return _email.verification || false;
	},
	emailReverify: function() {
		var configs = Meteor.user().notification_preferences  || {};
		var _email = configs.email || {};
		if (_email.email&&_email.verification===false) {
			return true;
		};
		return false;
	},
	emailValue: function() {
		var configs = Meteor.user().notification_preferences  || {};
		var _email = configs.email || {};
		return _email.email || '';
	},
	emailConfigStatus: function() {
		var configs = Meteor.user().notification_preferences  || {};
		if (!configs.email) return 'N / A';
		var _email = configs.email || {};
		if (_email.verification) return 'verified';
		return 'not verified';
	},
	phoneConfig: function() {
		var configs = Meteor.user().notification_preferences  || {};
		var _phone = configs.phone || {};
		return _phone.verification || false
	},
	phoneReverify: function() {
		var configs = Meteor.user().notification_preferences  || {};
		var _phone = configs.phone || {};
		if (_phone.phone&&_phone.verification===false) {
			return true;
		};
		return false;
	},
	phoneValue: function() {
		var configs = Meteor.user().notification_preferences  || {};
		var _phone = configs.phone || {};
		return _phone.phone || '';
	},
	phoneConfigStatus: function() {
		var configs = Meteor.user().notification_preferences  || {};
		if (!configs.phone) return 'N / A';
		var _phone = configs.phone || {};
		if (_phone.verification) return 'verified';
		return 'not verified';
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
	}
});
