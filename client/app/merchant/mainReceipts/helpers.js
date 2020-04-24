Template.main_receipts.helpers({
	foo: function() {
		console.log(this)
	},
	formatDate: function() {
		return moment(this.created).format('MMMM Do, YYYY')
	},
	formatTitle: function() {
		var leading = [this.purpose, 'for'].join(' ')

		if (this.slug.indexOf('personal')>-1) {
			try {
				return this.order.message.replace(this.name, '')
			} catch(e) {
				return 'personal merch purchase'
			}
		};

		if (this.purpose==='apply') leading = 'application donation for ';

		if (this.type==='credit'&&this.purpose==='donation') {
			return ['you received a donation from', this.name, 'for', this.title].join(' ')
		};

		return [leading, this.title].join(' ')
	},
	formatAmount: function() {
		return this.amount
	},
	formatStatus: function() {
		if (this.accepted) {
			if (this.receipt) return 'approved role (debited)';
			return 'approved role (credited)'
		};

		if (this.refund) {
			if (!this.receipt) {
				if (this.rejected) return 'rejected';
				return 'revoked';
			}
			var m = this.rejected ? 'rejected' : this.revoked ? 'revoked' : ''
			return ['refunded (', m, ')'].join('')
		};

		if (this.type==='credit'&&this.purpose==='donation') {
			return 'donation'
		};

		if (this.purpose==='apply') {
			if (this.pending) return 'pending decision';
			return 'donation for role'
		};

		return 'charge'
	},
	formatLink: function() {
		if (this.refund||this.accepted) return ''
		return ['/transaction/',this._id].join('')
	},
	formatLinkTitle: function() {
		if (this.refund||this.accepted) return ''
		if (this.linkTitle) return this.linkTitle;
		// escape receipts not intended to show details
		if (this.pending===false) return null
		return 'view details'
	},
})