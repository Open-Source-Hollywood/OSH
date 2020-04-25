var donationObject = {};
var currentSlug, currentTitle, currentProject, me;

var gifts = [];
var osettings = {};
var positions = {};
var consideration_icons = {
  pay: '<i class="glyphicon glyphicon-star"></i>',
  escrow: '<i class="glyphicon glyphicon-usd"></i>',
  time: '<i class="glyphicon glyphicon-time"></i>'
}

var selectOptionsGenre = {
  meta: {
    Feature: 'mixed',
    Short: 'mixed',
    Series: 'mixed',
    Sketch: 'mixed',
    Animation: 'mixed',
    'Live Performance': 'performance',
    Writing: 'writing',
    'Art & Illustrations': 'art',
    Musical: 'audio',
    Podcast: 'podcast',
    Other: 'all'
  },
  art: '<option val="Advertising">Advertising</option><option val="Book Cover">Book Cover</option><option val="Album Art">Album Art</option><option val="Cartoon">Cartoon</option><option val="Comics">Comics</option><option val="Concept Art">Concept Art</option><option val="Poster">Poster</option><option val="Classical Painting">Classical Painting</option><option val="Classical Sculpting">Classical Sculpting</option><option val="Other">Other</option>',
  writing: '<option val="Tragedy">Tragedy</option><option val="Comedy">Comedy</option><option val="Fantasy">Fantasy</option><option val="Adventure">Adventure</option><option val="Mystery">Mystery</option><option val="Graphic Novel">Graphic Novel</option><option val="Satire">Satire</option><option val="Childrens">Childrens</option><option val="Poetry">Poetry</option><option val="Other">Other</option>',
  mixed: '<option val="Drama">Drama</option><option val="Comedy">Comedy</option><option val="Documentary">Documentary</option><option val="Educational">Educational</option><option val="Game Show">Game Show</option><option val="Music Video">Music Video</option><option val="Musical">Musical</option><option val="Reality">Reality</option><option val="News">News</option><option val="Sports">Sports</option><option val="Variety">Variety</option><option val="Kids">Kids</option><option val="Cooking">Cooking</option><option val="Other">Other</option>',
  audio: '<option val="Folk">Folk</option><option val="Classical">Classical</option><option val="Contemporary">Contemporary</option><option val="Soul">Soul</option><option val="Jazz">Jazz</option><option val="Rock">Rock</option><option val="Metal">Metal</option><option val="Pop">Pop</option><option val="Hip Hop">Hip Hop</option><option val="EDM">EDM</option><option val="Other">Other</option>',
  performance: '<option val="Ballet">Ballet</option><option val="Opera">Opera</option><option val="Dance">Dance</option><option val="Theater">Theater</option><option val="Other">Other</option>',
  podcast: '<option val="Comedy">Comedy</option><option val="Culture">Culture</option><option val="Politics">Politics</option><option val="Arts">Arts</option><option val="Technology">Technology</option><option val="Other">Other</option>',
  all: function() {
    var acc = [selectOptionsGenre['art'], selectOptionsGenre['writing'], selectOptionsGenre['mixed'], selectOptionsGenre['audio'], selectOptionsGenre['performance'], selectOptionsGenre['podcast']].join('').split('</option>')
    var agg = []
    acc.forEach(function(a) {
      if (agg.indexOf(a)===-1) agg.push(a);
    })
    return agg.sort().join('</option>')
  }
}

resetProjectVars = function() {
  donationObject = {}
  gifts = []
  osettings = {}
  positions = {}
}

getOSettings = function() {
  return osettings
}

setOSettings = function(o) {
  osettings = o
}

getPositions = function() {
  return positions
}

setPositions = function(p) {
  positions = p
}

getGifts = function() {
  return gift
}

setGifts = function(g) {
  gift = g
}

getSelectedGenresOptions = function() {
  return selectOptionsGenre
}

summernoteRenderFromSave = function() {
  console.log('summernoteRenderFromSave')
  gifts = []
  osettings = {}
  osettings.banner = {}
  osettings.giftImage = {}
  positions = {}
  initSummernote(function() {
      try {
        var newProject = JSON.parse(localStorage.getItem('projectnew'));
        if (!newProject) {
          $('#resetNewProjCacheBtn').hide()
          return
        };
        if (newProject.videoExplainer) $('#video_explainer').val(newProject.videoExplainer);
        if (newProject.category) $("#category option[value='"+newProject.category+"']").prop('selected', true).trigger('change');
        if (newProject.zip) $('#location').val(newProject.zip);
        if (newProject.title&&newProject.title!=='untitled') $('#title').val(newProject.title);
        if (newProject.logline&&newProject.logline!=='eligible for support') $('#logline').val(newProject.logline);
        if (newProject.genre) $("#genre option[value='"+newProject.genre+"']").prop('selected', true);
        if (newProject.website) $('#website').val(newProject.website);
        if (newProject.production_company) $('#prodorg').val(newProject.production_company);
        if (newProject.description) {
          $('#summernote').summernote('reset')
          $('#summernote').summernote('pasteHTML', newProject.description);
        }
        if (newProject.gifts&&newProject.gifts.length) {
          gifts = newProject.gifts;
          newProject.gifts.forEach(function(g) {
            appendCampaignMerchTable(g);
          });
        };
        if (newProject._banner||newProject.banner) {
          (function() {
            var filename = newProject.bannerFileName;
            if (!filename||filename===null||filename.toLowerCase()==='this is the name of the file uploaded') return;
            $('#banner_file_name').text(filename);
            $('#hidden_banner_name').show();
          }())
        };

        if (newProject.author_list) $('#authorlist').val(newProject.author_list);
        if (newProject.description) $('#summernote').summernote('code', newProject.description);
        if (newProject.creatorsInfo) $('#creators_info').val(newProject.creatorsInfo);
        if (newProject.historyInfo) $('#history_info').val(newProject.historyInfo);
        if (newProject.plansInfo) $('#plans_info').val(newProject.plansInfo);
        if (newProject.needsInfo) $('#needs_info').val(newProject.needsInfo);
        if (newProject.significanceInfo) $('#significance_info').val(newProject.significanceInfo);
        osettings.rawbudget = newProject.rawbudget||null;
        if (newProject.crew&&newProject.crew.length) {
          newProject.crew.forEach(function(c) {
            $('#crew-table').append('<tr class="crew-val"><td>'+c.title+'</td><td>'+c.description+'</td><td>'+c.audition+'</td><td><button class="deleteRow button special">X</button></td></tr>');
          });
          $('#newProjCrewAccord').removeClass('krown-accordion');
          $('#crewtabletoggle').show()
        };

        if (newProject.cast&&newProject.cast.length) {
          newProject.cast.forEach(function(c) {
            $('#cast-table').append('<tr class="cast-val"><td>'+c.title+'</td><td>'+c.description+'</td><td>'+c.audition+'</td><td><button class="deleteRow button special">X</button></td></tr>');
          });
          $('#newProjCastAccord').removeClass('krown-accordion');
          $('#casttabletoggle').show()
        };

        if (newProject.needs&&newProject.needs.length) {
          newProject.needs.forEach(function(n) {
            $('#needs-table').append('<tr class="needs-val"><td>'+n.category+'</td><td>'+n.description+'</td><td><button class="deleteRow button special">X</button></td></tr>');
          });
          $('#newProjNeedsAccord').removeClass('krown-accordion');
          $('#needstabletoggle').show()
        };

        if (newProject.social&&newProject.social.length) {
          newProject.social.forEach(function(s) {
            $('#social-table').append('<tr class="social-val"><td>'+s.name+'</td><td>'+s.address+'</td><td><button class="deleteRow button special">X</button></td></tr>');
          });
          $('#newproj_social_accord').removeClass('krown-accordion');
          $('#display_link_data').show()
        };

        if (newProject._gifts&&newProject._gifts.length) {
          newProject._gifts.forEach(function(g) {
            appendCampaignMerchTable(g);
          });
          $('#newProjGiftAccord').removeClass('krown-accordion');
        };

        /**
          1) test
          2) add budget
          3) add equity info
         */

        
        $('.deleteRow').off();
        $('.deleteRow').on('click', deleteRow);

      } catch(e) {
        console.log(e)
      } 
  })
}

summernoteRenderFromProj = function(currentProject) {
  if (!currentProject) return
  $('.deleteRow').on('click', deleteRow);
  positions = {};
  initSummernote(function() {
    try {
      if (currentProject.videoExplainer) $('#video_explainer').val(currentProject.videoExplainer);
      if (currentProject.category) $("#category option[value='"+currentProject.category+"']").prop('selected', true).trigger('change');
      if (currentProject.zip) $('#location').val(currentProject.zip);
      if (currentProject.title&&currentProject.title!=='untitled') $('#title').val(currentProject.title);
      if (currentProject.logline&&currentProject.logline!=='eligible for support') $('#logline').val(currentProject.logline);
      if (currentProject.genre) $("#genre option[value='"+currentProject.genre+"']").prop('selected', true);
      if (currentProject.phase) $('#phase').val(currentProject.phase);
      if (currentProject.website) $('#website').val(currentProject.website);
      if (currentProject.production_company) $('#prodorg').val(currentProject.production_company);
      if (currentProject.description) {
        $('#summernote').summernote('reset')
        $('#summernote').summernote('pasteHTML', currentProject.description)
      }
      if (currentProject.gifts&&currentProject.gifts.length) {
        gifts = currentProject.gifts;
        currentProject.gifts.forEach(function(g) {
          appendCampaignMerchTable(g);
        });
        $('#merchtabletoggle').show()
      };
      osettings.rawbudget = currentProject.rawbudget||null;
      if (currentProject._banner||currentProject.banner) {
        (function() {
          var filename = currentProject&&currentProject.bannerFileName||null;
          if (!filename||filename===null||filename.toLowerCase()==='this is the name of the file uploaded') return;
          $('#banner_file_name').text(filename);
          $('#hidden_banner_name').show();
        }())
      };
      if (currentProject.author_list) $('#authorlist').val(currentProject.author_list);
      if (currentProject.description) $('#summernote').summernote('code', currentProject.description);
      if (currentProject.creatorsInfo) $('#creators_info').val(currentProject.creatorsInfo);
      if (currentProject.historyInfo) $('#history_info').val(currentProject.historyInfo);
      if (currentProject.plansInfo) $('#plans_info').val(currentProject.plansInfo);
      if (currentProject.needsInfo) $('#needs_info').val(currentProject.needsInfo);
      if (currentProject.significanceInfo) $('#significance_info').val(currentProject.significanceInfo);

      positions.crew = currentProject.crew||[]
      Session.set('crew', positions.crew)
      if (positions.crew.length) $('#crewtabletoggle').show();

      positions.cast = currentProject.cast||[]
      Session.set('cast', positions.cast)
      if (positions.cast.length) $('#casttabletoggle').show();

      positions.needs = currentProject.needs||[]
      Session.set('needs', positions.needs)
      
      if (positions.needs.length) $('#needstabletoggle').show();

      positions.social = currentProject.social||[]
      Session.set('social', positions.social)
      if (positions.social.length) $('#display_link_data').show()

      /**
        1) test
        2) add budget
        3) add equity info
       */

      
      $('.deleteRow').off();
      $('.deleteRow').on('click', deleteRow);

    } catch (e) {
      console.log(e)
    }

    })
}

appendCampaignMerchTable = function (o) {
  var tblRow = [
    '<tr class="gift-val">',
      '<td>'+o.name+'</td>',
      '<td>'+o.type+'</td>',
      '<td>'+o.description+'</td>',
      '<td>'
  ];
  
  if (o.secondaryData) tblRow.push('<strong><small>DATA:</small></strong>&nbsp;'+o.secondaryData);
  if (o.disclaimer) tblRow.push('<br><strong><small>DISCLAIMER:</small></strong>&nbsp;'+o.disclaimer);
  tblRow = tblRow.concat([
    '</td>',
      '<td>'+o.msrp+'</td>',
      '<td><button class="removeGift button special">X</button></td></tr>'
  ]);
  $('#gift-table').append(tblRow.join(''));
  $('.removeGift').off();
  $('.removeGift').on('click', removeGift);
  $('#merchtabletoggle').show()
}

setNewProjectBanner = function (file) {
  var reader = new FileReader();
  reader.onload = function(readerEvt) {
    osettings.banner.data = readerEvt.target.result;

    /** set file.name to span of inner el */
    $('#banner_file_name').text(file.name);
    $('#hidden_banner_name').show();
  }; 
  reader.readAsDataURL(file);
}

returnProjectCreateDetails = function (o) {
  o = o || {};

  o.phase = $('#phase').val()


  // (1) check video sanity
  /** 
      check youtube / vimeo format
      /^https:\/\/vimeo.com\/[\d]{8,}$/
      https://vimeo.com/262118158
      /^https:\/\/youtu.be\/[A-z0-9]{9,}$/
      https://youtu.be/cWjz9pB70vc
    */
  o.videoExplainer = $('#video_explainer').val();
  if (o.videoExplainer) {
    var vimeo = /^https:\/\/vimeo.com\/[\d]{8,}$/;
    var youtube = /^https:\/\/youtu.be\/[A-z0-9]{9,}$/;
    if (o.showDialog&&!vimeo.test(o.videoExplainer)&&!youtube.test(o.videoExplainer)) {
      vex.dialog.alert('your video URL link is invalid, please select the question mark for help, correct the mistake and try again or contact us');
      return null;
    }
    if (o.videoExplainer.indexOf('vimeo')>-1) {
      var patternMatch = /^https:\/\/vimeo.com\/([\d]{8,}$)/;
      var videoID = o.videoExplainer.match(patternMatch)[1];
      o.videoExplainer = 'https://player.vimeo.com/video/' + videoID + '?autoplay=0&loop=1&autopause=0';
    } else {
      try {
        var patternMatch = /^https:\/\/youtu.be\/([A-z0-9]{9,}$)/;
        var videoID = o.videoExplainer.match(patternMatch)[1];
        o.videoExplainer = 'https://www.youtube.com/embed/' + videoID;
      } catch(e) { };
    };
  };

  // (2) remove default category value
  o.category = $('#category').val();
  // if (o.category.indexOf('Format')>-1) return vex.dialog.alert('Please select a valid category and genre.');

  // (3) check location and continue
  o.zip = $('#location').val() && $('#location').val().replace(' ', '') || '';
  o.address = $('#address').val();
  o.title = $('#title').val() || 'untitled';
  o.logline = $('#logline').val() || 'eligible for support';
  o.genre = $('#genre').find(":selected").text();
  o.production_company = $('#prodorg').val();
  o.author_list = $('#authorlist').val();
  o._gifts = gifts;
  o.website = $('#website').val();
  o.rawbudget = osettings.rawbudget
  delete osettings['rawbudget']

  try {
    var descriptionHTML = $('#summernote').summernote('code').replace(/(<script.*?<\/script>)/g, '');
    var plainText = descriptionHTML
      .replace(/&nbsp;|<br>/g, "\n")
      .replace(/<\/p>/gi, " ")
      .replace(/<\/?[^>]+(>|$)/g, "")
      .trim();

    if (plainText && plainText.indexOf('your campaign description here.')===-1) {
      o.description = descriptionHTML;
      o.descriptionText = plainText;
    } else {
      o.description = '';
    };
  } catch(e){
    // console.log(new Array(100).join('iii '))
    // console.log(e)
  }

  o.creatorsInfo = $('#creators_info').val();
  o.historyInfo = $('#history_info').val();
  o.plansInfo = $('#plans_info').val();
  o.needsInfo = $('#needs_info').val();
  o.significanceInfo = $('#significance_info').val();
  
  if (osettings.banner&&osettings.banner.data) {
    o._banner = osettings.banner.data;
    o.bannerFileName = osettings.banner.file.name
  }
  else o.banner = 'https://s3-us-west-2.amazonaws.com/producehour/placeholder_banner.jpg';
  
  var crew = $('.crew-val'); 
  o.crew = positions.crew||[];

  var cast = $('.cast-val');
  o.cast = positions.cast||[];

  var needs = $('.needs-val');
  o.needs = positions.needs||[];

  var social = $('.social-val');
  o.social = [];
  social.each(function(i, el) {
    var _o = {};
    var arr = $(el).children('td');
    _o.name = $(arr[0]).text();
    _o.address = $(arr[1]).text();
    o.social.push(_o);
  });

  /** budget info */
  var budgetSheet = localStorage.getItem('budget');
  if (budgetSheet) {
    o.budgetSheet = JSON.parse(budgetSheet);
    o.budget = parseInt($('#budget').val());
    o.funded = parseInt($('#starting').val());
    localStorage.removeItem('budget');
  };

  /** equity info */
  var equityInfo = localStorage.getItem('revshare');
  if (equityInfo) {
    o.equityInfo = JSON.parse(equityInfo);
    o.totalShares = o.availableShares = parseFloat($('#assign').val()) * 100;
    o.mpps = parseInt($('#minimumassign').val()||1);
    o.assignmentLife = $('.assignment_length:checked').val();
    localStorage.removeItem('revshare');
  };

  console.log(o)
  delete o['showDialog'];
  return o;
}

validateUrl = function (value) {
  return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value);
}

deleteRow = function (e) {
  e.preventDefault();
  var ctx = $(e.target).attr('ctx')
  if (ctx) {
    try {
      var idx = $($(this).closest('tr')).index();
  
      var val = JSON.parse($(e.target).attr('val'))

      if (ctx==='crew') {
        positions.crew.splice(idx, 1);
      };

      if (ctx==='cast') {
        positions.cast.splice(idx, 1);
      };
    } catch(e) {}
  };

  $(this).closest('tr').remove();
}

removeGift = function (e) {
  e.preventDefault();
  var idx = $($(this).closest('tr')).index();
  gifts.splice(idx, 1);
  $(this).closest('tr').remove();
}

showVexBudgetForm = function () {
  var raw = osettings.rawbudget||{};
  vex.dialog.open({
    message: 'BUDGET FORM',
    input: [
      '<h4 class="title">Fill out the budget form to help define your budget. Whole dollar amounts only please.</h4>',
      '<div class="embed-responsive embed-responsive-4by3" style="overflow: auto;height: auto;">',
        '<div class="panel-default">',
          '<div class="panel-heading">GENERAL COSTS</div>',
          '<div class="panel-body">',
            '<div class="col-sm-12 col-md-6">',
                '<label for="dev_cost"> development cost </label>',
                '<input type="number" class="budgetform" name="dev_cost" id="dev_cost" min="0" value="' + (raw.dev_cost ? raw.dev_cost : 0) +'" />',
            '</div>',
            '<div class="col-sm-12 col-md-6">',
                '<label for="insurance_cost"> insurance costs </label>',
                '<input type="number" class="budgetform" name="insurance_cost" id="insurance_cost" min="0" value="' + (raw.insurance_cost ? raw.insurance_cost : 0) +'" />',
            '</div>',
            '<div class="col-sm-12 col-md-6">',
                '<label for="legal_cost"> legal &amp; accounting </label>',
                '<input type="number" class="budgetform" name="legal_cost" id="legal_cost" min="0" value="' + (raw.legal_cost ? raw.legal_cost : 0) +'" />',
            '</div>',
            '<div class="col-sm-12 col-md-6">',
                '<label for="travel_cost"> travel, meetings </label>',
                '<input type="number" class="budgetform" name="travel_cost" id="travel_cost" min="0" value="' + (raw.travel_cost ? raw.travel_cost : 0) +'" />',
            '</div>',
            '<div class="col-sm-12 col-md-6">',
                '<label for="food_cost"> food </label>',
                '<input type="number" class="budgetform" name="food_cost" id="food_cost" min="0" value="' + (raw.food_cost ? raw.food_cost : 0) +'" />',
            '</div>',
            '<div class="col-sm-12 col-md-6">',
                '<label for="supplied_cost"> office supplies </label>',
                '<input type="number" class="budgetform" name="supplied_cost" id="supplied_cost" min="0" value="' + (raw.supplied_cost ? raw.supplied_cost : 0) +'" />',
            '</div>',
            '<div class="col-sm-12 col-md-6">',
                '<label for="starting_budget"> starting budget </label>',
                '<input type="number" class="budgetform" name="starting_budget" id="starting_budget" min="0" value="' + (raw.starting_budget ? raw.starting_budget : 0) +'" />',
            '</div>',
            '<div class="col-sm-12 col-md-6">',
                '<label for="misc_gen_cost"> miscellaneous </label>',
                '<input type="number" class="budgetform" name="misc_gen_cost" id="misc_gen_cost" min="0" value="' + (raw.misc_gen_cost ? raw.misc_gen_cost : 0) +'" />',
            '</div>',
          '</div>',
        '</div>',
        '<div class="panel-default">',
          '<div class="panel-heading">PRODUCTION COSTS</div>',
          '<div class="panel-body">',
            '<div class="col-sm-12 col-md-6">',
                '<label for="staff_cost"> staff </label>',
                '<input type="number" class="budgetform" name="staff_cost" id="staff_cost" min="0" value="' + (raw.staff_cost ? raw.staff_cost : 0) +'" />',
            '</div>',
            '<div class="col-sm-12 col-md-6">',
                '<label for="extras_cost"> extras </label>',
                '<input type="number" class="budgetform" name="extras_cost" id="extras_cost" min="0" value="' + (raw.extras_cost ? raw.extras_cost : 0) +'" />',
            '</div>',
            '<div class="col-sm-12 col-md-6">',
                '<label for="wardrobe_cost"> wardrobe </label>',
                '<input type="number" class="budgetform" name="wardrobe_cost" id="wardrobe_cost" min="0" value="' + (raw.wardrobe_cost ? raw.wardrobe_cost : 0) +'" />',
            '</div>',
            '<div class="col-sm-12 col-md-6">',
                '<label for="makeup_cost"> makeup &amp; hair </label>',
                '<input type="number" class="budgetform" name="makeup_cost" id="makeup_cost" min="0" value="' + (raw.makeup_cost ? raw.makeup_cost : 0) +'" />',
            '</div>',
            '<div class="col-sm-12 col-md-6">',
                '<label for="set_design_cost"> set design </label>',
                '<input type="number" class="budgetform" name="set_design_cost" id="set_design_cost" min="0" value="' + (raw.set_design_cost ? raw.set_design_cost : 0) +'" />',
            '</div>',
            '<div class="col-sm-12 col-md-6">',
                '<label for="set_construction_cost"> set construction </label>',
                '<input type="number" class="budgetform" name="set_construction_cost" id="set_construction_cost" min="0" value="' + (raw.set_construction_cost ? raw.set_construction_cost : 0) +'" />',
            '</div>',
            '<div class="col-sm-12 col-md-6">',
                '<label for="set_rigging_cost"> set rigging </label>',
                '<input type="number" class="budgetform" name="set_rigging_cost" id="set_rigging_cost" min="0" value="' + (raw.set_rigging_cost ? raw.set_rigging_cost : 0) +'" />',
            '</div>',
            '<div class="col-sm-12 col-md-6">',
                '<label for="operations_cost"> operations </label>',
                '<input type="number" class="budgetform" name="operations_cost" id="operations_cost" min="0" value="' + (raw.operations_cost ? raw.operations_cost : 0) +'" />',
            '</div>',
            '<div class="col-sm-12 col-md-6">',
                '<label for="gear_rental_cost"> gear rentals </label>',
                '<input type="number" class="budgetform" name="gear_rental_cost" id="gear_rental_cost" min="0" value="' + (raw.gear_rental_cost ? raw.gear_rental_cost : 0) +'" />',
            '</div>',
            '<div class="col-sm-12 col-md-6">',
                '<label for="gear_purchase_cost"> gear purchases </label>',
                '<input type="number" class="budgetform" name="gear_purchase_cost" id="gear_purchase_cost" min="0" value="' + (raw.gear_purchase_cost ? raw.gear_purchase_cost : 0) +'" />',
            '</div>',
            '<div class="col-sm-12 col-md-6">',
                '<label for="engineer_cost"> engineers </label>',
                '<input type="number" class="budgetform" name="engineer_cost" id="engineer_cost" min="0" value="' + (raw.engineer_cost ? raw.engineer_cost : 0) +'" />',
            '</div>',
            '<div class="col-sm-12 col-md-6">',
                '<label for="electric_cost"> electric </label>',
                '<input type="number" class="budgetform" name="electric_cost" id="electric_cost" min="0" value="' + (raw.electric_cost ? raw.electric_cost : 0) +'" />',
            '</div>',
            '<div class="col-sm-12 col-md-6">',
                '<label for="cloud_cost"> cloud services </label>',
                '<input type="number" class="budgetform" name="cloud_cost" id="cloud_cost" min="0" value="' + (raw.cloud_cost ? raw.cloud_cost : 0) +'" />',
            '</div>',
            '<div class="col-sm-12 col-md-6">',
                '<label for="soft_cost"> software purchases </label>',
                '<input type="number" class="budgetform" name="soft_cost" id="soft_cost" min="0" value="' + (raw.soft_cost ? raw.soft_cost : 0) +'" />',
            '</div>',
          '</div>',
        '</div>',
        '<div class="panel-default">',
          '<div class="panel-heading">POST-PRODUCTION COSTS</div>',
          '<div class="panel-body">',
            '<div class="col-sm-12 col-md-6">',
                '<label for="editing_cost"> editing </label>',
                '<input type="number" class="budgetform" name="editing_cost" id="editing_cost" min="0" value="' + (raw.editing_cost ? raw.editing_cost : 0) +'" />',
            '</div>',
            '<div class="col-sm-12 col-md-6">',
                '<label for="creative_writing_cost"> creative writing </label>',
                '<input type="number" class="budgetform" name="creative_writing_cost" id="creative_writing_cost" min="0" value="' + (raw.creative_writing_cost ? raw.creative_writing_cost : 0) +'" />',
            '</div>',
            '<div class="col-sm-12 col-md-6">',
                '<label for="marketing_cost"> marketing </label>',
                '<input type="number" class="budgetform" name="marketing_cost" id="marketing_cost" min="0" value="' + (raw.marketing_cost ? raw.marketing_cost : 0) +'" />',
            '</div>',
            '<div class="col-sm-12 col-md-6">',
                '<label for="misc_post_cost"> miscellaneous </label>',
                '<input type="number" class="budgetform" name="misc_post_cost" id="misc_post_cost" min="0" value="' + (raw.misc_post_cost ? raw.misc_post_cost : 0) +'" />',
            '</div>',
          '</div>',
        '</div>',
      '</div>',
    ].join(''),
    buttons: [
        $.extend({}, vex.dialog.buttons.YES, { text: 'Calculate' }),
        $.extend({}, vex.dialog.buttons.NO, { text: 'Close' }),
    ],
    callback: function (data) {
      osettings.rawbudget = data
      var costTally = 0;
      for (var key in data) {
        if (key === 'starting_budget') continue;
        costTally+=Math.abs(parseInt(data[key]));
      }
      if (costTally>0) {
        $('#budget').val(costTally);
        $('#starting').val(data.starting_budget||0);
        $('#hiddenbudget').show();
        localStorage.setItem('budget', JSON.stringify(data));  
      } else {
        $('#hiddenbudget').hide();
      }
    }
  });
}

showVexWithInput = function (message, input) {
  vex.dialog.open({
    message: message,
    input: input.join(''),
    buttons: [
        $.extend({}, vex.dialog.buttons.NO, { text: 'Close' })
    ]
  });
}

uniqueApplicantsFromProject = function (ctx, project) {

  var unique = []
  var uids = []

  var arr = (project['roleApplicants']||[]).concat(project['crewApplicants']||[])

  for (var i = arr.length - 1; i >= 0; i--) {
    var a = arr[i]
    if (uids.indexOf(a.user.id)>-1) {
      continue
    } else {
      unique.push(a)
      uids.push(a.user.id)
    }
  }

  return unique
}