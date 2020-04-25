Template.myProfile.events({
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
			var osettings = getOSettings()
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
			    setOSettings(osettings)
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
			var osettings = getOSettings()
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
	            setOSettings(osettings)
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
		var o = {
			name: $('#reel-name').val().trim(),
			url: videoURLValidation($('#reel-url').val().trim())
		}
		reels.push(o)
		Session.set('reels', reels);
		setTimeout(function() {
			$('.deleteRow').off().on('click', deleteRow);
		}, 622)
		$('#reel-name').val('');
		$('#reel-url').val('');
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
	    var osettings = getOSettings()
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
		setOSettings(osettings)
	    
	    for (var key in o.quantity) {
	    	var _i = parseInt(o.quantity[key])
    		if (!Number.isInteger(_i)||_i<=0) {
    			delete o.quantity[key]
    		}
	    }

	    if (!Object.keys(o.quantity).length)
	    	return vex.dialog.alert('there is no valid quantity for sale, please correct and try again')


	    appendPersonalMerchTable(o)
	    Meteor.call('addPersonalMerch', o)

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