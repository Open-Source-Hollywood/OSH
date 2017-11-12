
Router.route('/aboutUs', function() {
  this.layout('StaticLayout');
  this.render('aboutUs');
  document.title = "About Us";
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
});

Router.route('/privacy', function(){
  this.layout('StaticLayout');
  this.render('privacy');
  document.title = "Privacy";
});

Router.route('/', {
  name: 'Home',
  layoutTemplate: 'SplashLayout',
  onBeforeAction: function() {
    if (Meteor.user()) {
      Router.go('Projects');
      return;
    }
    document.title = "Open Source Hollywood";
    this.next();
  }
});

Router.route('/login', function(){
  if (Meteor.user()) {
    Router.go('Projects');
    return;
  };
  this.layout('StaticLayout');
  this.render('signin');
  this.name('Login');
  document.title = "Login";
});
