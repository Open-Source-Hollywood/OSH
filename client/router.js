
Router.route('/about', function() {
  this.layout('StaticLayout');
  this.render('about');
  document.title = "About Open Source Hollywood";
});

Router.route('/help', function() {
  this.layout('StaticLayout');
  this.render('help');
  document.title = "Help";
});

Router.route('/terms', function(){
  this.layout('StaticLayout');
  this.render('terms');
  document.title = "Terms for Open Source Hollywood";
});

Router.route('/privacy', function(){
  this.layout('StaticLayout');
  this.render('privacy');
  document.title = "Privacy";
});

Router.route('/', {
  name: 'Home',
  template: 'projectHome',
  layoutTemplate: 'StaticLayout',
  waitOn: function() {
    return [
      Meteor.subscribe('projectsList'), 
      Meteor.subscribe('connectUser'),
      Meteor.subscribe('getMe')
    ];
  },
  onBeforeAction: function() {
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
