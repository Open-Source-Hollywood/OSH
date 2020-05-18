var gifts = [], resources = [], reels = [], social = [];
var didNotifyAboutAddedMerch = false
var didNotifyAboutAddedResource = false
var osettings = {giftImage: {}, avatar: {}};

resetEnv = function() {
  gifts = [], resources = [], reels = [], social = []
  didNotifyAboutAddedMerch = false
  didNotifyAboutAddedResource = false
  osettings = {giftImage: {}, avatar: {}}
}

appendPersonalMerchTable = function (o) {
	if (!didNotifyAboutAddedMerch) {
		didNotifyAboutAddedMerch = true
		$('body').position().top += 100
	};

	gifts.push(o)
	Session.set('gifts', gifts)
	saveSettings();

	$('.deleteRow').off()
	$('.deleteRow').on('click', deleteRow);
	$('#merchtabletoggle').show()

	vex.dialog.alert('your personal merchandise was added')
}

appendResourceToTable = function (o) {
	if (!didNotifyAboutAddedResource) {
		didNotifyAboutAddedResource = true
		$('body').position().top += 100
	};

	$('#assets-table-toggle').show()
	$('#needs-table').append([
		'<tr class="needs-val">',
			'<td>'+(o.category||'N/A')+'</td>',
			'<td>'+(o.name||'N/A')+'</td>',
			'<td>'+(o.description||'N/A')+'</td>',
			'<td><button val="resource" class="deleteRow button special small right">X</button></td>',
		'</tr>'].join(''));
	$('.deleteRow').off()
	$('.deleteRow').on('click', deleteRow);
	$("#needs-category").val($("#needs-category option:first").val()), $('#needs-description').val('');

	resources.push(o)
	Session.set('resources', resources)
	saveSettings();

	vex.dialog.alert('resource added')
}

appendSocialToTable = function (o, set) {
	social.push(o)
	Session.set('social', social);
	$('#social-table-toggle').show()
	$('#social-table').append('<tr class="social-val"><td>'+o.name+'</td><td>'+o.address+'</td><td><button val="social" class="deleteRow button small special">X</button></td></tr>');
	$('.deleteRow').off()
	$('.deleteRow').on('click', deleteRow);
	$('#social-title').val(''), $('#social-url').val('');
}

appendMediaURLtoTable = function (o, set) {
	if (!o.url) return;
	reels.push(o)
	Session.set('reels', reels);
	$('.deleteRow').off().on('click', deleteRow);
	$('#reel-name').val('');
	$('#reel-url').val('');
}

deleteRow = function (e) {
	e.preventDefault();
	var ctx = $(e.target).attr('val')
	if (ctx) {
	  try {

	    if (ctx==='resource') {
	      resources.splice(idx, 1);
	    };

	    if (ctx==='reel') {
	      reels.splice(idx, 1);
	    };

	    if (ctx==='social') {
	      social.splice(idx, 1);
	    };
	  } catch(e) {}
	};

	$(e.target).closest('tr').remove();
}

removeGift = function (e) {
  e.preventDefault();
  var idx = $($(this).closest('tr')).index();
  gifts.splice(idx, 1);
  $(this).closest('tr').remove();
}

phoneVerifyVexCB = function (data) {
	// vex.closeAll();
    if (data) {
    	$('osh_loader').show();
        Meteor.call('verifyPhonePIN', data.pin, function(err, msg) {
        	$('osh_loader').hide();
        	vex.dialog.alert(msg);
        });
    }
}

phoneVerifyVex = function () {
	vex.dialog.open({
	    message: 'VERIFY PHONE NUMBER',
	    input: [
	        '<input type="text" value="Enter 4 digit PIN to verify:" readonly/>',
	        '<input name="pin" type="number" placeholder="XXXX" required />'
	    ].join(''),
	    buttons: [
	        $.extend({}, vex.dialog.buttons.YES, { text: 'PROCEED' }),
	        $.extend({}, vex.dialog.buttons.NO, { text: 'Cancel' })
	    ],
	    callback: function (data) {
	    	return phoneVerifyVexCB(data);
	    }
	});
}

saveSettings = function (o) {
	/**
		firstname
		lastname
		bio
		category -- primaryRole
		user-role -- checkboxes //array
		needs-val  == table //array
		social-val  == table //array
		reel-val  == table //array

	*/
	console.log('saveSettings')
	var osettings = getOSettings()
	o = o || {};
	o.firstName = $('#first_name').val();
	o.lastName = $('#last_name').val();
	var descriptionText = $('#summernote').summernote('code').replace(/(<script.*?<\/script>)/g, '');
  	var plainText = $("#summernote").summernote('code')
        .replace(/<\/p>/gi, " ")
        .replace(/<br\/?>/gi, " ")
        .replace(/<\/?[^>]+(>|$)/g, "")
        .replace(/&nbsp;|<br>/g, " ")
        .trim();
	if (plainText&&plainText.indexOf('use the menu above')===-1) {
		o.bio = descriptionText;
		o.bio_plaintext = plainText;
	} else {
		o.bio = '';
	};
	o.primaryRole = $('#category').find(":selected").text();
	if (o.primaryRole.toLowerCase().indexOf('primary')>-1) delete o['primaryRole'];
	o.iam = [];
	o.assets = resources||[];
	o.social = social||[];
	o.reels = reels||[];
	o.gifts = gifts||[];

	o.avatar = osettings.avatar;
	if ($('#website').val().trim()&&$('#website').val()!=='enter http://www.your.site') o.website = $('#website').val();

	var userRoles = $('.user-role');
	userRoles.each(function(idx, el) {
		if ($(el).prop('checked')) o.iam.push($(el).attr('name'));
	});

	o.iamRoles= $('.user_roles:checked').map(function(){return $(this).val()}).get()
	setOSettings(osettings)
	// console.log('upgradeProfile with')
	// console.log(o)
	Meteor.call('upgradeProfile', o);
}