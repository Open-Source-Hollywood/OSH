
Router.route('/about-us', function() {
  this.layout('StaticLayout');
  this.render('aboutus');
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

Router.route('/contact', function(){
  this.layout('StaticLayout');
  this.render('contactus');
  document.title = "Contact Us";
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
    this.next();
  },
  waitOn: function() {
      return [
        Meteor.subscribe('projectsList')
      ];
    }
});

Router.route('/login', {
  name: 'Login',
  template: 'splashPage',
  layoutTemplate: 'StaticLayout',
  onBeforeAction: function() {
    setTimeout(function() {
      lock.show();
    }, 800);
    this.next();
  },
});

Router.route('/login/create', {
  name: 'LoginCreate',
  template: 'splashPage',
  layoutTemplate: 'StaticLayout',
  onBeforeAction: function() {
    setTimeout(function() {
      localStorage.setItem('redirectURL', '/create');
      lock.show();
    }, 800);
    this.next();
  },
});
