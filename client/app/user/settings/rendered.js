Template.settings.onRendered(function() {
    setTimeout(function() { 
    	$('#gotoemailpref').removeClass('animated'); 
    }, 2499);
})

Template.settings.rendered = function () {
	gifts = [], resources = [], reels = [], social = [];
	// console.log(new Array(1000).join('# '))
	var u = Meteor.user()
	// console.log(JSON.stringify(u, null, 4))

	var iamRoles = u.iamRoles
	if (iamRoles.indexOf('producer')>-1) $('#iamproducer').prop('checked', true)
	if (iamRoles.indexOf('roles')>-1) $('#iamroles').prop('checked', true)	
	if (iamRoles.indexOf('view')>-1) $('#iamviewer').prop('checked', true)

	resources = u.assets||[]
	Session.set('resources', resources);
	
	gifts = u.gifts||[]
	Session.set('gifts', gifts);
	if (gifts.length) $('#merchtabletoggle').show();

	social = []
	u.social.forEach(appendSocialToTable)
	Session.set('social', social);

	reels = u.reels||[]
	Session.set('reels', reels);

	if ($(window).width()<580) {
	  	setTimeout(function() {
	  		$($( ".tabs-select" )[1]).prepend('<i id="crazed_foo" class="fa fa-chevron-down fa-2x" style="position:absolute;pointer-events:none;"></i>');
	  	}, 610);
	}

	$(".iam").each(function(){
		var val = $(this).attr('value');
		if (u.iam.indexOf(val) > -1) {
		  $(this).prop("checked", true);
		}
	});

	$(".interests").each(function(){
		var val = $(this).attr('value');
		if (u.interests.indexOf(val) > -1) {
		  $(this).prop("checked", true);
		}
	});

	// set primaryRole
	if (u.primaryRole) {
		var val = u.primaryRole;
		$("#category").val(val);
	};

	// set user-role
	u.iam.forEach(function(el) {
		var elId = '#checkbox-' + el;
		$(elId).prop("checked", true);
	});

	var wbs = u.website && u.website.length > 0 ? u.website : 'enter http://www.your.site';
	$('#website').attr('placeholder', wbs);

	initSummernote(function(){})

};