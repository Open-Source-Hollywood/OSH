Session.set('connectReady', false);
Meteor.startup(function(){
	$.getScript('//cdn.auth0.com/js/lock-9.0.min.js', function(){
		// script has loaded
		lock = new Auth0Lock('KC97k4Aq9IbWuNuC8YKzC4IxSPaJWtzB', 'aug2uag.auth0.com');
		Session.set('connectReady', true);
		document.addEventListener('keypress', function(e) {
		  if (e.keyCode == 27) lock.hide();
		}, false);

 	});
});

document.addEventListener("DOMContentLoaded", function() {
  Session.set('connectReady', false);
});

window.addEventListener("unload", function() {
  Session.set('connectReady', false);
});

Session.set('foo', 123);