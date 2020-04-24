Template.commBox.events({
	'click .submit-message-dash': function() {
		var __id;
		if (Meteor.user()._id === this.ownId) {
			__id = this.projId;
		} else {
			__id = this.slug;	
		} 
		var _id = __id;
		__id = '#' + __id + '1';
		_id = '#' + this.slug + '_' + this.id;
		var _type = $(_id).attr('val');
		var _uid = $(_id).attr('usr');
		_uid = _uid || Meteor.user()._id;
		var _text = $(__id).val();
		Meteor.call('addCommunicationsMessage', this.slug, _type, _text, _uid);
		$(__id).val('');
	}
})