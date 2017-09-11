Session.set('connectReady', false);
Meteor.startup(function(){
	$.getScript('//cdn.auth0.com/js/lock-9.0.min.js', function(){
		// script has loaded
		lock = new Auth0Lock('KC97k4Aq9IbWuNuC8YKzC4IxSPaJWtzB', 'aug2uag.auth0.com');
		Session.set('connectReady', true);
 	});
});