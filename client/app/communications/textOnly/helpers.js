Template.commBox.helpers({
	uuid: function() {
		if (this.ownId === Meteor.user()._id) {
			return this.projId + '1';
		} else {
			return this.slug + '1';
		}
	}
});