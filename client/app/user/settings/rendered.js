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