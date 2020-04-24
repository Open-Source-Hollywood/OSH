Template.config.events = {
	'click #submit': function(e) {
		e.preventDefault();
		console.log('config')
		$('#preloader').show()
		Meteor.call('userConfig', {
			roles: $('.user_roles:checked').map(function(){return $(this).val()}).get(),
			email: $('#email').val(),
			phone: $('#phone').val()
		}, function(err, res) {
			$('#preloader').hide()
			if (err) return vex.dialog(err)
			vex.dialog.confirm({
				message: 'Would you like to update your profile?',
				callback: function(data) {
					if (data) {
						Router.go('MyProfile')
					} else {
						Router.go('Home')
					}
				}
			})
		})
	}
}