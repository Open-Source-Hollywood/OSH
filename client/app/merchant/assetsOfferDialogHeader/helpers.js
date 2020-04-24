Template.assetsOfferDialogHeader.helpers({
	cat: function() {
		try {
			this.offer = this.offer || this.offers[0]
			return this.offer.assets[0].category
		} catch(e) {
			Router.go('Home')
		}
	},
})