var donationObject = {}, currentSlug, currentTitle, currentProject, me, was;
const StripePublicKey = 'pk_test_Dgvlv9PBf6RuZJMPkqCp00wg';

makeStripeCharge = function (options) {
  StripeCheckout.open({
    key: StripePublicKey,
    amount: Math.abs(Math.floor(options.amount*100))<1?1:Math.abs(Math.floor(options.amount*100)),
    currency: 'usd',
    name: options.message,
    description: options.description || 'opensourcehollywood.org',
    panelLabel: 'Pay Now',
    token: function(_token) {
      if (_token) {
        options.token = _token;
        Meteor.call(options.route, options, function(err, result) {
          if (err) bootbox.alert('your payment failed');
          bootbox.alert(result)

        });
      } else {
        bootbox.alert('your payment did not succeed');
      }
    }
  });
};

initVex = function () {

}

innerVexApply = function (options, cb) {
  return vex.dialog.open({
      message: options.message,
      input: [
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
              '<label for="date">'+options.label+'</label>',
              '<div class="vex-custom-input-wrapper">',
                  '<input name="donation" type="number" />',
              '</div>',
          '</div>'
      ].join(''),
      callback: cb
    });
};

vexFlag = function (proj) {
  return vex.dialog.open({
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
        url: 'https://opensourcehollywood.org/projects/'+proj._slug+'/'+proj.ownerId,
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
  });
};

displayRoleTypeDialog = function (list, options) {
  vex.closeTop();
  // console.log(list, options)
  // console.log(new Array(10).join('1 2  '))
  var isMeteorUser = Meteor.user&&Meteor.user()||false;
  var inputHTML = list.map(function(c, idx) {
    var typeofRole = c.ctx === 'crew' ? 'a crew position' : c.ctx === 'cast' ? 'a cast position' : 'a resource needed';
    var _html = '<div class="vex-custom-field-wrapper" id="displayroles">';
    _html += '<div class="row"><div class="col-sm-12"><div class="thumbnail"><div class="caption"><h3 style="margin-bottom: 10px;">' + (c.title||c.role||c.category) + '</h3><p style="margin-bottom: 13px;font-weight:200">'+ typeofRole +'</p><p style="margin-bottom: 5px">' + c.description + '</p>';
    if (isMeteorUser) {
      // console.log('what is ctx ?')
      // console.log(c.ctx)
      // console.log('raw c = ')
      // console.log(c)
      _html += '<div class="btn-toolbar">';

      if (options.apply_pay) _html+='<a href="#" class="btn btn-default btn-group apply-pay" role="button" idx="'+idx+'" ctx="' +c.ctx+'">Request Pay</a>'
      if (options.apply_time) _html+='<a href="#" class="btn btn-default btn-group apply-time" role="button" idx="'+idx+'" ctx="' +c.ctx+'">Donate Time</a>'

      if (c.ctx!=='need') {
        if (options.apply_donate) _html+='<a href="#" class="btn btn-default btn-group apply-donate" role="button" idx="'+idx+'" ctx="' +c.ctx+'">Offer Pay</a>'
      }

      _html+='</div>';
    }
    _html += '</div></div></div></div>';
    _html += '</div>';
    return _html;
  }).join('');
  if (list.length===0) inputHTML='<p>&nbsp;</p><h3>&nbsp;&nbsp;There are no roles available.</h3>';
  vex.dialog.alert({
      message: options.title,
      input: [
          '<style>',
              '.vex-custom-field-wrapper {',
                  'margin: 1em 0;',
              '}',
              '.vex-custom-field-wrapper > label {',
                  'display: inline-block;',
                  'margin-bottom: .2em;',
              '}',
          '</style>',
          inputHTML
      ].join(''),
      callback: function (data) {
        if (options.signin) return $('.login').click();
        if (!data) {
            return
        }
      },
      afterOpen: function() {
        var was = this;
        setTimeout(function() {
            // Either of these lines will do the trick, depending on what browsers you need to support.
            was.rootEl.scrollTop = 0;
            was.contentEl.scrollIntoView(true);
            $(was.$vex).scrollTop(0)
        }, 0)
        $('.apply-pay').on('click', function(e) {
          var ctx = $(e.target).attr('ctx').trim()
          var position = list[parseInt($(this).attr('idx'))];
          vex.closeAll();
          /** ask user to define how much pay for resource */
          innerVexApply({
            message: 'How much for your participation.',
            label: 'Amount of money (USD).',
          }, function(data) {
            var amt = data.donation || 0;
            amt = Math.abs(parseInt(amt));
            if (amt) {
              /** send offer to user, email user */
              var o = {
                ctx:ctx, 
                position: position.title||position.role||position.category,
                type: 'hired',
                pay: amt,
                amount: amt,
                message: currentTitle + ' offer',
                route: 'applyToProject',
                slug: currentSlug,
                appliedFor: position.title||position.role||position.category
              };
              Meteor.call(o.route, o, function(err, result) {
                vex.dialog.alert(err||result);
              });
            };
          });
        });

        $('.apply-time').on('click', function(e) {
          var position = list[parseInt($(this).attr('idx'))];
          var ctx = $(e.target).attr('ctx').trim()
          vex.closeAll();
          var o = {
            ctx:ctx, 
            position: position.title||position.role||position.category,
            type: 'hired',
            pay: 0,
            amount: 0,
            message: currentTitle + ' offer (time donation)',
            route: 'applyToProject',
            slug: currentSlug,
            appliedFor: position.title||position.role||position.category
          };
          Meteor.call(o.route, o, function(err, result) {
            vex.dialog.alert(err||result);
          });
        });

        $('.apply-donate').on('click', function(e) {
          var position = list[parseInt($(this).attr('idx'))];
          var ctx = $(e.target).attr('ctx').trim()
          vex.closeAll();
          /** ask user to define how much pay for resource */
          innerVexApply({
            message: 'How much will you donate for this role.',
            label: 'Money amount (USD), refunded in 5 business days unless accepted.',
          }, function(data) {
            var amt = data.donation || 0;
            amt = Math.abs(parseInt(amt));
            if (amt) {
              /** send offer to user, email user */
              var o = {
                ctx:ctx, 
                position: position.title||position.role||position.category,
                type: 'sourced',
                pay: amt,
                amount: amt,
                message: currentTitle + ' offer (money and time donation)',
                route: 'applyToProject',
                slug: currentSlug,
                appliedFor: position.title||position.role||position.category
              };
              makeStripeCharge(o);
            };
          });
        });
      }
  })
};

quantOrdersTable = function (quantOrders, o, msrp) {
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
};

goDiscovery = function () {
  try{
    var cb = document.getElementById('discoverybtn'); 
      cb.dispatchEvent(new MouseEvent('click', {
        view: window
      }));
  } catch(e){ window.location.assign('/discover');}
};

getCurrentNegotiation = function () {
  var negotiatedRoles = was.project.negotiations || [];
  var negotiatedRole;
  for (var i = 0; i < negotiatedRoles.length; i++) {
    if (negotiatedRoles[i].id = was.user._id) {
      negotiatedRole = negotiatedRoles[i];
      break;
    };
  };
  return negotiatedRole || {};
}

negotiationHelper = function (key) {
  var negotiatedRole = getCurrentNegotiation();
  if (negotiatedRole&&negotiatedRole[key]) {
    return negotiatedRole[key];
  };
  return false;
}