Template.offerAssetsActive.helpers({
	offerAssets: function() {
		console.log(this)
		this.offer = this.offer||this.offers[0]

		return this.offer.assets
	},
	foo: function() {
		console.log(this)
	}
})