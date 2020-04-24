var connectHandler = WebApp.connectHandlers;
var Secrets = require('../secrets').auth0

Meteor.startup(function () {
	connectHandler.use(function (req, res, next) {
		res.setHeader('access-control-allow-origin', '*');
		res.setHeader("Set-Cookie", "HttpOnly;Secure;SameSite=Strict");
		return next();
	});

	ServiceConfiguration.configurations.remove({ service: 'auth0' });
	ServiceConfiguration.configurations.insert(Secrets);
})