var currUID, currAvatar, currName, assetMultiDialogOpen = false, v2DialogOpen = false

function quantOrdersTable(quantOrders, o, msrp) {
  var _order = [], totalOrder = 0
  quantOrders.forEach(function(o) {
    totalOrder+=o.quantity
    _order = _order.concat([
      '<tr><td>',
        o.key,
      '</td>',
      '<td>',
        o.quantity,
      '</td><td class="">&nbsp;$',
        o.quantity*msrp,
      '</td></tr>'
    ])
  })

  _order = _order.concat([
      '<tr><td class="center">&nbsp;</td><td class="center">&nbsp;</td>',
      '<td class="center"><b>$',
        totalOrder * msrp,
      '</b></td></tr>'
  ])

  return _order.join('')
}

// buy merch
const StripePublicKey = 'pk_test_imJVPoEtdZBiWYKJCeMZMt5A'//'pk_live_GZZIrMTVcHHwJDUni09o09sq';

function makeStripeCharge(options) {
  StripeCheckout.open({
    key: StripePublicKey,
    amount: Math.abs(Math.floor(options.amount*100))<1?1:Math.abs(Math.floor(options.amount*100)),
    currency: 'usd',
    name: options.message,
    bitcoin: true,
    description: options.description || 'opensourcehollywood.org',
    panelLabel: 'Pay Now',
    token: function(_token) {
      if (_token) {
        options.token = _token;
        if (Meteor.user()) {
          Meteor.call(options.route, options, function(err, result) {
            if (err) return vex.dialog.alert('your payment failed');
            vex.dialog.alert(result)
          });
        } else {
          // confirm dialog
          vex.dialog.alert({
            message: 'Please confirm the following to finalize payment.',
            input: [
              '<ul>',
                '<li class="wcheckbox">',
                    '<label class="with-square-checkbox">',
                        '<input id="ageverify" name="ageverify" type="checkbox">',
                        '<span>I am 18 years of age or older.</span>',
                    '</label>',
                '</li>',
                '<li class="wcheckbox">',
                    '<label class="with-square-checkbox">',
                        '<input id="payverify" name="payverify" type="checkbox">',
                        '<span>I am authorized to make payments with the payment method I selected.</span>',
                    '</label>',
                '</li>',
                '<li class="wcheckbox">',
                    '<label class="with-square-checkbox">',
                        '<input id="refverify" name="refverify" type="checkbox">',
                        '<span>I understand my payment is non-refundable and will be immediately applied to the campaign\'s budget.</span>',
                    '</label>',
                '</li>',
              '</ul>',
              '<div class="form-group">',
                  '<label for="signature">Sign Your Name</label>',
                  '<input type="text" class="form-control" name="signature" id="signature" placeholder="enter your name here">',
              '</div>',
            ].join(''),
            callback: function(data) {
              if (!data.ageverify) {
                vex.dialog.alert('you must be 18 or older to continue, your payment was cancelled');
                return
              } else if (!data.payverify) {
                vex.dialog.alert('you must be authorized for the transaction, your payment was cancelled');
                return
              } else if (!data.refverify) {
                vex.dialog.alert('you must agree to our terms to continue, your payment was cancelled');
                return
              } else if (!data.signature) {
                vex.dialog.alert('you must provide a signature, your payment was cancelled');
                return
              } 
              data.date = new Date();
              options.anonymous_verification = data;
              Meteor.call(options.route, options, function(err, result) {
                if (err) return vex.dialog.alert('your payment failed');
                vex.dialog.alert(result)
              });
            }
          });
        }
      } else {
        vex.dialog.alert('your payment did not succeed');
      }
    }
  });
};

function vexFlag(usr) {
  vex.dialog.open({
    message: 'Request to Remove',
    input: [
      '<div> ',
        '<form> ',
          '<div class="checkbox">',
            '<label style="display: grid;">',
              '<input type="checkbox" value="" name="t1" id="t1">',
              'Obscene content, whether images or text',
            '</label>',
          '</div>',
          '<div class="checkbox">',
            '<label style="display: grid;">',
              '<input type="checkbox" value="" name="t2" id="t2">',
              'Malicious content',
            '</label>',
          '</div>',
          '<div class="checkbox">',
            '<label style="display: grid;">',
              '<input type="checkbox" value="" name="t3" id="t3">',
              'Content that is mislabelled, misplaced, or categorized incorrectly',
            '</label>',
          '</div>',
          '<div class="checkbox">',
            '<label style="display: grid;">',
              '<input type="checkbox" value="" name="t4" id="t4">',
              'Spam and solicitations',
            '</label>',
          '</div>',
          '<div class="checkbox">',
            '<label style="display: grid;">',
              '<input type="checkbox" value="" name="t5" id="t5">',
              'Violations of site policy',
            '</label>',
          '</div>',
          '<div class="checkbox">',
            '<label style="display: grid;">',
              '<input type="checkbox" value="" name="t6" id="t6">',
              'Copyrighted work',
            '</label>',
          '</div>',
          '<div class="checkbox">',
            '<label style="display: grid;">',
              '<input type="checkbox" value="" name="t7" id="t7">',
              'Descriptions/solicitation of illegal acts',
            '</label>',
          '</div>',
        '</form>',
      '</div>',
      '<div class="flagdesc"> ',
        '<form> ',
          '<textarea class="form-control" rows="3" placeholder="enter here" name="t8" id="t8"></textarea> ',
        '</form> ',
      '</div>'
    ].join(''),
    callback: function (data) {
      if (
          !$("#t1").is(':checked')&&
          !$("#t2").is(':checked')&&
          !$("#t3").is(':checked')&&
          !$("#t4").is(':checked')&&
          !$("#t5").is(':checked')&&
          !$("#t6").is(':checked')&&
          !$("#t7").is(':checked')&&
          !$("#t8").val()
        ) return;
      Meteor.call('flagComplaint', {
        url: backupURL = 'https://opensourcehollywood.org/profile/'+usr._id,
        complaint: {
          'Obscene content, whether images or text': $("#t1").is(':checked'),
          'Malicious content': $("#t2").is(':checked'),
          'Content that is mislabelled, misplaced, or categorized incorrectly': $("#t3").is(':checked'),
          'Spam and solicitations': $("#t4").is(':checked'),
          'Violations of site policy': $("#t5").is(':checked'),
          'Copyrighted work': $("#t6").is(':checked'),
          'Descriptions/solicitation of illegal acts': $("#t7").is(':checked')
        },
        msg: $("#t8").val()
      });
    }
  })
}

function vexScore(usr) {
  vex.dialog.alert({
    message: 'What is a score?',
    input: [
      '<div> ',
        '<form> ',
          '<div class="checkbox">',
            '<label style="display: grid;">',
              '<input type="checkbox" value="" name="t1" id="t1">',
              'Think of it like money.',
            '</label>',
          '</div>',
          '<div class="checkbox">',
            '<label style="display: grid;">',
              '<input type="checkbox" value="" name="t2" id="t2">',
              'Your work (engagements and projects) earn you points.',
            '</label>',
          '</div>',
          '<div class="checkbox">',
            '<label style="display: grid;">',
              '<input type="checkbox" value="" name="t3" id="t3">',
              'Work in. Work out.',
            '</label>',
          '</div>',
          '<div class="checkbox">',
            '<label style="display: grid;">',
              '<input type="checkbox" value="" name="t4" id="t4">',
              'You work, and we help (with connections, tools, and cloud storage).',
            '</label>',
          '</div>',
        '</form>',
      '</div>',
    ].join('')
  })
}


Template.profile.helpers({
	init: function() {
		currUID = this._id
    currAvatar = this.avatar
    currName = (this.firstName||'' + ' ' + this.lastName||'').trim()
    if (!currName) currName = 'O . S . H . artist'
	},
	giftIMG: function() {
		return this.url||this.data
	},
	hasGifts: function() {
		return this.gifts&&this.gifts.length
	},
	gifts: function() {
		return this.gifts||[]
	},
	formattedBio: function() {
		var that =  this;
		setTimeout(function() {
		  if (that.bio) $('#formatted_desc').html(that.bio);
		  else $('#formatted_desc').text('apparently this user likes to keep an air of mystery about them');
		}, 800);
	},
	userProjects: function() {
		return Projects.find({ownerId: this._id});
	},
	isVideo: function() {
		var falsy = false;
		if (this.url.indexOf('vimeo')>-1||this.url.indexOf('youtube')>-1) falsy = true;
		return falsy;
	},
	userReels: function() {
		return this.reels.reverse();
	},
	influenceScore: function() {
		return this.influenceScore;
	},
	avatar: function() {
		return this.avatar;
	},
	formattedName: function() {
		return this.firstName + ' ' + this.lastName;
	},
	createdAt: function() {
		return moment(this.createdAt).format('MM-DD-YYYY');
	},
	hasLinks: function() {
		return this.socialLinks && this.socialLinks.length > 0;
	},
	links: function() {
		return this.socialLinks || ['this user has not shared any social media links'];
	},
	hasWorks: function() {
		return this.onlineWorks && this.onlineWorks.length > 0;
	},
	works: function() {
		return this.onlineWorks || ['this user has not shared any social media links'];
	},
	hasIAM: function() {
		return this.iam && this.iam.length > 0;	
	},
	hasInterests: function() {
		return this.interests && this.interests.length > 0;	
	},
	iams: function() {
		if (!this.iam.length) {
			return 'this user has not specified any specialties or interests'
		};
		return this.iam.join(', ');	
	},
	interests: function() {
		return this.interests || [];	
	},
	hasWebsite: function() {
		return this.website && this.website.indexOf('htt') > -1;	
	},
	website: function() {
		return this.website;	
	},
	hasHeadshots: function() {
		return this.headshots && this.headshots.length > 0;		
	},
	headshots: function() {
		return this.headshots.map(function(i) {
			i.url = 'https://s3-us-west-2.amazonaws.com/producehour/headshots/' + i.url;
			return i;
		});	
	},
	shareData: function() {
    ShareIt.configure({
	        sites: {
	            'facebook': {
	                'appId': '1790348544595983'
	            }
	        }
	    });
	    var roles;
	    if (!this.iam.length) {
			roles = 'Amazing talent available on O . S . H . (https://opensourcehollywood.org).';
		};
		roles = this.iam.join(', ');	

	    var backupURL = 'https://opensourcehollywood.org/profile/'+this._id;
	    return {
	      title: [this.firstName, this.lastName,'on Open Source Hollywood! <opensourcehollywood.org>'].join(' '),
	      author: 'Open Source Hollywood',
	      excerpt: roles,
	      summary: roles,
	      description: roles,
	      thumbnail: this.avatar,
	      image: this.avatar,
	      url: backupURL
	    }
	},
	profileHasMedia: function() {
		return this.reels.length>0;
	},
	hasAssets: function() {
		return (this.assets||[]).length
	},
	assets: function() {
		return (this.assets||[])
	},
	innerPricing: function() {
		var pricing = this.pricing
		var pricingKeys = Object.keys(pricing)
		var a = []
		pricingKeys.forEach(function(key) {
			if (pricing[key]) a.push({key: key, value: pricing[key]})
		})
		return a
	},
	formattedAvailability: function() {
		var normalized = {
			any: 'anytime',
			'any-weekdays': 'anytime weekdays',
			am: 'mornings weekdays',
			pm: 'evening weekdays',
			'any-weekends': 'anytime weekends',
			'am-wk': 'mornings weekends',
			'pm-wk': 'evenings weekends'
		}
    var availability = this.availability||[]
		return availability.map(function(a) {
			return normalized[a]
		})
	},
	hasSocialMedia: function() {
    this.social = this.social || []
    this.social = this.social.filter(function(s) {
      if (s&&s.trim()) return s
    })
		return this.social.length
	},
});


Template.profile.events({
  'click #reportthis': function(e) {
    e.preventDefault();
    /** show vex dialog */
    vexFlag(this);
  },
  'click #scorethis': function(e) {
    e.preventDefault();
    /** show vex dialog */
    vexScore(this);
  },
  'click .purchase_gift': function(e) {
    e.preventDefault();
    var was = this, o={gift:was};

    var dialogInput = [
      '<figure class="snip1165">',
        '<img src="',
        was.url||was.data,
        '" />',
        '<figcaption>',
          '<h3>',
          was.name,
          '</h3>',
          '<p>',
            was.description,
          '</p>',
          '<h4>ADDITIONAL INFORMATION:&nbsp;<br><small><strong>',
            was.secondaryData||'no additional information provided for this item',
          '</small></strong></h4>',
          '<h4>REFUND POLICY & DISCLAIMER:&nbsp;<br><small><strong>',
            was.disclaimer||'no refund policy or disclaimer provided for this item',
          '</small></strong></h4>',
          '<hr>',
          '<h6 style="margin-top:8px;margin-bottom:0px">$',
          was.msrp,
          '&nbsp;<span style="font-weight:300"><small>per unit</small></span></h6>',
        
    ]

    var quantityData = was.quantity

    if (was.type==='Apparel') {
      // show sizes / availability
      for (var key in quantityData) {
        dialogInput = dialogInput.concat([
          '<div class="row merchbottomborder t20">',
              '<div class="col-sm-12 col-md-5">',
                  '<div class="checkbox">',
                    '<input class="apparelsize" type="text" value="',
                    key,
                    '" readonly/>',
                  '</div>',
              '</div>',
              '<div class="col-sm-12 col-md-7">',
                  '<label style="font-weight:300">',
                    quantityData[key],
                    '&nbsp;units available',
                  '</label>',
                  '<input class="quantorder" type="number" min="0" val="',
                  key,
                  '" max="',
                  quantityData[key],
                  '" placeholder="how many units?">',
                  
              '</div>',
          '</div>'
        ])
      }
    } else {
      // ask quantity
      dialogInput = dialogInput.concat([
        '<div class="row merchbottomborder t20">',
            '<div class="col-sm-12">',
                '<label style="font-weight:300">',
                  quantityData.all,
                  '&nbsp;units available',
                '</label>',
                '<input class="quantorder" val="',was.name.replace('"',''),'" type="number" min="0" max="',
                quantityData.all,
                '" placeholder="how many units?">',
            '</div>',
        '</div>'
      ])
    }


    dialogInput = dialogInput.concat(['</figcaption>','</figure>'])
  
    var vex1Open = true, vex2Open = true, vex3Open = true;
    var vex1 = vex.dialog.open({
        message: [was.type, 'for sale'].join(' '),
        // message: ['   Details of ',was.name,'. Purchase below.'].join(''),
        buttons: [
          $.extend({}, vex.dialog.buttons.YES, { text: 'PURCHASE' }),
          $.extend({}, vex.dialog.buttons.NO, { text: 'Close' }),
        ],
        input: dialogInput.join(''),
        callback: function (data) {
            if (!data) {
                return
            }

            var quantOrders = [], totalOrder = 0
            $('.quantorder').each(function() {
              if (parseInt($(this).val())) {
                quantOrders.push({
                  key: $(this).attr('val'),
                  quantity: parseInt($(this).val())
                })
              };
            })

            if (!quantOrders.length) return vex.dialog.alert("Please specify the number of units to continue.")

            for (var i = 0; i < quantOrders.length; i++) {
              var desiredQuant = quantOrders[i].quantity
              var actualQuant = was.quantity[quantOrders[i].key]
              if (desiredQuant>actualQuant) {
                vex1.close();
                vex.dialog.alert("You requested more items than were available. Please try again.")
                return
              } else {
                totalOrder+=desiredQuant
              }
            };

            var orderSummary = [
              '<div class="row">',
                '<div class="col-sm-7">',
                was.name,
                '<br>Order Summary</div>',
                '<div class="panel-body">',
                  '<table class="table"><thead><tr><th>Type</th><th>Quantity</th><th>Total</th></tr></thead><tbody>',
                  quantOrdersTable(quantOrders, o, was.msrp),
                  '</tbody></table>',
                '</div>',
              '</div>'
            ].join('')

            if (vex1Open) {
              vex1Open = false;
              vex1.close();

              var od = {}
              try {
                od = JSON.parse(localStorage.getItem('orderTemplate'))
              } catch(e) {}

              var dialogInput = [
                  '<style>',
                      '.vex-custom-field-wrapper {',
                          'margin: 1em 0;',
                      '}',
                      '.vex-custom-field-wrapper > label {',
                          'display: inline-block;',
                          'margin-bottom: .2em;',
                      '}',
                  '</style>',
                  orderSummary,
                  '<h5>Please complete your order:</h5>',
                  '<div class="vex-custom-field-wrapper">',
                      '<label for="address-gift">Recipient Name</label>',
                      '<div class="vex-custom-input-wrapper">',
                          '<input type="text" class="form-control contrastback" placeholder="enter name here" id="address-name"',
                          od.name ? ['value="', od.name, '"'].join(''):'',
                           '>',
                      '</div>',
                  '</div>',
                  '<div class="vex-custom-field-wrapper">',
                      '<label for="address-gift">Shipping Address</label>',
                      '<div class="vex-custom-input-wrapper">',
                          '<input type="text" class="form-control contrastback" placeholder="e.g. 6925 Hollywood Blvd" id="address-gift"',
                          od.address ? ['value="', od.address, '"'].join(''):'',
                           '>',
                      '</div>',
                  '</div>',
                  '<div class="vex-custom-field-wrapper">',
                      '<label for="city-gift">City</label>',
                      '<div class="vex-custom-input-wrapper">',
                          '<input type="text" class="form-control contrastback" placeholder="e.g. Hollywood" id="city-gift"',
                          od.city ? ['value="', od.city, '"'].join(''):'',
                           '>',
                      '</div>',
                  '</div>',
                  '<div class="vex-custom-field-wrapper">',
                      '<label for="state-gift">State</label>',
                      '<div class="vex-custom-input-wrapper">',
                          '<input type="text" class="form-control contrastback" placeholder="e.g. CA or California" id="state-gift"',
                          od.state ? ['value="', od.state, '"'].join(''):'',
                           '>',
                      '</div>',
                  '</div>',
                  '<div class="vex-custom-field-wrapper">',
                      '<label for="zip-gift">Zip Code</label>',
                      '<div class="vex-custom-input-wrapper">',
                          '<input type="text" class="form-control contrastback" placeholder="e.g. 90028" id="zip-gift"',
                          od.zip ? ['value="', od.zip, '"'].join(''):'',
                           '>',
                      '</div>',
                  '</div>',
                  '<div class="vex-custom-field-wrapper">',
                      '<label for="email-gift">Contact Email</label>',
                      '<div class="vex-custom-input-wrapper">',
                          '<input type="text" class="form-control contrastback" placeholder="e.g. yours@email.com" id="email-gift"',
                          od.email ? ['value="', od.email, '"'].join(''):'',
                           '>',
                      '</div>',
                  '</div>',
                  '<div class="vex-custom-field-wrapper">',
                      '<label for="email-gift">Verify Email</label>',
                      '<div class="vex-custom-input-wrapper">',
                          '<input type="text" class="form-control contrastback" placeholder="e.g. yours@email.com" id="email-gift-ver"',
                          od.email ? ['value="', od.email, '"'].join(''):'',
                           '>',
                      '</div>',
                  '</div>',
                  '<div class="vex-custom-field-wrapper">',
                      '<label for="phone-gift">Contact Phone</label>',
                      '<div class="vex-custom-input-wrapper">',
                          '<input type="text" class="form-control contrastback" placeholder="e.g. (310) 555-1212" id="phone-gift"',
                          od.phone ? ['value="', od.phone, '"'].join(''):'',
                           '>',
                      '</div>',
                  '</div>'
              ]


              var vex2 = vex.dialog.open({
                message: 'Order Information',
                buttons: [
                  $.extend({}, vex.dialog.buttons.YES, { text: 'CONTINUE' }),
                  $.extend({}, vex.dialog.buttons.NO, { text: 'Cancel' }),
                ],
                input: dialogInput.join(''),
                callback: function (data) {

                    if (!data) {
                        return
                    }
                    if (vex2Open) {
                      vex2Open = false;
                      vex2.close();
                      try {
                        o.name = $('#address-name').val(), o.address = $('#address-gift').val(), o.city = $('#city-gift').val(), o.state = $('#state-gift').val(), o.zip = $('#zip-gift').val(), o.email = $('#email-gift').val().toLowerCase().trim(), o.phone = $('#phone-gift').val();
                        if (o.email!==$('#email-gift-ver').val().toLowerCase().trim()) return vex.dialog.alert('invalid email, your email must match');
                        if (!o.address||!o.zip||!o.email) return vex.dialog.alert('invalid order information, please include address, email, and zipcode fields and try again');
                        localStorage.setItem('orderTemplate', JSON.stringify(o));
                        o.order = quantOrders;
                        o.amount = totalOrder * was.msrp;
                        o.totalUnits = totalOrder;
                        o.message = was.name + ' purchase';
                        o.route = 'userMerchSale';
                        o.slug = 'personal merch';
                        var vex3 = vex.dialog.open({
                          message: 'Confirmation & Payment',
                          input: orderSummary + [
                            '<div class="row">',
                              '<div class="col-sm-7">Shipping Details</div>',
                              '<div class="panel-body">',
                                '<table class="table"><tbody>',
                                '<tr><td>name</td><td>',o.name,'</td>',
                                '<tr><td>address</td><td>',o.address,'</td>',
                                '<tr><td>city</td><td>',o.city,'</td>',
                                '<tr><td>state, zip</td><td>',[o.state, o.zip].join(', '),'</td>',
                                '<tr><td>contact</td><td>',[o.email, o.phone].join('; '),'</td>',
                                '</tbody></table>',
                              '</div>',
                            '</div>'
                          ].join(''),
                          callback: function(data) {
                            if (!data) return;
                            if (vex3Open) {
                              vex3Open = false
                              vex3.close()
                              o.uid = currUID
                              makeStripeCharge(o)
                            };
                          }
                        })
                      } catch(e) { console.log(e) }
                    };
                }
              });
            };
        },
        afterOpen: function() {
          var was = this;
          setTimeout(function() {
              // Either of these lines will do the trick, depending on what browsers you need to support.
              was.rootEl.scrollTop = 0;
              was.contentEl.scrollIntoView(true);
              $(was.$vex).scrollTop(0)
          }, 0)
        }
    });
  },
  /** DONATIONS */
  'click #offer-donation': function(e) {
    e.preventDefault();
    /** prompt enter donation amount */
    /**

      donate time or money
      time => choose cast crew resource, choose item
      money => express or conditional
      express => enter amount
      conditional => select role (show cast and crew roles)

     */

    var was = this;


    /** express donation dialog (0a) */
    function displayExpressDonationDialog() {
      vex.closeTop();
      var dialogInput = [
          '<style>',
              '.vex-custom-field-wrapper {',
                  'margin: 1em 0;',
              '}',
              '.vex-custom-field-wrapper > label {',
                  'display: inline-block;',
                  'margin-bottom: .2em;',
              '}',
          '</style>',
          '<div class="vex-custom-field-wrapper">',
              '<label for="date">Amount to donate (USD).</label>',
              '<div class="vex-custom-input-wrapper">',
                  '<input name="donation" type="number" />',
              '</div>',
          '</div>'
      ]

      // if (Meteor.user()) {
      //   dialogInput = dialogInput.concat([
      //     '<div class="vex-custom-field-wrapper t20">',
      //         // set checkbox to show subscription options
      //         // frequency, amount
      //         '<div class="container">',
      //             '<form>',
      //             '<div class="span4">',
      //                 '<div class="">',
      //                   '<p>Would you like to make subscription payments?</p>',
      //                   '<div class="col-xs-12 col-sm-6 col-md-4 checkbox">',
      //                     '<input type="checkbox" id="checkbox-Subscribe" name="Subscribe">',
      //                     '<label for="checkbox-Subscribe">Subscribe</label>',
      //                   '</div>',
      //                 '</div>',
      //                 '<div class="t60 showSubscribeDates nodisplay">',
      //                     '<div class="form-inline">',
      //                         '<label class="control-label">',
      //                             'How frequently?</label>',
      //                         '<label class="radio">',
      //                             '<input name="subscription_opt" class="subscription_opt" value="Daily" type="radio">Daily',
      //                         '</label>&nbsp;',
      //                         '<label class="radio">',
      //                             '<input name="subscription_opt" class="subscription_opt" value="Weekly" type="radio">Weekly',
      //                         '</label>&nbsp;',
      //                         '<label class="radio">',
      //                             '<input name="subscription_opt" class="subscription_opt" value="Monthly" type="radio" checked>Monthly',
      //                         '</label>&nbsp;',
      //                         '<label class="radio">',
      //                             '<input name="subscription_opt" class="subscription_opt" value="Annually" type="radio">Annually',
      //                         '</label>',
      //                     '</div>',
      //                 '</div>',
      //                 '<div class="alert alert-info small showSubscribeDates nodisplay t20">',
      //                   '<p><span id="subscriptionfreq">Monthly</span> selected</p>',
      //                 '</div>',
      //             '</div>',
      //             '</form>',
      //         '</div>',

      //     '</div>'
      //   ])
      // } else {
      //   dialogInput = dialogInput.concat([
      //     '<div class="vex-custom-field-wrapper t20 b20">',
      //       '<h4>Login to make subscription donation to this member!</h4>',
      //     '</div>'
      //   ])
      // };

      // dialogInput = dialogInput.concat([
      //   '<div class="vex-custom-field-wrapper t20">',
      //     '<p>We are currently in test mode. You can make all your transactions with a test credit card number 4000 0000 0000 0077 exp 02/22 cvc 222 for your transactions.</p>',
      //   '</div>'
      // ])

      vex.dialog.open({
        input: dialogInput.join(''),
        callback: expressDonationHandler,
        afterOpen: function() {
          $('#checkbox-Subscribe').off()
          $('#checkbox-Subscribe').on('change', function() {
            if($(this).prop('checked')) {
              $('.showSubscribeDates').show()
            } else {
              $('.showSubscribeDates').hide()
            }
          })

          $('#checkbox-SubscriptionDate').off()
          $('#checkbox-SubscriptionDate').on('change',function() {
            if($(this).prop('checked')) {
              $('.showSubscribeDatesInput').show()
            } else {
              $('.showSubscribeDatesInput').hide()
            }
          })

          $('.subscription_opt').off()
          $('.subscription_opt').on('change', function() {
            $('#subscriptionfreq').text($(this).val())
          })
        }
      });
    }

    /** express donation final handler (0b) */
    function expressDonationHandler(data) {
      // console.log('in expressDonationHandler 1')
      // console.log(data)
      if (!data) return
      if (!data.donation) return alert('There is no donation amount specified.');

      var amt = Math.abs(parseInt(data.donation));
      data.amount = amt

      // console.log('in expressDonationHandler 2')

      // is it subscription?
      if ($('#checkbox-Subscribe').prop('checked')) {

        // user must be registered
        if (!Meteor.user()) {
          return alert('This feature is only available for registered users.')
        };
        // user must be a customer
        if (!Meteor.user().customer) {
          return alert('You must update your profile for this feature to be available.')
        };


        data.frequency = $('.subscription_opt:checked').val()
        data.subscription = true

        // create plan and make purchase
        var mapVals = {
          'Daily': 'day',
          'Weekly': 'week',
          'Monthly': 'month',
          'Annually': 'year'
        }

        data.frequency = mapVals[data.frequency]
        data.route = 'createSubscriptionDonation'

      } else {
        data.route = 'donateToProject'
      }

      var donationObject = {};
      if (Meteor.user()) {
        donationObject = {
          first: Meteor.user().firstName,
          last: Meteor.user().lastName,
          email: Meteor.user().email,
          id: Meteor.user()._id,
          amount: data.amount
        }
      } else {
        donationObject = {
          first: 'anonymous',
          last: 'patron',
          id: 'anon_donation',
          amount: data.amount
        }
      }

      data.message = 'Donation to ' + currName
      data.description = 'O . S . H . $' + data.amount + ' donation to ' + currName
      data.type = 'user'
      data.user = currUID
      data.name = currName
      data.avatar = currAvatar
      data.donationObject = donationObject

      // console.log(new Array(100).join('@ '))
      // console.log(data)

      makeStripeCharge(data);
    }


    function timeDateDonateConfig() {
      $('.dtm').on('click', function(e) {
        e.preventDefault();
          displayMoneyTypeDialog();
      })
    }

    displayExpressDonationDialog()
  },
  'click .request_asset': function(e) {
  	console.log(this)

    var _was = this


    if (assetMultiDialogOpen) return;
    var dialogHTML = [
        '<h3>Set Request Schedule:</h3>',
        '<div class="row">',
            '<div class="form-group col-xs-6">',
              '<label>Choose Start Date</label>',
              '<input class="form-control calendar set_time_ass" type="date" name="start_date_ass">',
            '</div>',
            '<div class=" form-group col-xs-6">',
              '<label>Choose Start Time </label>',
              '<input class="form-control clock set_time_ass" type="time" name="start_time_ass">',
            '</div>',
        '</div>',
        '<div class="row">',
            '<div class="form-group col-xs-6">',
              '<label>Choose End Date</label>',
              '<input class="form-control calendar set_time_ass" type="date" name="end_date_ass">',
            '</div>',
            '<div class=" form-group col-xs-6">',
              '<label>Choose End Time </label>',
              '<input class="form-control clock set_time_ass" type="time" name="end_time_ass">',
            '</div>',
        '</div>',
        '<p>&nbsp;</p>',
        '<div class="row">',
            '<div class="form-group col-xs-12">',
              '<label>or Enter Total Hours</label>',
              '<input class="form-control" type="number" min="1" max="999" name="hours_ass">',
            '</div>',
        '</div>',
        '<div class="t20 row">',
            '<p class="callout">Your contact</p>',
            '<div class="form-group col-xs-6">',
              '<label>Phone</label>',
              '<input class="form-control" type="text" name="phone_contact">',
            '</div>',
            '<div class=" form-group col-xs-6">',
              '<label>Email </label>',
              '<input class="form-control" type="text" name="email_contact">',
            '</div>',
        '</div>'
    ]


    var v1 = vex.dialog.open({
      input: dialogHTML.join(''),
      callback: function(data) {
        if (assetMultiDialogOpen) return;
        assetMultiDialogOpen = true
        if (!data) {
          assetMultiDialogOpen = false
          v2DialogOpen = false
          return
        };
        console.log('callback')
        console.log(data)
        v1.close()
        function evalThisOffer(_offer) {
              if (v2DialogOpen) return;
              var _o = {
                hourly: [], 
                daily: [], 
                weekly: [],
                payment: []
              }

              var items = []
              var fixed = 0
              var maxDepositPercent = 0
              var maxDepositFixed = 0

              _offer.assets.forEach(function(a) {
                items.push({
                  category: a.category,
                  item: a.name,
                  description: a.description
                })
                if (a.deposit) {
                  if (a.deposit.type==='percent') {
                    maxDepositPercent = Math.max(a.deposit.amount, maxDepositPercent)
                  } else {
                    maxDepositFixed = Math.max(a.deposit.amount, maxDepositFixed)
                  }
                };
                for (var key in a.pricing) {
                  if (a.pricing[key])
                    if (_o[key])
                      _o[key].push(a.pricing[key])
                    else
                      fixed += a.pricing[key]
                }
                // get pricing options
                a.paySchedule.forEach(function(_a) {
                  if (_o.payment.indexOf(_a)===-1)
                    _o.payment.push(_a)
                })
              })

              for (var key in _o) {
                if (key==='payment') continue
                _o[key] = (function() {
                  var max = 0
                  for (var i = 0; i < _o[key].length; i++) {
                    if (!max||_o[key][i] > max) max = _o[key][i];
                  };
                  return max
                }())
              }

              _offer.order = _o

              var totalWeeks = _offer.weeks
              var totalDays = _offer.days + _offer.remDays
              var totalHours = _offer.hours + _offer.remHours

              var weeklyPrice = _offer.order.weekly
              var dailyPrice = _offer.order.daily
              var hourlyPrice = _offer.order.hourly

              var weeklyCost = weeklyPrice * totalWeeks
              var dailyCost = dailyPrice * totalDays
              var hourlyCost = hourlyPrice * totalHours

              // show request summary, expected charges, and amount owed now
              // 1) only one pay mode? do it, else choose payment mode
              var dialogContent = [
                  '<div class="row">',
                    '<div class="col-sm-7">Confirm Request for this Asset</div>',
                    '<p>&nbsp;</p>',
                    '<p class="krown-column-container small">Items</p>',
                    '<div class="panel-body">',
                      '<table class="table"><tbody>'
              ]

              items.forEach(function(i) {
                dialogContent = dialogContent.concat([
                  '<tr>',
                    '<td>', i.category, '</td>',
                    '<td>', i.item, '</td>',
                    '<td>', i.description, '</td>',
                  '</tr>',
                ])
              })

              dialogContent = dialogContent.concat([
                  '</tbody></table>',
                    '</div>'
              ])

              if (weeklyCost||dailyCost||hourlyCost||fixed) {
                // show pricing
                dialogContent = dialogContent.concat([
                  '<p class="krown-column-container small">Estimated Cost</p>',
                    '<div class="panel-body">',
                        '<table class="table"><tbody>'
                ])

                if (weeklyCost) {

                  dialogContent = dialogContent.concat([
                    '<tr>',
                      '<td>Weekly Pricing</td>',
                      '<td>', weeklyCost, '</td>',
                    '</tr>',
                  ])

                } else if (dailyCost) {

                  dialogContent = dialogContent.concat([
                    '<tr>',
                      '<td>Daily Pricing</td>',
                      '<td>', dailyCost, '</td>',
                    '</tr>',
                  ])

                } else if (hourlyCost) {

                  dialogContent = dialogContent.concat([
                    '<tr>',
                      '<td>Hourly Pricing</td>',
                      '<td>', hourlyCost, '</td>',
                    '</tr>',
                  ])

                } else if (fixed) {

                  dialogContent = dialogContent.concat([
                    '<tr>',
                      '<td>Fixed Pricing</td>',
                      '<td>', fixed, '</td>',
                    '</tr>',
                  ])

                }

                dialogContent = dialogContent.concat([
                    '</tbody></table>',
                      '</div>'
                ])
              }

              dialogContent = dialogContent.concat([
                '</div>'
              ])

              // payment options
              var buttons = []
              var payMaps = { none: 0 }
              var fullAmount = weeklyCost||dailyCost||hourlyCost||fixed||0

              if (_offer.order.payment.indexOf('full')>-1) { 
                payMaps.full = fullAmount
                buttons.push($.extend({}, vex.dialog.buttons.NO, { 
                    text: ['Pay Escrow in Full ($', fullAmount,')'].join(''), 
                    className: 'aquamarineB krown-alert', 
                    click: function($vexContent, event) {
                      this.value = 'full'
                      this.price = fullAmount
                      this.close()
                }}))
              }

              if (_offer.order.payment.indexOf('deposit')>-1) {

                // define max per-cent
                var depositAmount = maxDepositFixed ? maxDepositFixed : (maxDepositPercent/100) * fullAmount
                payMaps.deposit = depositAmount
                if (depositAmount>0) {
                  buttons.push($.extend({}, vex.dialog.buttons.NO, { 
                    text: ['Pay Partial Deposit ($', depositAmount,')'].join(''),
                    className: 'lemonB krown-alert', 
                    click: function($vexContent, event) {
                        this.value = 'deposit'
                        this.close()
                  }}))
                };
              }

              if (!buttons.length||_offer.order.payment.indexOf('none')>-1) {
                buttons.push($.extend({}, vex.dialog.buttons.NO, { 
                  text: 'Arrange without Payment', 
                  className: 'thistle krown-alert', 
                  click: function($vexContent, event) {
                      this.value = 'none'
                      this.close()
                }}))
              }

              buttons.push($.extend({}, vex.dialog.buttons.NO, { text: 'Cancel' }))

              var v2 = vex.dialog.open({
                input: dialogContent.join(''),
                buttons: buttons,
                callback: function(data) {
                  if (v2DialogOpen) return;
                  v2DialogOpen = true
                  if (payMaps[data]) {

                    Object.assign(_offer, {
                      stripePaid: payMaps[data],
                      message: 'Asset Escrow Payment',
                      description: ['$', payMaps[data], ' offer (', _offer.assets.length,' assets)'].join(''),
                      route: 'directLeaseOffer',
                    })

                    // console.log(JSON.stringify(_offer, null, 4))
                    makeStripeCharge(_offer)
                  } else {
                    _offer.free = true
                    v2.close()
                    Meteor.call('directLeaseOffer', _offer, function(err, res) {
                      console.log(err, res)
                    })
                  }
                  v2DialogOpen = false
                  assetMultiDialogOpen = false
                }
              })
        }

        var h = parseInt(data.hours_ass)
        var sd = data.start_date_ass
        var st = data.start_time_ass
        var ed = data.end_date_ass
        var et = data.end_time_ass
        var offereeContact = {
          phone: data.phone_contact,
          email: data.email_contact
        }
        var escrow = 0

        var payOptions, hours, days, weeks, remHours, remDays, startDate, endDate

        if (!h) {

          if (!sd||!ed) {
            return vex.dialog.alert('Please include start and end dates.')
          };

          // is end date after start date ?
          startDate = new Date(sd)
          endDate = new Date(ed)
          var d = new Date()

          if (startDate>endDate) {
            return vex.dialog.alert('End date must be later than start date')
          };

          if (d>startDate) {
            return vex.dialog.alert('Start date must be 1 day in the future')
          };

          var delta = endDate - startDate
          var seconds = delta/1000
          hours = parseFloat((seconds * 0.000277778).toFixed(2))
          weeks = 0, remDays = 0, days = 0, remHours = 0

          if (delta === 0) {
            days = 1
          } else {
            if (hours > 24) {
              days = hours/24
            remHours = hours%24
            };

            if (days > 7) {
              weeks = days / 7
              remDays = days%7
            };
          }
        }

        evalThisOffer({
          assets: [_was],
          payOptions: payOptions||{},
          weeks: parseInt(weeks||0),
          days: parseInt(days||0),
          remDays: parseInt(remDays||0),
          hours: parseInt(hours||h||0),
          remHours: parseInt(remHours||0),
          startDate: startDate,
          endDate: endDate,
          offereeContact: offereeContact,
          user: {
            avatar: currAvatar,
            id: currUID,
            name: currName  
          }
        })
      },
      afterOpen: function() {
        setTimeout(function() {
          $('.calendar').flatpickr();
        
          $('.clock').flatpickr(
          {
            enableTime: true,
            noCalendar: true,

            enableSeconds: false, // disabled by default

            time_24hr: false, // AM/PM time picker is used by default

            // default format
            dateFormat: "H:i", 

            // initial values for time. don't use these to preload a date
            defaultHour: 12,
            defaultMinute: 0

            // Preload time with defaultDate instead:
            // defaultDate: "3:30"
          });

          function hoursAss() {
              $('.set_time_ass').each(function() {
                $(this).val('')
              })
              $('#assetsrejectoffer').removeClass('disabled')
              $('#assetsmakeoffer').removeClass('disabled')
          }

          function timeAss() {
              $('#hours_ass').val('')
              var n = []
              $('.set_time_ass').each(function() {
                if ($(this).val()) n.push(true)
              })
              var d1 = $('#start_date_ass').val()
              var d2 = $('#end_date_ass').val()
              if (d1&&d2) {
                $('#assetsrejectoffer').removeClass('disabled')
                $('#assetsmakeoffer').removeClass('disabled')
              } else {
                console.log('n length =', n.length)
                $('#assetsrejectoffer').addClass('disabled')
                $('#assetsmakeoffer').addClass('disabled')
              }
          }

          $('#hours_ass').off()
          $('#hours_ass').on('input', hoursAss)
          $('#hours_ass').on('change', hoursAss)

          $('.set_time_ass').off()
          $('.set_time_ass').on('input', timeAss)
          $('.set_time_ass').on('change', timeAss)
        }, 144)
      }
    })
  }
});


Template.profile.onRendered(function() {
   setTimeout(function() {
      $('.fb-share').html('<li class="fa fa-facebook"></li>');
      $('.tw-share').html('<li class="fa fa-twitter"></li>');
      $('.pinterest-share').html('<li class="fa fa-pinterest"></li>');
      $('.googleplus-share').html('<li class="fa fa-google-plus"></li>');
      $('#genreclick1').click();
   }, 133);
});

