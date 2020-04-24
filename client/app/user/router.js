Router.route('/config', {
  name: 'Config',
  template: 'config',
  layoutTemplate: 'StaticLayout',
  waitOn: function() {
    localStorage.removeItem('redirectURL');
    return [
      Meteor.subscribe('getMe'), 
      // Meteor.subscribe('connectUser')
    ];
  },
  onBeforeAction: function() {
    $('meta[name=description]').remove();
    document.title = 'Configure Account';
    this.next();
  },
  onAfterAction: function() {
    var user = Meteor.user()
    if (!user) Router.go('Home');
    try { if (user.iamRoles&&user.iamRoles.length) Router.go('Home'); } catch(e) {}
  }
})

Router.route('/profile', {
  name: 'MyProfile',
  template: 'myProfile',
  layoutTemplate: 'StaticLayout',
  waitOn: function() {
    if (!Meteor.user()) {
      Router.go('Home');
      window.location.assign('/');
      return
    }
    return [
      Meteor.subscribe('getMe'), 
      // Meteor.subscribe('connectUser')
    ];
  },
  onBeforeAction: function() {
    $('meta[name=description]').remove();
    document.title = 'My Profile';
    this.next();
  }
})

Router.route('/profile/:_id', {
  name: 'Profile',
  template: 'profile',
  layoutTemplate: 'StaticLayout',
  waitOn: function() {
    return [
      Meteor.subscribe('getUser', this.params._id), 
      Meteor.subscribe('allSubscribers'),
      Meteor.subscribe('projectsList'), 
      Meteor.subscribe('getMe'),
      // Meteor.subscribe('connectUser')
    ];
  },
  data: function() {
    var user = Meteor.users.findOne({_id: this.params._id});
    var headtext = user&&user.bio_plaintext||user&&user.iam&&user.iam.length&&user.iam.join(', ')||'Amazing talent on O . S . H . (https://opensourcehollywood.org)';
    $('meta[name=description]').remove();
    $('head').append( '<meta name="description" content="'+headtext+'">' );
    document.title = user&&user.firstName&&user.lastName ? [user.firstName, user.lastName, 'on O . S . H . (opensourcehollywood.org)'].join(' ') : 'Member Profile';
    return user;
  }
});

Router.route('/settings', {
    name: 'Settings',
    template: 'settings',
    layoutTemplate: 'StaticLayout',
    bodyClass: 'page-index chrome chrome-39 mac large-window body-webkit-scrollbars tabbed-page',
    waitOn: function() {
      if (!Meteor.user()) {
        Router.go('Home');
        window.location.assign('/');
        return
      }
      return [
        Meteor.subscribe('getMe'),
        Meteor.subscribe('mySubscriptions'),
        Meteor.subscribe('allSubscribers'),
        // Meteor.subscribe('connectUser'),
        Meteor.subscribe('getProjectMessages'),
        Meteor.subscribe('userActiveProjects', Meteor.user()._id),
        Meteor.subscribe('activeProjectsApproved', Meteor.user()._id)
      ];
    },
    onBeforeAction: function() {
      $('meta[name=description]').remove();
      $('head').append( '<meta name="description" content="Profile settings and account management on Open Source Hollywood">' );
      document.title = 'Account Settings';
      this.next();
    },
    onAfterAction: function() {
      setTimeout(function() {
        $('#gomain').click();
      }, 331);
    }
});


Router.route('/network', {
    name: 'Gallery',
    template: 'userTabs',
    layoutTemplate: 'StaticLayout',
    bodyClass: 'page-index chrome chrome-39 mac large-window body-webkit-scrollbars tabbed-page',
    waitOn: function() {
      return [
        Meteor.subscribe('getUsers'), 
        // Meteor.subscribe('connectUser'),
        Meteor.subscribe('getMe')
      ];
    },
    onBeforeAction: function() {
      if (!Meteor.user()) {
        Router.go('Home');
        window.location.assign('/');
        return
      }
      document.title = "HOLLYWOOD Members";
      this.next();
    }
});
