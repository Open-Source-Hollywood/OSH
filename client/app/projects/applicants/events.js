Template.applicants.events({
  'click .res_show_resources': function(e) {
    $('.resources_view_toggle').hide()
    $('.res_show_resources').removeClass('bold')
    $(e.target).addClass('bold')
    var v= $(e.target).attr('val')
    var id = '#' + v
    $(id).show()
  },
  'click .view_offer': function(e) {
    var was = this;
    vex.dialog.open({
      message: 'Details of the offer.',
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
              '<div class="vex-custom-input-wrapper">',
                  '<div class="container"> <div class="row d-flex justify-content-center"> <div class="col-md-5"> <div class="main-profile"> <div class="profile-header"> <img class="img-responsive img-thumbnail margin_bottom20" src="'+was.user.avatar+'" alt="'+was.user.name+'" style="max-height: 120px;max-width: 120px;"> <p class="align-center">Position: '+was.position+'</p> </div><div class="col col-xs-12"> <p class="align-center">'+was.message+' for '+ ((was.amount===0) ? 'no pay (time donation).' : (was.type==='hired') ? '$' + was.amount + ' requested pay.' : '$' + was.amount + ' donation offer.') +'</p></div></div></div></div></div>',
              '</div>',
          '</div>'
      ].join(''),
      callback: function (data) { }
    });
  }
});