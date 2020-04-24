Template.assetsOfferDialog.onRendered(function() {
	setTimeout(function() {
		$('.calendar').flatpickr();
	
		$('.clock').flatpickr(
		{
			enableTime: true,
			noCalendar: true,

			enableSeconds: false, // disabled by default

			time_24hr: false, // AM/PM time picker is used by default

			// default format
			dateFormat: "H:i", 

			// initial values for time. don't use these to preload a date
			defaultHour: 12,
			defaultMinute: 0

			// Preload time with defaultDate instead:
			// defaultDate: "3:30"
		});
	}, 987)
})


Template.assetsOfferDialog.helpers({
	notPendingNotOffereeDecision: function() {
		try {
			var isOffereeDeciding = this.offer.offereeDecision||false
			return !isOffereeDeciding
		} catch(e) {
			return true
		}
	},
	firstAction: function() {
		this.offer = this.offer||this.offers[0]
		return !(this.offer.offereeDecision||false)
	},
	formattedOfferorAssetNames: function() {
		return this.offer.assets.map(function(a){ return a.name}).join(', ')
	},
	totalOfferorHours: function() {
		return this.offer.consideration.hours + this.offer.consideration.remHours
	},
	totalOfferorDays: function() {
		return this.offer.consideration.days + this.offer.consideration.remDays
	},
	totalOfferorWeeks: function() {
		return this.offer.consideration.weeks
	},
	offerorOfferAmount: function() {
		if (this.offer.receipt) {
			return '$' + (this.offer.receipt.amount/100)
		};
		return '$0'
	},
	offerorPanel: function() {
		console.log('offerorPanel')
		console.log(this)
	},
	eoEditable: function() {
		return this.offer.pending||false
	},
	init: function() {
		// Session.set('offereeDecision', this.offereeDecision||false)
	},
	expressOffer: function() {
		var expressOffer = this.expressOffer || this.offer.expressOffer || {}
		console.log(expressOffer)
		if (expressOffer.offer) {
			var expiration = this.expirationDate || this.offer.expirationDate || null
			if (expiration) {
				if (expiration < new Date()) return null
			}

			return expressOffer
		}

		return false
	},
	offereeOption: function() {
		console.log(this)
	},
	pendingDetails: function() {
		var msg = ''
		if (this.offer.receipt) {
			msg = ['You have $', (this.offer.receipt.amount/100), ' in escrow.'].join('')
		} else {
			'The other party is contemplating your offer.'
		}

		return msg
	},
	stringify: function() {
		return JSON.stringify(this)
	},
	timeDefined: function() {
		var timeDefined = this.schedule ? true:false
		return timeDefined
	},
	isOfferee: function() {
		console.log(this)
		if (this.offer.pending===false) return false;
		if (Meteor.user()._id===this.offer.offeree) return true;
		return false
	},
	formattedPricing: function() {
		var p = this.pricing
		var a = []
		for (var k in p) {
			if (p[k]) {
				a.push(['$', p[k], ' ', k].join(''))
			}
		}
		return a
	},
	formattedAvailability: function() {
		var normalized = {
			any: 'anytime',
			'any-weekdays': 'anytime weekdays',
			am: 'mornings weekdays',
			pm: 'evening weekdays',
			'any-weekends': 'anytime weekends',
			'am-wk': 'mornings weekends',
			'pm-wk': 'evenings weekends'
		}
		return this.availability.map(function(a) {
			return normalized[a]
		})
	},
	messages: function() {
		return this.offer.messages||[]
	}
})