var was;

function getCurrentNegotiation() {
	var negotiatedRoles = was.project.negotiations || [];
	var negotiatedRole;
	for (var i = 0; i < negotiatedRoles.length; i++) {
		if (negotiatedRoles[i].id = was.user._id) {
			negotiatedRole = negotiatedRoles[i];
			break;
		};
	};
	return negotiatedRole || {};
}

Template.projectMessageOffer.helpers({
	optradio: function() {
		console.log(this)
		return this.details.uid + this.details.position;
	},
	myProject: function() {
		if (this.details.authorCounterOffer) return false
		return was.project.ownerId===Meteor.user()._id
	},
	stringyThis: function() {
		return JSON.stringify(this)
	},
	approveOrDenyButton: function() {
		if (!this.details.declined) return 'red';
		return 'green';
	},
	approveOrDenyButtonApplicant: function() {
		if (this.details.declined) return 'red';
		return 'green';
	},
	approveOrDenyButtonText: function() {
		if (!this.details.declined) return 'remove';
		return 'ok';
	},
	approveOrDenyButtonTextApplicant: function() {
		if (this.details.declined) return 'remove';
		return 'ok';
	},
	approveOrDenyTextDecoration: function() {
		if (!this.details.declined) return 'none';
		return 'line-through';
	},
	approveOrDenyButtonTextReadable: function() {
		if (!this.details.declined) return 'decline';
		return 'approve';
	},
	approveOrDenyButtonTextReadableApplicant: function() {
		if (this.details.declined) return 'declined';
		return 'not declined';
	},
	isEditable: function() {
		var currentNegotiation = getCurrentNegotiation();
		return !currentNegotiation.authorVerified&&!currentNegotiation.applicantVerified&&Meteor.user()._id===was.project.ownerId;
	},
	considerationType: function() {
		var position = this.details.offer.appliedFor
		if (this.details.authorCounterOffer) {
			return 'agreement is for the following positions: ' + position
		} else if (this.details.ctx==='crew') {
			if (this.details.type==='hired'&&this.details.pay>0) {
				return 'requesting pay for crew position: ' + position;
			} else {
				return 'requesting no pay for crew position: ' + position;
			}
		} else {
			if (this.details.type==='hired'&&this.details.pay>0) {
				return 'requesting pay for cast position: ' + position;
			} else {
				return 'requesting no pay for cast position: ' + position;
			}
		}
	},
	considerationItself: function() {
		var amount = this.details.offer.amount, pay = this.details.offer.pay, type = this.details.offer.type;

		if (this.details.offer.authorCounterOffer) {
			var returnMsg = 'pay of $' + this.details.offer.pay;
			if (this.details.offer.equity > 0) {
				returnMsg += ' and equity of ' + this.details.offer.equity + ' shares'
			};
			if (this.details.offer.customTerms) {
				returnMsg += '; additional terms: ' + this.details.offer.customTerms
			};
			if (this.details.offer.customLimits) {
				returnMsg += '; further limitations: ' + this.details.offer.customLimits
			};
			return returnMsg
		};

		if (amount===0&&pay===0) {
			return 'time donation offer';
		} else {
			var amount = this.details.offer.amount===undefined ? 0 : this.details.offer.amount ? this.details.offer.amount: 0
			var pay = this.details.offer.pay===undefined ? 0 : this.details.offer.pay ? this.details.offer.pay: 0
			if (amount>0&&type==='hired') {
				return 'requesting $' + amount;
			} else {
				return 'offering a donation of $' + pay;
			}
		}
	}
})