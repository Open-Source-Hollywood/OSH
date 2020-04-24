Template.newProject.events({
  'click .gotosxn': function(e) {
    var val = $(e.target).attr('val')
    var el = val === 'merch' ? 'gotoproductionmerch' : 'gotoproductionneeds'
    setTimeout(function() {
      simulateClick(document.getElementsByClassName(el)[0])
    }, 144)
  },
  'click #cast_oshx': function(e) {
      if ($(e.target).prop('checked')) {
        $('#cast_pay_amounth').show()
      } else {
        $('#cast_pay_amounth').hide()
      }
  },
  'click #crew_oshx': function(e) {
      if ($(e.target).prop('checked')) {
        $('#crew_pay_amounth').show()
      } else {
        $('#crew_pay_amounth').hide()
      }
  },
  'click .bread_show_resources': function(e) {
    $('.show_resources_toggle').hide()
    $('.bread_show_resources').removeClass('bold')
    $(e.target).addClass('bold')
    var v= $(e.target).attr('val')
    var id = '#show_options_' + v
    $(id).show()
  },
  'click .bread_show_story': function(e) {
    $('.story_toggler').hide()
    $('.bread_show_story').removeClass('bold')
    $(e.target).addClass('bold')
    var v= $(e.target).attr('val')
    var id = '#story_' + v
    $(id).show()
  },
  'click #file_gift': function(e) {
    $('#gift_file').click();
  },
  'click #showbudget': function(e) {
    e.preventDefault();
    showVexBudgetForm();
  },
  'click .showbudget': function(e) {
    e.preventDefault();
    showVexBudgetForm();
  },
  'click #showrevsharing': function(e) {
    e.preventDefault();
    /** sign agreement form and show fields */
        vex.dialog.open({
      message: 'REVENUE SHARING CONFIGURATION',
      input: [
        '<div class="" style="overflow: auto;">',
          '<div class="panel-default">',
            '<small>by allowing revenue sharing, you are exposing yourself to legal liability and risk; please learn <a href="/terms">all terms</a> before proceeding</small>',
            '<div class="panel-body">',
              '<div class="col-sm-12">',
                  '<label for="rev_fullname"> full legal name </label>',
                  '<input type="text" class="revshareagreement" name="rev_fullname" id="rev_fullname" min="0" placeholder="enter full legal name" />',
              '</div>',
              '<div class="col-sm-12">',
                  '<label for="rev_province"> city or province and country name </label>',
                  '<input type="text" class="revshareagreement" name="rev_province" id="rev_province" min="0" placeholder="enter city or province and country name" />',
              '</div>',
              '<div class="col-sm-12">',
                  '<label for="rev_contact"> contact email or phone number </label>',
                  '<input type="text" class="revshareagreement" name="rev_contact" id="rev_contact" min="0" placeholder="enter contact email or phone number" />',
              '</div>',
              '<div class="col-sm-12">',
                  '<label for="misc_post_cost"> AGREEMENT </label>',
                  '<div class="form-check">',
                    '<input class="form-check-input" type="checkbox" value="" id="agreement1" name="agreement1">',
                    '<label class="form-check-label" for="agreement1">',
                      'I understand this is a legal agreement.',
                    '</label>',
                  '</div>',
                  '<div class="form-check">',
                    '<input class="form-check-input" type="checkbox" value="" id="agreement2" name="agreement2">',
                    '<label class="form-check-label" for="agreement2">',
                      'I understand I need to share distribution data with stakeholders.',
                    '</label>',
                  '</div>',
                  '<div class="form-check">',
                    '<input class="form-check-input" type="checkbox" value="" id="agreement3" name="agreement3">',
                    '<label class="form-check-label" for="agreement3">',
                      'I promise to share revenues with investors.',
                    '</label>',
                  '</div>',
                  '<div class="form-check">',
                    '<input class="form-check-input" type="checkbox" value="" id="agreement4" name="agreement4">',
                    '<label class="form-check-label" for="agreement4">',
                      'I understand that I am accepting legal responsibility for selling interests in my campaign.',
                    '</label>',
                  '</div>',
              '</div>',
            '</div>',
          '</div>',
        '</div>',
      ].join(''),
      buttons: [
          $.extend({}, vex.dialog.buttons.YES, { text: 'PROCEED' }),
          $.extend({}, vex.dialog.buttons.NO, { text: 'CANCEL' }),
      ],
      callback: function (data) {
        if (!data) {
            // return console.log('Cancelled')
        }
        data.agreement1 = $("#agreement1").is(':checked');
        data.agreement2 = $("#agreement2").is(':checked');
        data.agreement3 = $("#agreement3").is(':checked');
        data.agreement4 = $("#agreement4").is(':checked');
        if (!data) return
        if (!data.rev_fullname) return alert('please fill out all information and agree to all conditions to continue, missing name information');
        if (!data.rev_province) return alert('please fill out all information and agree to all conditions to continue, missing your location information');
        if (!data.rev_contact) return alert('please fill out all information and agree to all conditions to continue, missing your contact information');
        if (!data.agreement1) return alert('please agree to all terms to continue');
        if (!data.agreement2) return alert('please agree to all terms to continue');
        if (!data.agreement3) return alert('please agree to all terms to continue');
        if (!data.agreement4) return alert('please agree to all terms to continue');
        $('#hiddenequity').show();
        alert('CONGRATULATIONS! you are now eligible for revenue sharing on this campaign; to continue please fill out how much percent of your campaign you are opening for revenue sharing, and the minimum price per share')
        localStorage.setItem('revshare', JSON.stringify(data));
      }
    });
  },
  'click #whatisassign': function(e) {
    e.preventDefault();
    showVexWithInput('Percent Campaign for Auction', [
      '<h4 class="title">Public Auction for Revenue Sharing</h4>',
      '<div class="embed-responsive embed-responsive-4by3">',
        '<small>',
          'You can specify a percentage of your campaign\'s revenues for public auction. ',
          'To do this option, include how much percent you want open to sales (minimum 10% required). ',
          'This will result in 100x the assignments of virtual shares or tokens that you can sell. ',
          'For example, if you specify 10% for assignments then this will result in the issuance of 1,000 shares. ',
          'The default minimum price per share for auction is $1 and can be changed below. ',
          'You can change or set the minimum amount for purchase in one share below. ',
        '</small>',
        '<p>&nbsp;</p>',
        '<small>',
          'This sale represents a <u>LEGAL CONTRACT</u> where you promise to share revenue to the purchaser. ',
        '</small>',
      '</div>',
    ]);
  },
  'click #vidurl': function(e) {
    e.preventDefault();
    showVexWithInput('How to link YouTube and Vimeo URLs', [
      '<div class="embed-responsive embed-responsive-4by3">',
      '<iframe class="embed-responsive-item" src="/img/vidurls.mp4"></iframe>',
      '</div>',
    ]);
  },
  'click #minassign': function(e) {
    e.preventDefault();
    showVexWithInput('Minimum price per share', [
      '<div class="embed-responsive embed-responsive-4by3">',
        '<header class="introduction">',
          '<p>&nbsp;</p>',
          '<small>',
            'This field defines the minimum price someone can offer for purchasing one share of the portion of your campaign that you made available in the percent assignments of your campaign. ',
          '</small>',
          '<p>&nbsp;</p>',
          '<small>',
            'The sale of each share represents a <u>LEGAL CONTRACT</u> where you promise to share revenue to the purchaser. ',
          '</small>',
        '</header>',
      '</div>',
    ]);
  },
  'change #assign': function(e) {
    e.preventDefault();
    var num = parseFloat($('#assign').val());
    try {
      num = num.toFixed(2);
    } catch(e) { throw e };
    num = parseFloat(num);
    if (num > 49) {
      return alert('you can assign a maximum of 49% of your project\'s future earnings');
    };
    if (isNaN(num)) {
      $('#equitydisplay').hide();
    } else {
      $('#numshares').text(num * 100);
      $('#numpercent').text(num);
      $('#shareval').text($('#minimumassign').val()||1);
      $('#assign').val(num);
      $('#equitydisplay').show();
    }
  },
  'change #minimumassign': function(e) {
    e.preventDefault();
    $('#shareval').text($('#minimumassign').val()||1);
  },
  'click #save_campaign_create_changes': function(e) {
    $('#resetNewProjCacheBtn').show();
    var o = returnProjectCreateDetails();
    if (!o) return;
    localStorage.setItem('projectnew', JSON.stringify(o));
    vex.dialog.alert('progress saved for this session');
    // poll input every 30 seconds
    try { clearInterval(autoSaveNewProjInterval); } catch(e) {}
    autoSaveNewProjInterval = setInterval(function(){ 
      var o = returnProjectCreateDetails();
      if (!o) return;
      localStorage.setItem('projectnew', JSON.stringify(o));
    }, 30000);
  },
  'click #create_campaign': function(e) {
    e.preventDefault();
    var o = returnProjectCreateDetails({showDialog: true});
    if (!o) return;

    // create virtual account for project
    // add funds to virtual account, non-refundable
    console.log('call addProject')
    $('#preloader').show()
    Meteor.call('addProject', o, function(err, res) {
      $('#preloader').hide()
      vex.dialog.alert(err||res||'there was an error, please try again');
      if (res) {
        localStorage.removeItem('projectnew')
        localStorage.removeItem('projectnew_banner')
        $('#resetNewProjCacheBtn').hide()
        try { clearInterval(autoSaveNewProjInterval); } catch(e) {}
        setTimeout(function() {
          Router.go('Home');
        }, 4181);
      }
    });
  },
  'change #banner_file': function (e, template) {
      if (e.currentTarget.files && e.currentTarget.files[0]) {
        osettings.banner = {};
        
        var files = e.target.files;
        osettings.banner.file = files[0];

        if (osettings.banner.file.type.indexOf("image")==-1) {
          vex.dialog.alert('Invalid File, you can only upload a static image for your profile picture');
          return;
        };

        return setNewProjectBanner(osettings.banner.file);
      }
  },
  'change #category': function() {
    var cat = $('#category').val();
    var selectOptionsGenre = getSelectedGenresOptions()
    var meta = selectOptionsGenre.meta[cat];
    if (meta) {
      var opts = selectOptionsGenre[meta];
      /** show genres, update opts */
      $('#genre')
      .find('option')
      .remove()
      .end()
      .append(opts)
      $('#hide_genre').hide()
      $('#hidden_genre').show();
    } else {
      /** hide genres */
      $('#hidden_genre').hide();
      $('#hide_genre').show()
    }
  },
  'change #gift_file': function (e, template) {
      if (e.currentTarget.files && e.currentTarget.files[0]) {
        osettings.giftImage = {};
        var reader = new FileReader();
        var files = e.target.files;
        var file = files[0];
        if (file.type.indexOf("image")==-1) {
          vex.dialog.alert('Invalid File, you can only upload a static image for your sales item');
          return;
        };
        reader.onload = function(readerEvt) {
            osettings.giftImage.data = readerEvt.target.result;
            /** set file.name to span of inner el */
            $('#gift_file_name').text(file.name);
            $('#hidden_gift_name').show();
        }; 
        reader.readAsDataURL(file);
      }
  },
  'input #gift-title': function() {$('#add-gift').removeClass('btn'), $('#add-gift').removeClass('disabled') },
  'input #needs-description': function() {$('#add-needs').removeClass('btn'), $('#add-needs').removeClass('disabled') },
  'input #crew-title': function() { $('#add-crew').removeClass('btn'), $('#add-crew').removeClass('disabled') },
  'input #cast-title': function() { $('#add-cast').removeClass('btn'), $('#add-cast').removeClass('disabled') },
  'input #social-title': function() { $('#add-social').removeClass('btn'), $('#add-social').removeClass('disabled') },
  'click #add-crew': function(e) {
    e.preventDefault();
    $('#crewtabletoggle').show()
    var title = $('#crew-title').val(), 
        description = $('#crew-description').val(), 
        audition = $('#crew-audition').val() || 'N/A',
        consideration = $('.crew_consideration:checked').map(function(a) { return $(this).val() }).get(),
        pay_offer = $('#oshchx_crew').val()||0,
        status = 'needed';
    $('#oshchx_crew').val('')
    positions.crew = positions.crew || []
    var o = {
      title: title,
      description: description,
      audition: audition,
      consideration: consideration,
      pay_offer: pay_offer
    }
    positions.crew.push(o)
    if (!consideration.length) return vex.dialog.alert('You must select at least one consideration / offer type for this role.');
    var payIcons = consideration.map(function(c) { return consideration_icons[c] })
    if (title && description && status) $('#crew-table').append('<tr class="crew-val"><td>'+title+'</td><td>'+description+'<br><small>eligible for:&nbsp;</small>'+payIcons.join(' ')+'</td><td>'+audition+'</td><td><button class="deleteRow button special" ctx="crew" val=\''+JSON.stringify(o)+'\'>X</button></td></tr>');
    $('.deleteRow').off();
    $('.deleteRow').on('click', deleteRow);
    $('#crew-title').val(''), 
    $('#crew-description').val(''),
    $('#crew-audition').val(''), 
    $("#crew-radio-needed").prop("checked", true);
  },
  'click #add-cast': function(e) {
    e.preventDefault();
    $('#casttabletoggle').show()
    var title = $('#cast-title').val(), 
        description = $('#cast-description').val(), 
        audition = $('#cast-audition').val() || 'N/A',
        consideration = $('.cast_consideration:checked').map(function(a) { return $(this).val() }).get(),
        pay_offer = $('#oshchx_cast').val()||0,
        status = 'needed';
    $('#oshchx_cast').val('')
    var o = {
      title: title,
      description: description,
      audition: audition,
      consideration: consideration,
      pay_offer: pay_offer
    }
    positions.cast = positions.cast || []
    positions.cast.push(o)
    if (!consideration.length) return vex.dialog.alert('You must select at least one consideration / offer type for this role.');
    var payIcons = consideration.map(function(c) { return consideration_icons[c] })
    if (title && description && status) $('#cast-table').append('<tr class="cast-val"><td>'+title+'</td><td>'+description+'<br><small>eligible for:&nbsp;</small>'+payIcons.join(' ')+'</td><td>'+audition+'</td><td><button class="deleteRow button special" ctx="cast" val=\''+JSON.stringify(o)+'\'>X</button></td></tr>');
    $('.deleteRow').off();
    $('.deleteRow').on('click', deleteRow);
    $('#cast-title').val(''), 
    $('#cast-description').val(''), 
    $('#cast-audition').val(''), 
    $("#cast-radio-needed").prop("checked", true);
  },
  'click #add-needs': function(e) {
    e.preventDefault();
    positions.needs = positions.needs || []
    var o = {
      category: $('#needs-category').val(),
      description: $('#needs-description').val()
    }
    if (!o.category) return;
    positions.needs.push(o)
    $('#needstabletoggle').show()
    $('#needs-table').append('<tr class="needs-val"><td>'+o.category+'</td><td>'+o.description+'</td><td><button class="deleteRow button special">X</button></td></tr>');
    $('.deleteRow').off();
    $('.deleteRow').on('click', deleteRow);
    $("#needs-category").val($("#needs-category option:first").val()), $('#needs-description').val(''), $('#needs-quantity').val('');
  },
  'click #add-social': function(e) {
    e.preventDefault();
    $('#display_link_data').show()
    var title = $('#social-title').val(), url = $('#social-url').val();
    if (title && url) $('#social-table').append('<tr class="social-val"><td>'+title+'</td><td>'+url+'</td><td><button class="deleteRow button special">X</button></td></tr>');
    $('.deleteRow').on('click', deleteRow);
    $('#social-title').val(''), $('#social-url').val('');
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
      o.quantity = {all: $('#oneoff').val()||1}
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



    gifts.push(o);
    // console.log(gifts)
    appendCampaignMerchTable(o);
    $('#newProjFormMerch')[0].reset()
  },
  'click .login': function(e){
    e.preventDefault();
    localStorage.setItem('redirectURL', '/create');
    lock.show();
  }
});