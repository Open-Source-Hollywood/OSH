Template.projectMessage.helpers({
	zoo: function() { console.log(this) },
	refundAmount: function() {
		try { return this.refund[0].amount/100 } catch(e) { return ' - '}
	},
	isAssets: function() {

		if (this.isAssets) return true
		if (this.offers&&this.offers[0]&&this.offers[0].type==='assets') return true
		if (this.offer&&this.offer.type==='assets') return true

		return false
	},
	rejected: function() {
		// Router.go('Dashboard')
	},
	init: function() {
		was = this
	},
	archivedOffer: function() {
		// case active asset negotiate
		try {	
			if (this.offers[0].accepted||this.offers[0].rejected) return true;
			if (this.isAssets&&this.offer&&this.offer.pending) return false
			if (this.offers[0]&&this.offers[0].pending) return false
			// case active role negotiate
			if (this.offer&&this.offer.pending) return false
		} catch(e) {}

		return true
	},
	formattedOffers: function() {
		return this.offers.map(function(o) {
			if (!o.ctx||o.ctx!=='offer') return o;
		}).filter(function(o) { if (o) return o })
	},
	url: function() {
		if (this.audition==='N/A') {
			return ' this role does not have an audition ';
		} else if (this.url) {
			return this.url;
		} else {
			return ' applicant enter URL of audition material ';
		}
	},
	isDisabled: function() {
		if (this.audition==='N/A'||was.project.ownerId===Meteor.user()._id||this.url) {
			return 'pointer-events:none;'
		};
	},
	hasOffer: function() {
		return this.offers.length > 0
	},
	needsApplicantAction: function() {
		try {
			var o = this.offers[0]
			if (o.needsApplicantAction&&Meteor.user()._id!==was.project.ownerId) return true;
			else return false
		} catch(e) {
			return false
		}
	},
	ownerInitAgreement: function() {
		for (var i = this.offers.length - 1; i >= 0; i--) {
			var o = this.offers[i]
			if (o.needsApplicantAction) return false
		}
		if (Meteor.user()._id===was.project.ownerId) return true
	},
	ownerInitAgreementAplicantNote: function() {
		for (var i = this.offers.length - 1; i >= 0; i--) {
			var o = this.offers[i]
			if (o.needsApplicantAction) return false
		}
		if (Meteor.user()._id!==was.project.ownerId) return true
	},
	applicantRequestCounter: function() {
		var currentNegotiation = getCurrentNegotiation();
		return currentNegotiation.authorVerified&&!currentNegotiation.applicantVerified&&Meteor.user()._id!==was.project.ownerId;
	},
	applicantInCounter: function() {
		if (Meteor.user()._id!==was.project.ownerId) return false
		for (var i = this.offers.length - 1; i >= 0; i--) {
			var o = this.offers[i]
			if (o.needsApplicantAction) return true
		}
		return false
	},
	sharesAvailable: function() {
		var percent = (this.project.totalShares || 0) / 100;
    	return (100 - percent) * 100;
	},
	auditions: function() {
		var agg = [];
		var positions = was.project.cast.concat(was.project.crew);
		for (var i = 0; i < was.offers.length; i++) {
			var offer = was.offers[i]
			var _position = offer.offer.position
			// console.log(offer)
			// console.log('^^^ OFFER  VVV POSIITON')
			for (var j = 0; j < positions.length; j++) {
				var position = positions[j];
				var _role = position.title||position.role
				// console.log(position)
				if (_position===_role) {
					if (position.audition&&position.audition!=='N/A') agg.push({
						title: _role,
						audition: position.audition,
						url: offer.url,
						offer: offer.offer
					});
				};
			};
		};
		return agg;
	},
	isProjectOwner: function() {
		return this.project.ownerId === Meteor.user()._id;
	},
	userName: function() {
		try { return this.user.firstName + ' ' + this.user.lastName; } catch(e) { return '' }
	},
	title: function() {
		return this.title;
	},
	messages: function() {
		var messages = ProjectMessages.find({user: this.user._id, project: this.project._id}, {sort: {createTimeActual: -1}});
		return messages;
	},
	messagesHeader: function() {
		if (!this.offers.length) return 'There have been no actions made by this user for the ' + this.project.title + ' campaign.';
		if (this.offers.length===1) return 'There is one action this user has taken.';
		return 'There are ' + this.offers.length + ' offers regarding the ' + this.project.title + ' campaign.';
	},
	numMessages: function() {
		if (!this.messages.length) return 'There is no history of communication between the two of you regarding the ' + this.project.title + ' campaign.';
		if (this.messages.length===1) return 'There is only one message.';
		return 'There are ' + this.messages.length + ' messages regarding the ' + this.project.title + ' campaign.';
	},
	negotiationRoles: function() {
		var value = negotiationHelper('negotiationRoles');
		if (value) return value;
		var roles = formattedProjectRoles();
		return 'This contract is valid for the following roles: ' + roles + '.';
	},
	negotiationTerms: function() {
		var value = negotiationHelper('negotiationTerms');
		if (value) return value;
		var roles = formattedProjectRoles();
		return 'This contract is valid for all expected performance and conditions relating to the roles: ' + roles + '.\n\nCampaign author promises to make best efforts to create campaign, and applicant promises to perform the roles outlined in this agreement.';
	},
	negotiationDamages: function() {
		var value = negotiationHelper('negotiationDamages');
		if (value) return value;
		return 'Breaching party is responsible for paying any legal fees resulting from breach of non-performance. All disputes will be handled in the State of California, and this contract is bound to California laws and regulations.';
	},
	negotiationFinancial: function() {
		var value = negotiationHelper('financials');
		if (value) return value;
		return '0';
	},
	negotiationEquities: function() {
		var value = negotiationHelper('equities');
		if (value) return value;
		return '0';
	},
	roleConsideration: function() {
		try {
			if (this.offers[0].receipts.length) {
				if (this.offers[0].purpose === 'apply') {
					return true
				};
			};
			
		} catch(e){}
		return false
	},
	isHired: function() {
		try {
			if (this.offers[0].offer.type==='hired') return true;
		} catch(e) {} finally { 
			return false
		}
	}
})
