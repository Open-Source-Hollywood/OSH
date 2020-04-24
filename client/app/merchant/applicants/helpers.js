function iAmOfferee(offereeId) {
	if (Meteor.user()._id===offereeId) return true;
	return false
}


Template.applicantsContracts.helpers({
	foo: function() {
		console.log(this)
	},
	castCrew: function() {
		var agg = []
		this.projects.forEach(function(p) {
			if (p.castApplicants&&p.castApplicants.length) {
				p.castApplicants.forEach(function(c) { 
					c.projectId = p.id
					c.slug = p.slug
					c.title = p.title
				})
				agg = agg.concat(p.castApplicants)
			};
			if (p.crewApplicants&&p.crewApplicants.length) {
				p.crewApplicants.forEach(function(c) { 
					c.projectId = p.id
					c.slug = p.slug
					c.title = p.title
				})
				agg = agg.concat(p.crewApplicants)
			};
		})
		return agg
	},
	roleSummary: function() {
		return [this.message, 'for role:', this.appliedFor].join(' ')
	},
	thisString: function() {
		return JSON.stringify(this)
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
})