Template.offerAssetsArchived.helpers({
	offerAssets: function() {		
		this.offer = this.offer||this.offers[0]
		this.consideration = this.offer.consideration
		Session.set('consideration', this.consideration)

		return this.offer.assets
	},
	consideration: function() {
		return Session.get('consideration')
	},
	considerationTotalHours: function() {
		return this.consideration.hours + this.consideration.remHours
	},
	considerationTotalDays: function() {
		return this.consideration.days + this.consideration.remDays
	},
	considerationTotalWeeks: function() {
		return this.consideration.weeks
	},
	considerationDateStart: function() {
		return this.consideration.startDate&&moment(this.consideration.startDate).format('MMMM Do, YYYY')||'N / A'
	},
	considerationDateEnd: function() {
		return this.consideration.endDate&&moment(this.consideration.endDate).format('MMMM Do, YYYY')||'N / A'
	},
	considerationContact: function() {
		this.consideration.offereeContact = this.consideration.offereeContact || {}
		this.consideration.offereeContact.email = this.consideration.offereeContact.email || 'N / A'
		this.consideration.offereeContact.phone = this.consideration.offereeContact.phone || 'N / A'
		return this.consideration.offereeContact
	},
	considerationSummary: function() {
		if (this.consideration.receipt) {
			return ['$', (this.consideration.receipt.amount/100), ' paid towards this request.'].join('')
		} 
		return 'There was no money paid towards this offer.'
	}
})
