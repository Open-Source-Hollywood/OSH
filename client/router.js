
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
    $('head').append( '<meta name="description" content="The Premiere Platform for Story Development and Production Optimization">' );
    document.title = 'Open Source Hollywood';
    this.next();
  },
  waitOn: function() {
      return [
        Meteor.subscribe('projectsList'),
        Meteor.subscribe('blogs')
      ];
    }
});

Router.route('/write', {
  name: 'Write',
  template: 'newBlog',
  layoutTemplate: 'StaticLayout',
  onBeforeAction: function() {
    if (!Meteor.user()||(Meteor.user()._id!=='NtwHRpqPZCRiMkbsK' && Meteor.user()._id!=='RKgbrBSd9gEfm4cJP' && Meteor.user()._id!=='h6hMjCTqgvju6S6ES' && Meteor.user()._id!=='Kf4kzSmLze9jYPYh3' && Meteor.user()._id!=='k69vzFMz9MhwxqQv2')) {
      Router.go('Home');
      return;
    };
    document.title = 'Creative Writing';
    this.next();
  }
});

Router.route('/blog', {
  name: 'Blogs',
  template: 'bloglist',
  layoutTemplate: 'StaticLayout',
  onBeforeAction: function() {
    document.title = 'O . S. H. Blogs';
    this.next();
  },
  waitOn: function() {
    return [
      Meteor.subscribe('blogs')
    ];
  },
  data: function() {
    var blogs = Blogs.find({});
    return {blogs: blogs};
  }
});

Router.route('/blog/:bid', {
  name: 'Blog',
  template: 'blog',
  layoutTemplate: 'StaticLayout',
  waitOn: function() {
    return [
      Meteor.subscribe('blogs')
    ];
  },
  data: function() {
    var b = Blogs.findOne({_id: this.params.bid});
    if (b) {
      $('meta[name=description]').remove();
      $('head').append( '<meta name="description" content="'+b.teaser+' (https://opensourcehollywood.org)">' );
      document.title = b.title;
    };
    return b;
  }
});
