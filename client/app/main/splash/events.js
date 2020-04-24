function goDiscovery() {
  try{
    var cb = document.getElementById('discoverybtn'); 
      cb.dispatchEvent(new MouseEvent('click', {
        view: window
      }));
  } catch(e){ window.location.assign('/discover');}
};

Template.splashPage.events({
  // Pressing Ctrl+Enter should submit the form.
  'click .login': function() {
    if (window.location.href.indexOf('/projects')>-1||window.location.href.indexOf('/profile')>-1) {
      localStorage.setItem('doShowLock', true);
      window.location.assign('/');
    } else {
      localStorage.removeItem('redirectURL');
      lock.show();      
    }
  },

  'click .create': function() {
    localStorage.setItem('redirectURL', '/create');
    lock.show();
  },
  'click .goDiscover': function() {
      localStorage.removeItem('redirectURL');
      goDiscovery();
  },
  'click #sendMsg': function() {
    /** get message and subject / email, and send email */
    var o = {
      name: $('#msg_name').val(),
      email: $('#msg_email').val(),
      subject: $('#msg_subject').val(),
      message: $('#message').val()
    };
    if (!o.name||!o.email||!o.subject||!o.message) return vex.dialog.alert('please fill out all fields of the contact form to proceed');
    Meteor.call('splashMessage', o);
    $('#contact_us_form')[0].reset()
    $('#sendmessage').show();
  }
});