Template.newevent.events({
  // Pressing Ctrl+Enter should submit the form.
  'click #create_event': function(event, t) {
	var title = $('#title').val()
	var address = $('#address').val()
	var directions = $('#directions').val()
	var contact = $('#contact').val()
	console.log(title, address, directions, contact)
	if(!title|| !address|| !directions|| !contact) {
		return vex.dialog.alert('please fill out all fields to proceed');
	} else {
		Meteor.call('addEvent', {
			title: title,
			address: address,
			directions: directions,
			contact: contact,
		}, function(err, msg) {
  			vex.dialog.alert(err||msg);
  		});
	}
  },
});
