Template.footer.events({
	'click #subscribe': function(e) {
		e.preventDefault();
		var email = $('#email').val();
		if (email) {
		  Session.set('subscriptionEmail', email);
		  Meteor.call("subscribeEmail", email);
		  $('#email').val('');
		  vex.dialog.alert('Thank you for subscribing!');
		}
	}
})