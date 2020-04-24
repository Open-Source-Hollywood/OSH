var gifts = [], resources = [], reels = [], social = [];
var didNotifyAboutAddedMerch = false
var didNotifyAboutAddedResource = false
var osettings = {giftImage: {}, avatar: {}};


function videoURLValidation(url) {
	var vimeo = /^https:\/\/vimeo.com\/[\d]{8,}$/;
	var youtube = /^https:\/\/youtu.be\/[A-z0-9]{9,}$/;
	if (!vimeo.test(url)&&!youtube.test(url)) return url;
	if (url.indexOf('vimeo')>-1) {
		var patternMatch = /^https:\/\/vimeo.com\/([\d]{8,}$)/;
		var videoID = url.match(patternMatch)[1];
		return 'https://player.vimeo.com/video/' + videoID + '?autoplay=0&loop=1&autopause=0';
	} else {
		var patternMatch = /^https:\/\/youtu.be\/([A-z0-9]{9,}$)/;
		var videoID = url.match(patternMatch)[1];
		return 'https://www.youtube.com/embed/' + videoID;
	}
}

function appendPersonalMerchTable(o) {
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
};

function appendResourceToTable(o) {
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

function appendSocialToTable(o, set) {
	social.push(o)
	Session.set('social', social);
	$('#social-table-toggle').show()
	$('#social-table').append('<tr class="social-val"><td>'+o.name+'</td><td>'+o.address+'</td><td><button val="social" class="deleteRow button small special">X</button></td></tr>');
	$('.deleteRow').off()
	$('.deleteRow').on('click', deleteRow);
	$('#social-title').val(''), $('#social-url').val('');
}

function appendMediaURLtoTable(o, set) {
	if (!o.url) return;
	reels.push(o)
	Session.set('reels', reels);
	$('#reel-table-toggle').show()
	$('#reel-table').append([
	  	'<tr class="krown-pricing-title reel-val">',
	  		'<td><div class="krown-column-container">',
	  			o.name?'<small>'+o.name+'</small><br>':'',
	  			o.url,
	  			'</div><div class="krown-pie">',
	  			'<button val="reel" class="right deleteRow button special small">X</button>',
	  		'</div></td>',
	  	'</tr>'
	  ].join(''));
	$('.deleteRow').off()
	$('.deleteRow').on('click', deleteRow);
	$('#reel-name').val('');
	$('#reel-url').val('');
}

function validateUrl(url) {
	return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(url);
}

function deleteRow(e) {
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

function removeGift(e) {
  e.preventDefault();
  var idx = $($(this).closest('tr')).index();
  gifts.splice(idx, 1);
  $(this).closest('tr').remove();
}

function isURL(str) {
  var pattern = new RegExp('^(https?):\\/\\/[^ "]+$','i');
  return pattern.test(str);
}

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

function phoneVerifyVexCB(data) {
	// vex.closeAll();
    if (data) {
    	$('osh_loader').show();
        Meteor.call('verifyPhonePIN', data.pin, function(err, msg) {
        	$('osh_loader').hide();
        	vex.dialog.alert(msg);
        });
    }
}

function phoneVerifyVex() {
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

function saveSettings(o) {
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
	if (plainText&&plainText.indexOf('https://en.wikipedia.org/wiki/Template:Biography')===-1) {
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

	// console.log('upgradeProfile with')
	// console.log(o)
	Meteor.call('upgradeProfile', o);
}

Template.settings.onRendered(function() {
    setTimeout(function() {
      var script = document.createElement('script');
      script.src = "/js/scripts.min.js";
      document.head.appendChild(script);
    }, 987);
    setTimeout(function() { 
    	$('#gotoemailpref').removeClass('animated'); 
    }, 2499);
})

Template.settings.events({
	'click .res_show_setting': function(e) {
	    $('.settings_view_toggle').hide()
	    $('.res_show_setting').removeClass('bold')
	    $(e.target).addClass('bold')
	    var v= $(e.target).attr('val')
	    var id = '#' + v
	    $(id).show()
	},
	'click .res_show_opt': function(e) {
	    $('.res_opt_set').hide()
	    $('.res_show_opt').removeClass('bold')
	    $(e.target).addClass('bold')
	    var v= $(e.target).attr('val')
	    var id = '#' + v
	    $(id).show()
	},
	'click #gotoemailpref': function(e) {
		e.preventDefault();
		$('#not1').click();
		$('#not2').click();
	},
	'click #remove_phone_notify': function(e) {
		Meteor.call('removeNotificationRT', 'phone', function(err, msg) {
			vex.dialog.alert(msg);
		});
	},
	'click #remove_email_notify': function(e) {
		Meteor.call('removeNotificationRT', 'email', function(err, msg) {
			vex.dialog.alert(msg);
		});
	},
	'click #set-notifications': function(e) {
		e.preventDefault();
		/**
			read & send email val, phone val
			read & send checked preferences
		  */

		var o = {
			email: $('#email_notify').val(),
			phone: $('#phone_notify').val(),
			donations: $('#checkbox-Donations').prop('checked') ? true : false,
			applications: $('#checkbox-Applications').prop('checked') ? true : false,
			summaries: $('#checkbox-Donations').prop('checked') ? true : false
		}

		Meteor.call('setNotificationPreferences', o, function(err, result) {
			if (result) {
				if (result.indexOf('verification code')>-1) {
					/** show modal with verification code input */
					vex.dialog.open({
					    message: result,
					    input: [
					        '<input type="text" value="Enter 4 digit PIN to verify:" readonly/>',
					        '<input name="pin" type="number" placeholder="XXXX" required />'
					    ].join(''),
					    buttons: [
					        $.extend({}, vex.dialog.buttons.YES, { text: 'PROCEED' }),
					        $.extend({}, vex.dialog.buttons.NO, { text: 'Cancel' })
					    ],
					    callback: function (data) {
					        if (!data) {
					            console.log('Cancelled')
					        } else {
					        	vex.closeAll();
					        	$('osh_loader').show();
				                Meteor.call('verifyPhonePIN', data.pin, function(err, msg) {
				                	$('osh_loader').hide();
				                	vex.dialog.alert(msg);
				                });
					        }
					    }
					});
				} else {
					vex.dialog.alert(result);
				}
			};
		});
	},
	'click #resend_email_notify': function(e) {
		/** resend email verification */
		Meteor.call('resendVerification', 'email', function(err, msg) {
			vex.dialog.alert(msg);
		});
	},
	'click #resend_phone_notify': function(e) {
		/** resend phone verification */
		Meteor.call('resendVerification', 'phone', phoneVerifyVex);
	},
	'click #avatar_init': function(e) {
		e.preventDefault();
		$('#avatar_file').click();
	},
	'click #file_gift': function(e) {
	    $('#gift_file').click();
	},
	'change #gift_file': function (e, template) {
		if (e.currentTarget.files && e.currentTarget.files[0]) {
			osettings.giftImage = {};
			var reader = new FileReader();
			var files = e.target.files;
			var file = files[0];
			if (file.type.indexOf("image")==-1) {
			  vex.dialog.alert('Invalid File, you can only upload a static image for your profile picture');
			  return;
			};
			reader.onload = function(readerEvt) {
			    osettings.giftImage.data = readerEvt.target.result;
			    $('#merch_thumbnail').attr('src', osettings.giftImage.data);
			    $('#merch_thumbnail').show();
			    $('#gift_file_name').text(file.name)
			    $('#hidden_gift_name').show()
			}; 
			reader.readAsDataURL(file);
		}
	},
	'click .save_settings': function(e) {
		e.preventDefault();
		saveSettings({showDialog:true});
	},
	'change #avatar_file': function (e, template) {
	    if (e.currentTarget.files && e.currentTarget.files[0]) {
	    	osettings.avatar = {};
	    	var reader = new FileReader();
	    	var files = e.target.files;
		    var file = files[0];
		    if (file.type.indexOf("image")==-1) {
		    	vex.dialog.alert('Invalid File, you can only upload a static image for your profile picture');
		    	return;
		    };
		    reader.onload = function(readerEvt) {
	            osettings.avatar.data = readerEvt.target.result;
	            $('#image_avatar').attr('src', readerEvt.target.result);
		        var _url = "url(" + readerEvt.target.result + ")";
		        $('.logo').css("background-image", _url);
	        }; 
    		reader.readAsDataURL(file);
	  	}
	},
	'click #add-needs': function(e) { 
	      e.preventDefault();
	      
	      var o = {
	      	category: $('#needs-category').val(),
	      	name: $('#needs-title').val(),
	      	description: $('#needs-description').val(),
	      	location: $('#needs-location').val(),
	      	pricing: {
	      		fixed: parseFloat($('#needs-offer-fixed').val()),
	      		hourly: parseFloat($('#needs-offer-hour').val()),
	      		daily: parseFloat($('#needs-offer-day').val()),
	      		weekly: parseFloat($('#needs-offer-week').val())
	      	},
	      	availability: $('.need-sched:checkbox:checked').map(function(el){ return $(this).val();}).get(),
	      	paySchedule: $('.need-payopt:checkbox:checked').map(function(el){ return $(this).val();}).get(),
	      	terms: $('#needs-terms').val()
	      }

	      if (o.paySchedule.indexOf('deposit')>-1) {
	      	o.deposit = {
	      		type: $('#input-fixed-need').val() ? 'usd' : 'percent',
	      		amount: $('#input-fixed-need').val() || $('#input-percent-need').val()
	      	}
	      };

	      if (!o.category||!o.name) return vex.dialog.alert('please select a valid category for your resource');

	      try {
	      	var x = /^\d{5}$/.exec(o.location.trim())
	      	if (!x) throw new Error()
	      } catch(e) {
	      	return vex.dialog.alert('invalid postal code detected, please enter valid zipcode or postal code')
	      }

	      appendResourceToTable(o, true)
	      $('#reset_res_add')[0].reset()
    },
    'click #add-social': function(e) { 
      e.preventDefault();
      appendSocialToTable({
      	name: $('#social-title').val(),
      	address: $('#social-url').val()
      }, true)
    },
    'click #add-reel': function(e) { 
      e.preventDefault();
      appendMediaURLtoTable({
      	name: $('#reel-name').val().trim(),
      	url: videoURLValidation($('#reel-url').val().trim())
      }, true)
    },
    'click #vidurl': function(e) {
    	e.preventDefault();
    	vex.dialog.open({
		    message: 'How to link YouTube and Vimeo URLs',
		    input: [
				'<div class="embed-responsive embed-responsive-4by3">',
				'<iframe class="embed-responsive-item" src="/img/vidurls.mp4"></iframe>',
				'</div>',
		    ].join(''),
		    buttons: [
		        $.extend({}, vex.dialog.buttons.NO, { text: 'Close' })
		    ]
		});
    },
	'change #merchtype': function(e) {
		e.preventDefault();
		var giftType = $('#merchtype option:selected').val();
		if (giftType.indexOf('Select')>-1) return alert('please select merchandise type');
		$('#merchtypehidden').show();
		if (giftType==='Apparel') {
			$('#apparelsizes').show();
			$('#perishabledetails').hide();
		} else if (giftType==='Perishable') {
			$('#apparelsizes').hide();
			$('#merch_handling').prop("placeholder", "Shelf Life and Handling Instructions");
			$('#perishabledetails').show();
		} else {
			$('#apparelsizes').hide();
			$('#merch_handling').prop("placeholder", "Details and Handling Instructions");
			$('#perishabledetails').show();
		};
	},
	'click #add-gift': function(e) {
	    e.preventDefault();
	    var o = {};
	    o.name = $('#gift-title').val(), o.description = $('#gift-description').val(), o.msrp = parseFloat($('#gift-msrp').val());
	    if (!o.name || Number.isFinite(o.msrp) === false || o.msrp < 1) return alert('please correct the name or price information to continue');
	    if (!osettings.giftImage.data) o.url = 'https://s3-us-west-2.amazonaws.com/producehour/placeholder_gift.jpg';
	    else o.data = osettings.giftImage.data;
	    // get type
	    o.type = $('#merchtype option:selected').val();
	    if (o.type.indexOf('Select')>-1) return alert('please select merchandise type');
	    if (o.type==='Apparel') {

	      o.quantity = {}

	      $('.apparelsize').each(function() {
	        o.quantity[$(this).val()] = parseInt($('#' + $(this).attr('val')).val()||0)
	      })

	      for (var key in o.quantity) {
	        if (!o.quantity[key]) {
	          delete o.quantity[key]
	        };
	      }

	      o.secondaryData = Object.keys(o.quantity)

	      if (!o.secondaryData.length) return vex.dialog.alert('You should have at least one size available for sale to continue.');

	    } else {
	      o.secondaryData = $('#merch_handling').val();
	      o.quantity = {all: $('#oneoff').val()}
	    };
	    o.disclaimer = $('#merch_disclaimer').val();
	    osettings.giftImage = {};
	    
	    for (var key in o.quantity) {
	    	var _i = parseInt(o.quantity[key])
    		if (!Number.isInteger(_i)||_i<=0) {
    			delete o.quantity[key]
    		}
	    }

	    if (!Object.keys(o.quantity).length)
	    	return vex.dialog.alert('there is no valid quantity for sale, please correct and try again')


	    appendPersonalMerchTable(o)
	    $('#editProjForm')[0].reset()
	    $('#merchtype').change()
	 	["XSs", "Ss", "Ms", "Ls", "XLs", "XXLs"].forEach(function(el) {
	 		var id = '#' + el
	 		var val = el.substr(0, el.length-1)
	 		$(id).val(val)
	 	})

	},
	'input #social-title': function() { 
		if (true) {};
		$('#add-social').removeClass('btn'), $('#add-social').removeClass('disabled')
	},
	'input #reel-url': function() { 
		if (true) {};
		$('#add-reel').removeClass('btn'), $('#add-reel').removeClass('disabled')
	},
	'input #needs-title': function() { 
		if (true) {};
		$('#add-needs').removeClass('btn'), $('#add-needs').removeClass('disabled')
	},
	'input #input-percent-need': function() { 
		$('#percent_deposit_val').text($('#input-percent-need').val()) 
	},
	'click #checkbox-need-deposit': function() { 
		if ($('input#checkbox-need-deposit').is(':checked')) { $('.percent_deposit').show() } else { $('.percent_deposit').hide() }
	},
	'input #input-fixed-need': function() { 
		if ($('#input-fixed-need').val()) {
			$('#input-percent-need').prop('disabled', true)
			$('#percent_deposit_sign').text(' USD')
			$('#percent_deposit_val').text($('#input-fixed-need').val())
		} else {
			$('#input-percent-need').prop('disabled', false)
			$('#percent_deposit_sign').text('%')
			$('#percent_deposit_val').text($('#input-percent-need').val()||10)
		}
	},
	'click .cust_resource': function(e) {
		var idx = $($(e.target).closest('tr')).attr('idx')

		var json = resources[idx]
		json.idx = idx

		console.log(json)

		var arr = [
			'<div id="hid_idx" style="display:none" val="',json.idx,'"></div>',
			'<form id="reset_res_add">',
			  '<div class="row w100">',
			    '<div class="krown-alert">',
			      '<label for="category">Select Category</label>',
			      '<select class="form-control" name="category" id="edit-needs-category">',
			        '<option value="">- Category -</option>',
			        '<option value="Equipment">Equipment</option>',
			        '<option value="Service">Service</option>',
			        '<option value="Location">Location</option>',
			        '<option value="Construction">Construction</option>',
			        '<option value="Legal">Legal</option>',
			        '<option value="Sales">Sales / Marketing</option>',
			        '<option value="Miscellaneous">Miscellaneous</option>',
			      '</select>',
			    '</div>',
			  '</div>',
			  '<div class="row w100">',
			    '<div class="col-xs-6">',
			        '<label for="needs-description">name of this item</label>',
			        '<input type="text" name="title" id="edit-needs-title" placeholder="Name" />',
			    '</div>',
			    '<div class="col-xs-6">',
			        '<label for="needs-description">postal code of this item</label>',
			        '<input type="text" name="title" id="edit-needs-location" value="" placeholder="Postal Code" />',
			    '</div>',
			 
			    '<div class="col-sm-12">',
			        '<label for="needs-description">describe your item</label>',
			        '<input type="text" name="title" id="edit-needs-description" value="" placeholder="Description" />',
			    '</div>',
			    '<div class="col-sm-12 b20">',
			        '<label for="needs-description">define pricing (in US Dollars)</label>',
			    '</div>',
			    '<div class="col-sm-9">',
			        '<input type="number" min="0" name="title" id="edit-needs-offer-fixed" value="'+(json.pricing.fixed?json.pricing.fixed:'')+'" placeholder="enter fixed price" />',
			    '</div>',
			    '<div class="col-sm-3">',
			        '<p><small><strong>fixed</strong></small></p>',
			    '</div>',
			    '<div class="col-sm-9">',
			        '<input type="number" min="0" name="title" id="edit-needs-offer-hour" value="'+(json.pricing.hourly?json.pricing.hourly:'')+'" placeholder="enter hourly price" />',
			    '</div>',
			    '<div class="col-sm-3">',
			        '<p><small>per <strong>hour</strong></small></p>',
			    '</div>',
			    '<div class="col-sm-9">',
			        '<input type="number" min="0" name="title" id="edit-needs-offer-day" value="'+(json.pricing.daily?json.pricing.daily:'')+'" placeholder="enter daily price" />',
			    '</div>',
			    '<div class="col-sm-3">',
			        '<p><small>per <strong>day</strong></small></p>',
			    '</div>',
			    '<div class="col-sm-9">',
			        '<input type="number" min="0" name="title" id="edit-needs-offer-week" value="'+(json.pricing.weekly?json.pricing.weekly:'')+'" placeholder="enter weekly price" />',
			    '</div>',
			    '<div class="col-sm-3">',
			        '<p><small>per <strong>week</strong></small></p>',
			    '</div>',
			    '<div class="b40 krown-alert">',
			      '<div class="col-xs-12 b20">',
			          '<label for="needs-description">define offer options</label>',
			      '</div>',
			      '<div class="col-xs-12">',
			        '<div class="row">',
			          '<div class="col-xs-8 checkbox">',
			            '<input class="need-payopt-edit" type="checkbox" id="edit-checkbox-need-none" value="none" name="needpayopts" >',
			            '<label for="edit-checkbox-need-none" val="none">None</label>',
			            '<p class="needs-p"><small>handle offline</small></p>',
			          '</div>',
			          '<div class="col-xs-12 col-sm-8 checkbox">',
			            '<input class="need-payopt-edit" type="checkbox" id="edit-checkbox-need-full" name="needpayopts" value="full" >',
			            '<label for="edit-checkbox-need-full" val="full">Pay in Full</label>',
			            '<p class="needs-p"><small>full amount</small></p>',
			          '</div>',
			          '<div class="col-xs-12 col-sm-8 checkbox">',
			            '<input class="need-payopt-edit" type="checkbox" id="edit-checkbox-need-deposit" name="needpayopts" value="deposit">',
			            '<label for="edit-checkbox-need-deposit" val="deposit"><span id="percent_deposit_val_edit">10</span><span id="percent_deposit_sign_edit">%</span> Deposit</label>',
			            '<p class="needs-p"><small>deposit</small></p>',
			          '</div>',
			          '<div class="col-xs-6 checkbox b20 t20 percent_deposit_edit" style="display:none">',
			            '<input class="user-role b20" type="number" min="0" max="100" id="input-percent-need-edit" value="10" name="needpayopts_b">',
			            '<label for="input-percent-need"><i>change deposit</i></label>',
			          '</div>',
			          '<div class="col-xs-6 checkbox b20 t20 percent_deposit_edit" style="display:none">',
			            '<input class="user-role b20" type="number" min="0" id="input-fixed-need-edit" placeholder="override percent" name="needpayopts_b">',
			            '<label for="input-fixed-need"><i>enter fixed price</i></label>',
			          '</div>',
			        '</div>',
			        '<div class="row">',
			          '<div class="col-xs-12 b20">',
			              '<label for="needs-description">general availability (check all that apply)</label>',
			          '</div>',
			          '<div class="col-xs-8 checkbox">',
			            '<input class="need-sched-edit" type="checkbox" id="edit-checkbox-need-sched-any" value="any" name="needschedopts" >',
			            '<label for="edit-checkbox-need-sched-any">Available Anytime</label>',
			          '</div>',
			          '<div class="col-xs-8 checkbox">',
			            '<input class="need-sched-edit" type="checkbox" id="edit-checkbox-need-sched-any-weekdays" value="any-weekdays" name="needschedopts">',
			            '<label for="edit-checkbox-need-sched-any-weekdays">Available Anytime (M - F)</label>',
			          '</div>',
			          '<div class="col-xs-8 checkbox">',
			            '<input class="need-sched-edit" type="checkbox" id="edit-checkbox-need-sched-am" value="am" name="needschedopts">',
			            '<label for="edit-checkbox-need-sched-am">Available Mornings (M - F)</label>',
			          '</div>',
			          '<div class="col-xs-8 checkbox">',
			            '<input class="need-sched-edit" type="checkbox" id="edit-checkbox-need-sched-pm" value="pm" name="needschedopts">',
			            '<label for="edit-checkbox-need-sched-pm">Available Evenings (M - F)</label>',
			          '</div>',
			          '<div class="col-xs-8 checkbox">',
			            '<input class="need-sched-edit" type="checkbox" id="edit-checkbox-need-sched-any-weekends" value="any-weekends" name="needschedopts">',
			            '<label for="edit-checkbox-need-sched-any-weekends">Available Anytime (weekends)</label>',
			          '</div>',
			          '<div class="col-xs-8 checkbox">',
			            '<input class="need-sched-edit" type="checkbox" id="edit-checkbox-need-sched-am-wk" value="am-wk" name="needschedopts">',
			            '<label for="edit-checkbox-need-sched-am-wk">Available Mornings (weekends)</label>',
			          '</div>',
			          '<div class="col-xs-8 checkbox">',
			            '<input class="need-sched-edit" type="checkbox" id="edit-checkbox-need-sched-pm-wk" value="pm-wk" name="needschedopts">',
			            '<label for="edit-checkbox-need-sched-pm-wk">Available Evenings (weekends)</label>',
			          '</div>',
			        '</div>',
			      '</div>',
			      '<div class="col-xs-12">',
			        '<label for="needs-terms">Additional Terms</label>',
			        '<textarea id="edit-needs-terms" placeholder="&nbsp;&nbsp;&nbsp;Write any additional details, terms, and conditions here."></textarea>',
			      '</div>',
			    '</div>',
			  '</div>',
			'</form>'
		]

		vex.dialog.open({
			message: 'Edit Asset',
			input: arr.join(''),
		    buttons: [
		        $.extend({}, vex.dialog.buttons.YES, { text: 'SAVE' }),
		        $.extend({}, vex.dialog.buttons.NO, { text: 'Close' }),
		        $.extend({}, vex.dialog.buttons.NO, { text: 'DELETE', className:'special' , click: function($vexContent, event) {
		            this.value = parseInt(json.idx)+1;
		            this.close()
		        }})
		    ],
			afterOpen: function() {
				$('#edit-checkbox-need-deposit').on('click', function() { 
					if ($('input#edit-checkbox-need-deposit').is(':checked')) { $('.percent_deposit_edit').show() } else { $('.percent_deposit_edit').hide() }
				})

				$('#edit-needs-category option[value=\''+json.category+'\']').prop('selected', true);
				$('#edit-needs-title').val(json.name)
				$('#edit-needs-location').val(json.location)
				$('#edit-needs-description').val(json.description)

				json.paySchedule.forEach(function(p) {
					switch (p) {
						case 'none': 
							$('#edit-checkbox-need-none').prop('checked', true)
							break
						case 'full': 
							$('#edit-checkbox-need-full').prop('checked', true)
							break
						case 'deposit': {
							$('#edit-checkbox-need-deposit').prop('checked', true)
							$('.percent_deposit_edit').show()
							var elid = json.deposit.type==='percent' ? '#input-percent-need-edit' : '#input-fixed-need-edit'
							$('#percent_deposit_val_edit').text(json.deposit.amount)
							$('#percent_deposit_sign_edit').text(json.deposit.type==='percent'?'%':'USD')
							$(elid).val(json.deposit.amount)
						}
					}
				})

				json.availability.forEach(function(a) {
					console.log(a)
					switch (a) {
						case 'any':
							$('#edit-checkbox-need-sched-any').prop('checked', true)
							break
						case 'any-weekdays':
							$('#edit-checkbox-need-sched-any-weekdays').prop('checked', true)
							break
						case 'am':
							$('#edit-checkbox-need-sched-am').prop('checked', true)
							break
						case 'pm':
							$('#edit-checkbox-need-sched-pm').prop('checked', true)
							break
						case 'any-weekends':
							$('#edit-checkbox-need-sched-any-weekends').prop('checked', true)
							break
						case 'am-wk':
							$('#edit-checkbox-need-sched-am-wk').prop('checked', true)
							break
						case 'pm-wk':
							$('#edit-checkbox-need-sched-pm-wk').prop('checked', true)
							break
					}
				})

				$('#edit-needs-terms').val(json.terms)
			},
			callback: function(data) {
				if (data) {
					if (Number.isInteger(data)) {
						var idx = data - 1
						var elid = '#lease-table tr:eq('+data+')'
						$(elid).remove();
						resources.splice(idx, 1)
					} else {
						var idx = parseInt($('#hid_idx').attr('val'))
						resources[idx] = {
					      	category: $('#edit-needs-category').val(),
					      	name: $('#edit-needs-title').val(),
					      	description: $('#edit-needs-description').val(),
					      	location: $('#edit-needs-location').val(),
					      	pricing: {
					      		fixed: parseFloat($('#edit-needs-offer-fixed').val()),
					      		hourly: parseFloat($('#edit-needs-offer-hour').val()),
					      		daily: parseFloat($('#edit-needs-offer-day').val()),
					      		weekly: parseFloat($('#edit-needs-offer-week').val())
					      	},
					      	availability: $('.need-sched-edit:checkbox:checked').map(function(el){ return $(this).val();}).get(),
					      	paySchedule: $('.need-payopt-edit:checkbox:checked').map(function(el){ return $(this).val();}).get(),
					      	terms: $('#edit-needs-terms').val()
					    }

						if (resources[idx].paySchedule.indexOf('deposit')>-1) {
							resources[idx].deposit = {
								type: $('#input-fixed-need').val() ? 'usd' : 'percent',
								amount: $('#input-fixed-need').val() || $('#input-percent-need').val()
							}
						};

					    if (!resources[idx].category||!resources[idx].name) return

						if (!/^\d{5}$/.exec(resources[idx].location.trim())) return

					}
					saveSettings({showDialog:true});
				}
			}
		})
	},
	'input #gift-title': function() {$('#add-gift').removeClass('btn'), $('#add-gift').removeClass('disabled') },
	'click .removeGift': function(e) {
		e.preventDefault()
		vex.dialog.confirm({
			message: 'please confirm you want to delete this item',
			callback: function(d) {
				if (d) {
					var idx = $($(e.target).closest('tr')).index();
					gifts.splice(idx, 1);
					Session.set('gifts', gifts)
					saveSettings();
				}
			}
		})
	},
	'click .viewGift': function() {
		// EDIT GIFT
	}
});

Template.settings.helpers({
	artist: function() {
		try {
		  if (Meteor.user().iamRoles.indexOf('producer')>-1||Meteor.user().iamRoles.indexOf('roles')>-1) {
		    return true
		  };
		} catch(e) {}
		return false
	},
	producer: function() {
		var user = Meteor.user()
		return user.iamRoles&&user.iamRoles.indexOf('producer')>-1||false
	},
	actor: function() {
		var user = Meteor.user()
		return user.iamRoles&&user.iamRoles.indexOf('roles')>-1||false
	},
	assets: function() {
		var user = Meteor.user()
		return user.iamRoles&&user.iamRoles.indexOf('assets')>-1||false
	},
	viewer: function() {
		var user = Meteor.user()
		return user.iamRoles&&user.iamRoles.indexOf('view')>-1||false
	},
	noUserEmail: function() {
	  if (Meteor.user()&&Meteor.user().notification_preferences&&Meteor.user().notification_preferences.email&&Meteor.user().notification_preferences.email.verification) {
	    return false
	  };

	  if (Meteor.user()&&Meteor.user().notification_preferences&&Meteor.user().notification_preferences.phone&&Meteor.user().notification_preferences.phone.verification) {
	    return false
	  };

	  return true
	},
	r_foo: function() {
		return JSON.stringify(this).replace(/"/g, '\"')
	},
	gifts: function() {
		return Session.get('gifts')
	},
	resources: function() {
		return Session.get('resources');
	},
	init: function() {
		Session.set('resources', resources)
		Session.set('gifts', gifts)
		Meteor.call('createBankingAccount');
		if (Meteor.user().iamRoles&&Meteor.user().iamRoles.indexOf('producer')>-1) $('#roundedTwo1').prop('checked', true)
		if (Meteor.user().iamRoles&&Meteor.user().iamRoles.indexOf('roles')>-1) $('#roundedTwo2').prop('checked', true)
		if (Meteor.user().iamRoles&&Meteor.user().iamRoles.indexOf('view')>-1) $('#roundedTwo3').prop('checked', true)
	},
	giftPurchases: function() {
		return Meteor.user().giftPurchases||[]
	},
	purchaseAMT: function() {
		return this.token.receipt.amount/100
	},
	purchaseStatus: function() {
		return this.status||'unfulfilled'
	},
	hasEmail: function() {
		return Meteor.user().email!==null
	},
	hasGifts: function() {
		return Meteor.user().gifts&&Meteor.user().gifts.length
	},
	userGifts: function() {
		return Meteor.user().gifts||[]
	},
	createAccount: function() {
		Meteor.call('createBankingAccount');
	},
	equityCamps: function() {
		/** 
			if my id is in list of equity holders:
				id:
				details: {
					value: percent equity
					date assigned:
					considerationType: author | patron | cast | crew | resource
					considerationValue: amount | role | resource -- details
				}
		*/
		var _id = Meteor.user()._id;
		return Projects.find({
			$or: [
				{
					$and: [
			          { archived: true },
			          { ownerId: _id }
			        ]
				},
				{
					"equity.id": _id
				}
			]
	    });
	},
	activeCamps: function() {
		var _id = Meteor.user()._id;
		var _x = Projects.find({
	        $and: [
	          { archived: false },
	          { usersApproved: _id }
	        ]
	    }).fetch();
	    var x = _x.map(function(p) {
	    	p.scope = 'approved';
	    	return p;
	    });

		var _y = Projects.find({
	        $and: [
	          { archived: false },
	          { ownerId: _id }
	        ]
	    }).fetch();
	    var y = _y.map(function(p) {
	    	p.scope = 'created';
	    	return p;
	    });

	    return x.concat(y);
	},
	isCreated: function() {
		if (this.scope==='created') return true;
		return false;
	},
	bio: function() {
		return Meteor.user().bio || 'describe yourself and your experiences'
	},
	first_name: function() {
		return Meteor.user().firstName || 'First name';
	},
	last_name: function() {
		return Meteor.user().lastName || 'Last name';
	},
	website: function() {
		return Meteor.user().website || 'enter http://www.your.site'
	},
	avatar: function() {
		return Meteor.user().avatar;
	},
	account: function() {
		if (Meteor.user().account) return true;
		return false;
	},
	bank: function() {
		return Meteor.user()&&Meteor.user().bank||false;
	},
	bank_name: function() {
		return Meteor.user().bank.bank_name;
	},
	account_no: function() {
		return '********'+Meteor.user().bank.last4;
	},
	routing_no: function() {
		return Meteor.user().bank.routing_number;
	},
	emailConfig: function() {
		var configs = Meteor.user().notification_preferences  || {};
		var _email = configs.email || {};
		return _email.verification || false;
	},
	emailReverify: function() {
		var configs = Meteor.user().notification_preferences  || {};
		var _email = configs.email || {};
		if (_email.email&&_email.verification===false) {
			return true;
		};
		return false;
	},
	emailValue: function() {
		var configs = Meteor.user().notification_preferences  || {};
		var _email = configs.email || {};
		return _email.email || '';
	},
	emailConfigStatus: function() {
		var configs = Meteor.user().notification_preferences  || {};
		if (!configs.email) return 'N / A';
		var _email = configs.email || {};
		if (_email.verification) return 'verified';
		return 'not verified';
	},
	phoneConfig: function() {
		var configs = Meteor.user().notification_preferences  || {};
		var _phone = configs.phone || {};
		return _phone.verification || false
	},
	phoneReverify: function() {
		var configs = Meteor.user().notification_preferences  || {};
		var _phone = configs.phone || {};
		if (_phone.phone&&_phone.verification===false) {
			return true;
		};
		return false;
	},
	phoneValue: function() {
		var configs = Meteor.user().notification_preferences  || {};
		var _phone = configs.phone || {};
		return _phone.phone || '';
	},
	phoneConfigStatus: function() {
		var configs = Meteor.user().notification_preferences  || {};
		if (!configs.phone) return 'N / A';
		var _phone = configs.phone || {};
		if (_phone.verification) return 'verified';
		return 'not verified';
	},
	messages: function() {
		/** 
			THIS METHOD IS COMPLETELY FUCKED
				- used to show each message
				- now it's one negotiations tab (set)

		  	IT SHOULD SHOW UNIQUE PROJ BY OFFERS, not messages
		  */
		var projects = Projects.find({
	        $and: [
	          {archived: false},
	          {ownerId: Meteor.user()._id}
	        ]
	    }).fetch().map(function(p) {
	    	return p._id;
	    });
		var messages = ProjectMessages.find({ 
			$or: [
				{ 
					user: Meteor.user()._id,
					archived: { $ne: true }
				} , 
				{ 
					project: { $in: projects },
					archived: { $ne: true }
				}
			] 
		}, { 
				sort: { createTimeActual: -1 } 
		}).fetch();

		var projs = messages.map(function(p) {
			return p.project;
		});

		var returnArr = [], duplicatesArr = [];

		for (var i = 0; i < messages.length; i++) {
			var m = messages[i];
			if (duplicatesArr.indexOf(m.project)===-1) {
				returnArr.unshift(m);
				duplicatesArr.push(m.project);
			};
		};

		return returnArr;
	},
	textify: function() {
		if (this.ownerName==='Open Source Hollywood'&&this.ownerId===Meteor.user()._id) {
			return '';
		};
		return this.text;
	}
});

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

	$(document).ready(function() {
		$('#summernote').summernote({
		  	toolbar: [
			    // [groupName, [list of button]]
			    ['style', ['clear', 'fontname', 'strikethrough', 'superscript', 'subscript', 'fontsize', 'color']],
			    ['para', ['paragraph', 'style']],
			    ['height', ['height']],
			    ['misc', ['undo', 'redo']],
			    ['insert', ['picture', 'video', 'table', 'hr']]
			],
		    height: 300,
		    minHeight: null,
		    maxHeight: null,
		    focus: false,
		    tooltip: false,
		    callbacks: {
		      onInit: function() {
		        $('.note-editable').html(u.bio||'<p><span class="large">Enter your biography here.</span><br>You can copy / paste HTML, for more help visit <a href="https://en.wikipedia.org/wiki/Template:Biography" target="_blank">https://en.wikipedia.org/wiki/Template:Biography</a>.</p><p>&nbsp;</p>');
		        $('.note-toolbar').css('z-index', '0');
		        $('.note-editable').off()
		        $('.note-editable').on('click', function() {
		          if ($('.note-editable').html().indexOf('your biography here.')>-1) $('.note-editable').html('');
		        })
		      }
		    }
		});
	});
};


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


Template.config.helpers({
	needsEmail: function() {
        var u = Meteor.user()
        return u&&u.notification_preferences&&u.email||false
	}
})