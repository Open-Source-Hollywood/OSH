/*
* If you want to use a default layout template for all routes you can
* configure a global Router option.
*/
Router.configure({
    loadingTemplate: 'loading',
    notFoundTemplate: 'notFound',

    yieldRegions: {
        '': {
            to: 'modal'
        }
    },

    /*
    * onBeforeAction hooks now require you to call this.next(),
    * and no longer take a pause() argument. So the default behaviour is reversed.
    * ClassMapper body add, remove class.
    */
    onBeforeAction: function(pause) {
        window.scrollTo(0,0);
        var body = $('body'),
            options = this.route.options,
            bodyClass = options["bodyClass"],
            authenticate = options['authenticated'],
            redirectLoggedInUsers = options['redirectLoggedInUsers'];

        // authenticated
        if (!Meteor.user() && authenticate) {

            // redirect
            Router.go('/');
            // options authenticate not next().
            return;
        }

        if (Meteor.user() && redirectLoggedInUsers) {
            // redirect
            Router.go('Projects');
            return;
        }

        // Remove class attribute body
        body.removeAttr('class');

        // if klass iron router name currentRouter then add Class
        if (bodyClass) body.addClass(bodyClass);

        // reset default sessions
        Session.set('error', false);
        Session.set('warning', false);

        Popup.close();

        // Next
        this.next();
    }
});

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

Router.route('/join', function(){
  this.layout('StaticLayout');
  this.render('join');
  document.title = "Join Our Team";
  $('meta[name=description]').remove();
    $('head').append( '<meta name="description" content="Join our team.">' );
});

Router.route('/', {
  name: 'Home',
  template: 'splashPage',
  layoutTemplate: 'StaticLayout',
  onBeforeAction: function() {
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
  },
  onAfterAction: function() {
    var user = Meteor.user();
    if (user) {
      var x = localStorage.getItem('create');
      if (x===true) {
        localStorage.removeItem('create');
        Router.go('Create Project');
      } else {
        if (!user.iamRoles||!user.iamRoles.length) {
          Router.go('Config')
        };

        if (user.iamRoles&&user.iamRoles.indexOf('producer')>-1) {
          Router.go('Dashboard')
        } else {
          Router.go('Projects');
        }  
      }
    };
  }
});

Router.route('/contracts', {
  name: 'Receipts',
  template: 'applicantsMain',
  layoutTemplate: 'StaticLayout',
  onBeforeAction: function() {
    var user = Meteor.user();
    if (!user) {
      Router.go('Home')
    };
    $('meta[name=description]').remove();
    $('head').append( '<meta name="description" content="The Premiere Platform for Story Development and Production Optimization">' );
    document.title = 'Open Source Hollywood';
    this.next();
  },
  waitOn: function() {
    return [
      Meteor.subscribe('getMe'),
      Meteor.subscribe('projectsWithSomething'),
      Meteor.subscribe('getReceipts'),
      Meteor.subscribe('myCurrentOffers')
    ];
  },
  data: function() {
    // console.log(Meteor.user())
    var uid = typeof Meteor.user() === 'string' ? Meteor.user() : Meteor.user()&&Meteor.user()._id||null
    if (uid) {
      var offers = Offers.find({
          $or:[
              { offeree: uid },
              { offeror: uid }
          ],
          $and:[
            { pending: {$ne: false} },
            { rejected: {$ne: true} },
            { accepted: {$ne: true} }
          ]
      });

      var rs = Receipts.find({
        user: uid
      }).fetch()
        
      var projects = Projects.find({
        ownerId: Meteor.user()._id,
        $or: [
          { soldGifts: { $exists: true, $ne: [] }},
          { castApplicants: { $exists: true, $ne: [] }},
          { crewApplicants: { $exists: true, $ne: [] }}
        ]
      }).fetch();

      return {
        offers: offers,
        ln: offers.length,
        projects: projects.map(function(p) {
          return {
            slug: p.slug,
            id: p._id,
            title: p.title,
            crewApplicants: p.crewApplicants,
            castApplicants: p.castApplicants,
            soldGifts: p.soldGifts
          }
        })
      }
    }
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
