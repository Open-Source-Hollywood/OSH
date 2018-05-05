
Router.route('/about-us', function() {
  this.layout('StaticLayout');
  this.render('aboutus');
  document.title = "About Us";
  $('meta[name=description]').remove();
  $('head').append( '<meta name="description" content="Open Source Hollywood is made for visionaries by visionaries. Check out our talented team.">' );
});

Router.route('/help', function() {
  this.layout('StaticLayout');
  this.render('help');
  document.title = "Help";
});

Router.route('/terms', function(){
  this.layout('StaticLayout');
  this.render('terms');
  document.title = "Terms";
  $('meta[name=description]').remove();
  $('head').append( '<meta name="description" content="Open Source Hollywood terms and conditions for usage.">' );
});

Router.route('/privacy', function(){
  this.layout('StaticLayout');
  this.render('privacy');
  document.title = "Privacy";
  $('meta[name=description]').remove();
  $('head').append( '<meta name="description" content="Your privacy is very important to us at Open Source Hollywood.">' );
});

Router.route('/contact', function(){
  this.layout('StaticLayout');
  this.render('contactus');
  document.title = "Contact Us";
  $('meta[name=description]').remove();
    $('head').append( '<meta name="description" content="Contact Open Source Hollywood by email and phone.">' );
});

Router.route('/', {
  name: 'Home',
  template: 'splashPage',
  layoutTemplate: 'StaticLayout',
  onBeforeAction: function() {
    if (Meteor.user()) {
      var x = localStorage.getItem('create');
      if (x===true) {
        Router.go('Create Project');  
        localStorage.setItem('create', false);
      } else {
        Router.go('Projects');  
      }
    };
    $('meta[name=description]').remove();
    $('head').append( '<meta name="description" content="Open Source Hollywood is for media producers to build teams, raise funds, and manage projects.">' );
    document.title = 'Open Source Hollywood';
    this.next();
  },
  waitOn: function() {
      return [
        Meteor.subscribe('projectsList')
      ];
    }
});
