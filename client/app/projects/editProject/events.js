Template.editProject.events({
  'click #cast_oshx': function(e) {
    var val = $(e.target).attr('val')
    if (val==='skip') return;
      if ($(e.target).prop('checked')) {
        $('#cast_pay_amounth').show()
      } else {
        $('#cast_pay_amounth').hide()
      }
  },
  'click #crew_oshx': function(e) {
    var val = $(e.target).attr('val')
    if (val==='skip') return;
      if ($(e.target).prop('checked')) {
        $('#crew_pay_amounth').show()
      } else {
        $('#crew_pay_amounth').hide()
      }
  },
  'click #file_gift': function(e) {
    $('#gift_file').click();
  },
  'click .bread_show_resources': function(e) {
    $('.show_resources_toggle').hide()
    $('.bread_show_resources').removeClass('bold')
    $(e.target).addClass('bold')
    var v= $(e.target).attr('val')
    var id = '#show_options_' + v
    $(id).show()
    $('#show_options_crew2').text($(e.target).attr('aux'))
  },
  'click .camp_show_resources': function(e) {
    $('.camp_resources_toggle').hide()
    $('.camp_show_resources').removeClass('bold')
    $(e.target).addClass('bold')
    var v= $(e.target).attr('val')
    var id = '#' + v
    $(id).show()
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
      $('#hidden_genre').show();
    } else {
      /** hide genres */
      $('#hidden_genre').hide();
    }
  },
  'change #banner_file': function (e, template) {
    if (e.currentTarget.files && e.currentTarget.files[0]) {
      var osettings = getOSettings()
      osettings.banner = {};
      
      var files = e.target.files;
      osettings.banner = osettings.banner||{}
      osettings.banner.file = files[0];

      if (osettings.banner.file.type.indexOf("image")==-1) {
        vex.dialog.alert('Invalid File, you can only upload a static image for your profile picture');
        return;
      };

      setOSettings(osettings)

      return setNewProjectBanner(osettings.banner.file);
    }
  },
  'click #showbudget': function(e) {
    e.preventDefault();
    showVexBudgetForm();
  },
  'click #update_campaign': function(e) {
    e.preventDefault();
    $('.addingstatus').hide()
    var o = returnProjectCreateDetails({slug: currentSlug});
    Meteor.call('editProject', o);
    vex.dialog.alert("Project updated!");
  },
  'change #gift_file': function (e, template) {
      if (e.currentTarget.files && e.currentTarget.files[0]) {
        var osettings = getOSettings()
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
            setOSettings(osettings)

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
    statusShowAddedResource()
    $('#crewtabletoggle').show()
    var title = $('#crew-title').val(), 
        description = $('#crew-description').val(), 
        audition = $('#crew-audition').val() || 'N/A',
        consideration = $('.crew_consideration:checked').map(function(a) { return $(this).val() }).get(),
        pay_offer = $('#oshchx_crew').val()||0,
        status = 'needed';
    $('#oshchx_crew').val('')
    var positions = getPositions()
    positions.crew = positions.crew || []
    var o = {
      title: title,
      description: description,
      audition: audition,
      consideration: consideration,
      pay_offer: pay_offer
    }
    
    if (!consideration.length) return vex.dialog.alert('You must select at least one consideration / offer type for this role.');
    positions.crew.push(o)
    setPositions(positions)
    Session.set('crew', positions.crew)
    $('#newCrewForm')[0].reset()
    $('#update_campaign').click()
    // var payIcons = consideration.map(function(c) { return consideration_icons[c] })
    // if (title && description && status) $('#crew-table').append('<tr class="crew-val"><td>'+title+'</td><td>'+description+'<br><small>eligible for:&nbsp;</small>'+payIcons.join(' ')+'</td><td>'+audition+'</td><td><button class="deleteRow button special" ctx="crew" val=\''+JSON.stringify(o)+'\'>X</button></td></tr>');
    // $('.deleteRow').off();
    // $('.deleteRow').on('click', deleteRow);
    // $('#crew-title').val(''), 
    // $('#crew-description').val(''),
    // $('#crew-audition').val(''), 
    // $("#crew-radio-needed").prop("checked", true);
  },
  'click #add-cast': function(e) {
    e.preventDefault();
    statusShowAddedResource()
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
    var positions = getPositions()
    positions.cast = positions.cast || []
    
    if (!consideration.length) return vex.dialog.alert('You must select at least one consideration / offer type for this role.');

    positions.cast.push(o)
    setPositions(positions)
    Session.set('cast', positions.cast)

    $('.deleteRow').off();
    $('.deleteRow').on('click', deleteRow);

    $('#newCastForm')[0].reset()
    $('#update_campaign').click()
    // var payIcons = consideration.map(function(c) { return consideration_icons[c] })
    // if (title && description && status) $('#cast-table').append('<tr class="cast-val"><td>'+title+'</td><td>'+description+'<br><small>eligible for:&nbsp;</small>'+payIcons.join(' ')+'</td><td>'+audition+'</td><td><button class="deleteRow button special" ctx="cast" val=\''+JSON.stringify(o)+'\'>X</button></td></tr>');
    
    // $('#cast-title').val(''), 
    // $('#cast-description').val(''), 
    // $('#cast-audition').val(''), 
    // $("#cast-radio-needed").prop("checked", true);
  },
  'click #add-needs': function(e) {
    e.preventDefault();
    statusShowAddedResource()
    $('#needstabletoggle').show()
    var positions = getPositions()
    positions.needs = positions.needs||[]
    positions.needs.push({
      category: $('#needs-category').val(),
      description: $('#needs-description').val()
    })
    setPositions(positions)
    $('.deleteRow').off().on('click', deleteRow);

    Session.set('needs', positions.needs)

    $('#newNeedsForm')[0].reset()
    $('#update_campaign').click()


    // var cat = , description = ;
    // if (cat.toLowerCase().indexOf('category')>-1) return;
    // if (cat && description) $('#needs-table').append();
    // $('.deleteRow').off();
    // $('.deleteRow').on('click', deleteRow);
    // $("#needs-category").val($("#needs-category option:first").val()), $('#needs-description').val(''), $('#needs-quantity').val('');
  },
  'click #add-social': function(e) {
    e.preventDefault();
    $('#display_link_data').show()
    var positions = getPositions()
    positions.social = positions.social || []
    positions.social.push({
      name: $('#social-title').val(),
      address: $('#social-url').val()
    })
    setPositions(positions)
    Session.set('social', positions.social)
    $('#newSocialForm')[0].reset()
    // $('#update_campaign').click()
    // if (title && url) $('#social-table').append('<tr class="social-val"><td>'+title+'</td><td>'+url+'</td><td><button class="deleteRow button special">X</button></td></tr>');
    // $('.deleteRow').on('click', deleteRow);
    // $('#social-title').val(''), $('#social-url').val('');
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
    var osettings = getOSettings()
    $('#merchtabletoggle').show()
    var o = {};
    o.name = $('#gift-title').val(), o.description = $('#gift-description').val(), o.msrp = parseFloat($('#gift-msrp').val());
    if (!o.name || Number.isFinite(o.msrp) === false || o.msrp < 1) return alert('please correct the name or price information to continue');
    if (osettings.giftImage&&osettings.giftImage.data) o.data = osettings.giftImage.data;
    else o.url = 'https://s3-us-west-2.amazonaws.com/producehour/placeholder_gift.jpg';
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
    var gifts = getGifts()
    gifts.push(o);
    setGifts(gifts)
    setOSettings(osettings)
    // console.log(gifts)
    appendCampaignMerchTable(o);
    
    $('#gift-title').val(''), $('#gift-description').val(''), $('#gift-quantity').val(''), $('#gift-msrp').val('');
    /** set file.name to span of inner el */
    $('#gift_file_name').text('');
    $('#merch_handling').val('');
    $('#merch_disclaimer').val('');
    $('.merch_quantity').val('');
    $('#oneoff').val('');
    $('.apparelsize:checkbox:checked').each(function(idx, el){ return $(el).prop("checked", false);})
    $('#hidden_gift_name').hide();

    $('#update_campaign').click()
  },
});