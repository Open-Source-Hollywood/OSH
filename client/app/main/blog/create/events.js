var blogSettings = {};

Template.newBlog.onRendered(function() {
  blogSettings = {};
  blogSettings.banner = {};
  $(document).ready(function() {
    $('#summernote').summernote({
      toolbar: [
        // [groupName, [list of button]]
        ['style', ['clear', 'fontname', 'strikethrough', 'superscript', 'subscript', 'fontsize', 'color']],
        ['para', ['ul', 'ol', 'paragraph', 'style']],
        ['height', ['height']],
        ['misc', ['undo', 'redo']],
        ['insert', ['picture', 'table', 'hr']]
      ],
      height: 300,
      minHeight: null,
      maxHeight: null,
      focus: false,
      tooltip: false,
      callbacks: {
        onInit: function() {
          $('.note-editable').html('<p><span class="large">Enter or paste writing here.</span><br>Use the menu above to format text and insert images from a valid URL.</p><p>&nbsp;</p>');
          $('.note-toolbar').css('z-index', '0');
        }
      }
    });
  });
});

Template.newBlog.events({
  'change #banner_file': function(e, template) {
    if (e.currentTarget.files && e.currentTarget.files[0]) {
      var reader = new FileReader();
      var files = e.target.files;
      var file = files[0];
      if (file.type.indexOf("image")==-1) {
        vex.dialog.alert('Invalid File, you can only upload a static image for your banner picture');
        return;
      };
      reader.onload = function(readerEvt) {
          blogSettings.banner = readerEvt.target.result;
          /** set file.name to span of inner el */
          $('#banner_file_name').text(file.name);
          $('#hidden_banner_name').show();
        }; 
      reader.readAsDataURL(file);
    }
  },
  'change #image_file': function(e, template) {
    if (e.currentTarget.files && e.currentTarget.files[0]) {
      var reader = new FileReader();
      var files = e.target.files;
      var file = files[0];
      if (file.type.indexOf("image")==-1) {
        vex.dialog.alert('Invalid File, you can only upload a static image for your main picture');
        return;
      };
      reader.onload = function(readerEvt) {
          blogSettings.image = readerEvt.target.result;
          /** set file.name to span of inner el */
          $('#image_file_name').text(file.name);
          $('#hidden_image_name').show();
        }; 
      reader.readAsDataURL(file);
    }
  },
  'click #create_article': function(e) {
    e.preventDefault();
    /**
        image file
        summernote html & text
        title.trim()
        category:selected
        tags.split(',').trim()
      */
    var options = {};
    options.htmlText = $('#summernote').summernote('code').replace(/(<script.*?<\/script>)/g, '');
    options.plainText = $("#summernote").summernote('code')
        .replace(/<\/p>/gi, " ")
        .replace(/<br\/?>/gi, " ")
        .replace(/<\/?[^>]+(>|$)/g, "")
        .replace(/&nbsp;|<br>/g, " ")
        .trim();

    if (options.plainText&&options.plainText==='Enter or paste writing here. Use the menu above to format text and insert images from a valid URL.') {
      vex.dialog.alert('you did not enter your article\'s writing');
      return;
    }
    options.title = $('#title').val().trim();
    if (!options.title) {
      vex.dialog.alert('please enter a title');
      return;
    };
    options.teaser = $('#excerpt').val();
    if (!options.teaser) {
      vex.dialog.alert('please enter a short teaser');
      return;
    };
    options.summary = $('#summary').val();
    if (!options.summary) {
      vex.dialog.alert('please enter a summary');
      return;
    };
    var ts = $('#tags').val();
    try {
      ts = ts.trim();
    } catch(e) {};
    if (!ts) {
      vex.dialog.alert('please include at least one meaningful tag');
      return;
    };
    options.tags = ts.split(',').map(function(t) { return t.toLowerCase().trim(); });
    options.category = $('#category').find(":selected").text();
    if (options.category.indexOf('Category')>-1) {
      vex.dialog.alert('please select a category');
      return;
    }
    options._image = blogSettings.image;
    options._banner = blogSettings.banner;

    Meteor.call('createBlog', options);

    $('#title').val('');
    $('#excerpt').val('');
    $('#summary').val('');
    $('#tags').val('');
    $('#category').val('Select Category');
    $('.note-editable').html('<p><span class="large">Enter or paste writing here.</span><br>Use the menu above to format text and insert images from a valid URL.</p><p>&nbsp;</p>');
    delete blogSettings['image'];
    delete blogSettings['banner'];
  }
});