
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
  name: 'Splash',
  layoutTemplate: 'SplashLayout',
  onBeforeAction: function() {
    if (Meteor.user()!==null) {
      Router.go('Home');
      return;
    }
    this.next();
  }
});

Router.route('/login', function(){
  if (Meteor.user()) {
    Router.go('Home');
    return;
  };
  this.layout('StaticLayout');
  this.render('signin');
  this.name('Login');
  document.title = "Login";
});

Router.route('/home', {
  name: 'Home',
  template: 'projectTabs',
  layoutTemplate: 'StaticLayout',
  waitOn: function() {
    return [
      Meteor.subscribe('projectsList'), 
      Meteor.subscribe('usersList'),
      Meteor.subscribe('connectUser')
    ];
  },
  onBeforeAction: function() {
    if (Meteor.user()===null) {
      Router.go('Splash');
      return;
    }
    this.render('loadingNonBoard');
    this.next();
  }
});

Router.route('/.', function() {
  Router.go('Home');
});