Template.projectView.events({
  'click .goto_edit_merch': function() {
    simulateClick(document.getElementsByClassName('gotoedit')[0])
    setTimeout(function() {
      simulateClick(document.getElementById('editmyprojmerch'))
    })
  },
  'click .goto_edit_roles': function() {
    simulateClick(document.getElementsByClassName('gotoedit')[0])
    setTimeout(function() {
      simulateClick(document.getElementById('editmyprojroles'))
      $("html, body").animate({ scrollTop: "300px" });
    })
  },

  'click .goto_updates': function() {
    simulateClick(document.getElementsByClassName('goto_proj_updates')[0])
  },

  'click .goto_comments': function() {
    simulateClick(document.getElementsByClassName('goto_proj_comments')[0])
  },

  'click .goto_community': function() {
    simulateClick(document.getElementsByClassName('goto_proj_community')[0])
  },

  'click .goto_manage': function() {
    $('#access_board_convenience').click()
  },
  /** AUTHENTICATE */
  'click .login': function(e) {
    e.preventDefault();
    goDiscovery();
  },
  /** FLAG */
  'click #reportthis': function(e) {
    e.preventDefault();
    /** show vex dialog */
    vexFlag(this);
  },
  /** ROLES */
  'click #join-roles': function(e) {
    e.preventDefault();
    /**

      cast crew or resource
      cast / crew => select role
      resource => select resource

     */

    displayRoleTypeDialog( ((this.project.crew||[]).map(function(r){ 
          r.ctx='crew' 
          return r
        }).concat((this.project.cast||[]).map(function(r){ 
          r.ctx='cast' 
          return r
        }))) , {
      title: 'Select Role',
      apply_pay: true,
      apply_donate: true,
      apply_time: true
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

      // collect subscription donations on campaign
      // if (Meteor.user()) {
      //   dialogInput = dialogInput.concat([
      //     '<div class="vex-custom-field-wrapper t20">',
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
      //       '<h4>Login to make subscription donation to this campaign!</h4>',
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
      if (!data) return
      if (!data.donation) return alert('There is no donation amount specified.');

      var amt = Math.abs(parseInt(data.donation));
      data.amount = amt

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

      data.message = 'Donation to ' + currentTitle
      data.description = 'O . S . H . $' + data.amount + ' donation to ' + currentTitle
      data.type = 'project'
      data.slug = currentSlug
      data.title = currentTitle
      data.projectOwnerId = currentProject.ownerId
      data.banner = currentProject.banner
      data.donationObject = donationObject

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
  /** SHARES */
  'click #buy-shares': function(e) {
    e.preventDefault();
    /** vex dialog how many shares to purchase, purchase */
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
            '<label for="date">Number of shares (' + currentProject.mpps + ' USD per share).</label>',
            '<div class="vex-custom-input-wrapper">',
                '<input name="shares" type="number" />',
            '</div>',
        '</div>'
    ]


    dialogInput = dialogInput.concat([
      '<div class="vex-custom-field-wrapper">',
        '<p>We are currently in test mode. You can make all your transactions with a test credit card number 4000 0000 0000 0077 exp 02/22 cvc 222 for your transactions.</p>',
      '</div>'
    ])

    vex.dialog.open({
      message: 'How many shares?',
      input: dialogInput.join(''),
      callback: function(data) {
        if (!data||!data.shares) return;
        var amt = Math.abs(parseInt(data.shares)) * currentProject.mpps;
        if (!isNaN(amt) && amt>0) {
          var donationObject = {
            first: Meteor.user().firstName,
            last: Meteor.user().lastName,
            email: Meteor.user().email,
            id: Meteor.user()._id,
            amount: amt,
            shares: Math.abs(parseInt(data.shares))
          }
          
          makeStripeCharge({
            amount: amt,
            message: 'Purchase ' + data.shares + ' shares',
            description: data.shares + ' shares purchased on O . S . H .',
            donationObject: donationObject,
            route: 'buyShares',
            slug: currentSlug
          });
        }
      }
    });
  },
  /** EDIT / UPDATE */
  'click #submit-update': function(e) {
    e.preventDefault();
    /** unshift text and date */
    var updateText = $('#update-box').val();
    if (updateText) {
      Meteor.call('projectUpdateText', {
        slug: currentSlug,
        update: {
          text: updateText,
          date: new Date()
        }
      });
      vex.dialog.alert('update submitted');
      $('#update-box').val('');
    };
  },
  /** FULFILL GIFT */
  'click .fulfill_gift': function(e) {
    e.preventDefault();
    var was = this
    o={gift:this.order.gift}
    var orderSummary = [
      '<div class="row">',
        '<div class="col-sm-7">',
        this.order.gift.name,
        '<br>Order Summary</div>',
        '<div class="panel-body">',
          '<table class="table"><thead><tr><th>Type</th><th>Quantity</th><th>Total</th></tr></thead><tbody>',
          quantOrdersTable(this.order.order, o, this.order.gift.msrp),
          '</tbody></table>',
        '</div>',
      '</div>'
    ].join('')
    orderSummary = orderSummary + [
      '<div class="row">',
        '<div class="col-sm-7">Shipping Details</div>',
        '<div class="panel-body">',
          '<table class="table"><tbody>',
          '<tr><td>name</td><td>',this.order.name,'</td>',
          '<tr><td>address</td><td>',this.order.address,'</td>',
          '<tr><td>city</td><td>',this.order.city,'</td>',
          '<tr><td>state, zip</td><td>',[this.order.state, this.order.zip].join(', '),'</td>',
          '<tr><td>contact</td><td>',[this.order.email, this.order.phone].join('; '),'</td>',
          '</tbody></table>',
        '</div>',
      '</div>'
    ].join('')

    var buttons = [
        $.extend({}, vex.dialog.buttons.NO, { text: 'Close' })
    ]

    if (!was.fulfilled) {
      buttons.unshift($.extend({}, vex.dialog.buttons.NO, { text: 'Mark as Fulfilled', className: 'aquamarineB', click: function($vexContent, event) {
          this.value = 'fulfill';
          this.close()
      }}))
    }

    buttons.unshift($.extend({}, vex.dialog.buttons.NO, { text: 'Download', className: 'lemonB', click: function($vexContent, event) {
        this.value = 'report';
        this.close()
    }}))

    var user_name = this.user && this.user.name || '';
    var user_avatar = this.user && this.user.avatar || '';
    var vexOpen = true;
    var _vex = vex.dialog.open({
      title: 'Gift Fulfillment',
      input: orderSummary,
      buttons: buttons,
      callback: function (data) {
        if (!vexOpen) return;
        vexOpen = false;
          if (!data) {
              return
          }
          
          if (data==='fulfill') {
            Meteor.call('markMerchFulfillment', was)
          };

          if (data==='report') {
            ConvertToCSV(was)
          };

          _vex.close();
      }
    });
  },
  /** BUY GIFT */
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
                        o.route = 'purchaseGift';
                        o.slug = currentSlug;
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
                              makeStripeCharge(o)
                            };
                          }
                        })
                      } catch(e) {}
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
  /** ARCHIVE */
  "click #closeProj": function () {
    vex.dialog.confirm({
      message: 'Are you sure you want to close this project?',
      callback: function (r) {
        if (!r || r === false) return;
        Meteor.call("closeProject", currentSlug);
      }
    });
  },
  /** COMMENTS */
  'click #submit-comment': function(e) {
    e.preventDefault();
    var text = document.getElementById('comment-box').value;
    document.getElementById('comment-box').innerHTML = '';
    Meteor.call('addProjectComment', this._slug, 0, text);
  },
  /** LIKE */
  'click #thumbsup': function() {
    if ($('#thumbsup').hasClass('active')) {
      Meteor.call('downvoteProject', this._slug);
      $('#thumbsup').removeClass('active');
    } else {
      Meteor.call('upvoteProject', this._slug);
      $('#thumbsup').addClass('active');
    }
  },
  /** ASSETS OFFER */
  'click .offer_resource': function(e) {
    var assets = Meteor.user().assets||[]
    if (!assets.length)
      return vex.dialog.alert('You have not uploaded any assets, add assets in the "Settings" section.')

    var cat = this.category
    var asss = []
    assets.forEach(function(a) {
      if (cat===a.category) asss.push(a);
    })

    if (!asss.length)
      return vex.dialog.alert('You do not have assets to match this type, update your assets in the "Settings" section.')


    function addslashes( str ) {
      return (str + '').replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
    }

    var asssTr = asss.map(function(a, idx) { 
      return [
        '<tr>',
            '<td>',a.name,'</td>',
            '<td>',a.description,'</td>',
            "<th><a href='#!' class='select_asss'><i class='assscheck fa fa-check-circle' val='",
            idx,
            "'></i></a></th>",
        '</tr>'
      ].join('') 
    }).join('')

    var asssTable = [
      '<table class="table">',
          '<thead>',
            '<th>Name</th>',
            '<th>Description</th>',
            '<th>Select</th>',
          '</thead>',
          '<tbody id="gift-table">',
          asssTr,
          '</tbody>',
      '</table>',
      '<p><small><strong>Do you want to make an express offer?</strong></small></p>',
      '<div class="col-sm-12 col-md-8">',
          '<label><small>what is your offer for the selected assets?</small></label>',
          '<input type="number" min="0" max="999999" name="offer" placeholder="Enter price here" />',
      '</div>',
      '<div class="col-sm-12 col-md-8">',
          '<label><small>How many days is this offer good for?</small></label>',
          '<input type="number" min="3" max="90" name="days" placeholder="Enter number of days" />',
      '</div>',
      '<div class="col-sm-12 col-md-8">',
          '<label><small>Do you have a custom message?</small></label>',
          '<input type="text" name="message" placeholder="Enter your message here" />',
      '</div>',
    ].join('')

    var showVex1 = true
    var _vex1 = vex.dialog.open({
      message: ['Select ', cat, ' Asset to Offer'].join(''),
      input: asssTable,
        buttons: [
            $.extend({}, vex.dialog.buttons.YES, { text: 'OFFER', className: 'aquamarineB' }),
            $.extend({}, vex.dialog.buttons.NO, { text: 'Close' }),
        ],
      afterOpen: function() {
        $('.select_asss').off()
        $('.select_asss').on('click', function(e) {
          e.preventDefault()
          var i = $(e.target).closest('i')
          if ($(i).hasClass('fa-circle')) {
            $(i).removeClass('fa-circle').addClass('fa-check-circle')
          } else {
            $(i).removeClass('fa-check-circle').addClass('fa-circle')
          }
        })
      },
      callback: function(data) {
        if (showVex1&&data) {
          showVex1 = false
          var d = []
          $('.assscheck.fa-check-circle').each(function() {
            try { d.push(asss[parseInt($(this).attr('val'))]) } catch(e) { console.log(e) }
          })

          if (!d.length) {
            _vex1.close()
            return setTimeout(function() {
              vex.dialog.alert('None of your assets were checked!')
            }, 144)
          };

          data.assets = d
          data.project = currentProject
          data.slug = currentSlug
          Meteor.call('offerProjectAsset', data, function(e, r) {
            _vex1.close()
            return setTimeout(function() {
              vex.dialog.alert(r)
            }, 144)
          })
        };
      }
    })
  }
});