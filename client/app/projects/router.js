var wasUser = false;
var onboardDialogShowing = false;

Router.route('/dashboard', {
    name: 'Dashboard',
    template: 'dashboard',
    layoutTemplate: 'StaticLayout',
    waitOn: function() {
      if (!Meteor.user()) {
        Router.go('Home');
        window.location.assign('/');
        return
      }
      return [
        Meteor.subscribe('getMe'),
        Meteor.subscribe('myCurrentOffers'),
        Meteor.subscribe('myCompletedOffers'),
        Meteor.subscribe('mySubscriptions'),
        Meteor.subscribe('allSubscribers'),
        // Meteor.subscribe('connectUser'),
        Meteor.subscribe('getProjectMessages'),
        Meteor.subscribe('getReceipts'),
        Meteor.subscribe('userActiveProjects', Meteor.user()._id),
        Meteor.subscribe('userArchivedProjects', Meteor.user()._id),
        Meteor.subscribe('archivedProjects', Meteor.user()._id),
        Meteor.subscribe('activeProjectsApproved', Meteor.user()._id),
        Meteor.subscribe('ownerReceipts', Meteor.user()._id)
      ];
    },
    onBeforeAction: function() {
      $('meta[name=description]').remove();
      $('head').append( '<meta name="description" content="Merchant Center on Open Source Hollywood">' );
      document.title = 'Dashboard';
      this.next();
    },
    onAfterAction: function() {
      var that = this;
      setTimeout(function() {
        /** make sure campaigns and negotiations are loaded before continuing */
        var route = that.params.area === 'boards' ? '#gocampaigns' : '#gonegotiations';
        setTimeout(function() {
          $(route).click();
        }, $('#active').html() ? 987 : 1442);
      }, 144);
    },
    data: function() {
      return {
        giftPurchases: function() {
          return Receipts.find({owner: Meteor.user()._id, purpose: 'gift purchase'}).fetch()
        },
        assetLeases: function() {
          return Receipts.find({owner: Meteor.user()._id, purpose: 'resource leasing'}).fetch()
        },
        subscriptions: function() {
          return Subscriptions.find({ owner: Meteor.user()._id })
        },
        subscribers: function() {
          return Subscriptions.find({ 
            $or: [
              { user: Meteor.user()._id },
              { projectOwnerId: Meteor.user()._id }
            ]
          })
        },
        currentContracts: function() {
          var offers = Offers.find({
            $or:[
              { offeree: Meteor.user()._id },
              { offeror: Meteor.user()._id }
            ],
            $and:[
              { pending: {$ne: false} },
              { rejected: {$ne: true} },
              { accepted: {$ne: true} }
            ]
          }).fetch()
          return offers
        },
        completedContracts: function() {
          return Offers.find({
            $or:[
              { offeree: Meteor.user()._id },
              { offeror: Meteor.user()._id }
            ],
            pending: false,
            accepted: true
          }).fetch()
        },
      }
    }
});

__projects__ = function(name) {
  return {
    name: name,
    template: 'projectTabs',
    layoutTemplate: 'StaticLayout',
    waitOn: function() {
      return [
        Meteor.subscribe('projectsList'), 
        // Meteor.subscribe('connectUser'),
        Meteor.subscribe('getMe')
      ];
    },
    onBeforeAction: function() {
      var x = localStorage.getItem('redirectURL');
      if (x&&x!=='null'&&x.indexOf('/')>-1) {
        localStorage.removeItem('redirectURL');
        Router.go(x);
      };

      $('meta[name=description]').remove();
      $('head').append( '<meta name="description" content="The Premiere Platform for Story Development and Production Optimization">' );
      document.title = 'Open Source Hollywood';
      this.next();
    },
    onAfterAction: function() {
      var user = Meteor.user();
      if (user&&(!user.iamRoles||!user.iamRoles.length)) {
        Router.go('Config')
      };
    }
  }
}

Router.route('/', __projects__('Projects'));
Router.route('/discover', __projects__('Discovery'));

Router.route('/event', {
  name: 'Create Event',
  template: 'newevent',
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
    $('head').append( '<meta name="description" content="Build your team, network with great people on Open Source Hollywood.' );
    document.title = 'Create Event';
    this.next();
  }
});

Router.route('/create', {
  name: 'Create Project',
  template: 'newProject',
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
    $('head').append( '<meta name="description" content="Free crowdsourcing campaign creation on Open Source Hollywood.' );
    document.title = 'Create Campaign';
    this.next();
  }
});

Router.route('/projects/:slug/:uid', {
  name: 'projectView',
  template: 'projectView',
  layoutTemplate: 'StaticLayout',
  waitOn: function() {
    return [
      Meteor.subscribe('getMe'),
      Meteor.subscribe('projAssetOffers', this.params.slug, this.params.uid),
      Meteor.subscribe('getProject', this.params.slug),
      Meteor.subscribe('getUsers'),
      Meteor.subscribe('gotoBoard', this.params.slug),
      Meteor.subscribe('commentsList', this.params.slug),
      Meteor.subscribe('stringId', this.params.uid),
      Meteor.subscribe('projReceipts', this.params.slug)
    ];
  },
  data: function() {
    var slug = this.params.slug;
    var project = Projects.findOne({slug: slug});
    
    var backers
    try {
      backers = Users.find({ _id: { $in: project.backers||[] }}).fetch()
    } catch (e) {} finally {
      backers = backers || []
    }

    var board = Boards.findOne({slug: slug});
    if (!board || !project) return;
    var user = Users.findOne({_id: project.ownerId});
    var assetOffers = Offers.find({slug: project.slug, offeree: project.ownerId, type: 'assets'}).fetch()
    $('meta[name=description]').remove();
    $('head').append( '<meta name="description" content="'+(project.descriptionText||project.logline||'Amazing campaign on O . S . H . (https://opensourcehollywood.org)')+'">' );
    document.title = project.title ? [project.title, 'on O . S . H . (opensourcehollywood.org).'].join(' ') : 'Campaign Details';
    return {
        uid: project._id,
        assetOffers: assetOffers,
        backers: backers,
        perCent: function() {
          if (project.funded && project.budget) {
            var v = (project.funded/project.budget * 100 > 100 ? 100 : project.funded/project.budget * 100).toFixed(2);
            return v + ' %';
          };

          return 'not available';
        },
        purchases: function() {
          var r =  Receipts.find({slug: project.slug}).fetch()
          return r
        },
        isOwner: function () {
          if (!Meteor.user()) return false;
          return (project.ownerId === Meteor.user()._id)&&!project.archived;
        },
        isOwnerNoMatterWhat: function () {
          if (!Meteor.user()) return false;
          return (project.ownerId === Meteor.user()._id);
        },
        isArchived: function() {
          return project.archived||false
        },
        isMember: function() {
          if (!Meteor.user()) return false;
          if (project.ownerId === Meteor.user()._id) return true;
          var falsy = false;
          project.usersApproved.forEach(function(u) {
            if (u.id === Meteor.user()._id) return falsy = true;
          });
          return falsy;
        },
        numComments: function() {
          return Comments.find({projectId: slug}).count();
        },
        projectComments: function () {
          return Comments.find({projectId: slug});
        },
        submittedAgo: moment(project.createTimeActual, moment.ISO_8601).fromNow(),
        processedGenres: function() {
          if (project.genres.length > 0) {
            return project.genres.join(', ');
          } else {
            return 'no genres specified';
          }
        },
        needs: project.needs||[],
        videoURL: project.videoURL,
        _bid: board._id,
        _slug: board.slug,
        isLive: project.isLive,
        project: project,
        ownerName: project.ownerName,
        logline: project.logline,
        ownerAvatar: project.ownerAvatar,
        ownerId: project.ownerId,
        details: project.details,
        funded: project.funded,
        count: project.count,
        createdAt: project.createdAt,
        title: project.title,
        gifts: project.gifts||[],
        budget: function() {
          if (project.budget) {
            return '$ ' + project.budget
          }
          return 'none specified';
        },
        duration: project.duration,
        applied: project.applied
    }
  }
});

Router.route('/edit/projects/:slug/:uid', {
  name: 'editProject',
  template: 'editProjectMaster',
  layoutTemplate: 'StaticLayout',
  waitOn: function() {
    return [
      Meteor.subscribe('getMe'),
      Meteor.subscribe('projAssetOffers', this.params.slug, this.params.uid),
      Meteor.subscribe('getProject', this.params.slug),
      Meteor.subscribe('getUsers'),
      Meteor.subscribe('gotoBoard', this.params.slug),
      Meteor.subscribe('commentsList', this.params.slug),
      Meteor.subscribe('stringId', this.params.uid),
      Meteor.subscribe('projReceipts', this.params.slug)
    ];
  },
  data: function() {
    var slug = this.params.slug;
    var project = Projects.findOne({slug: slug});
    
    var backers
    try {
      backers = Users.find({ _id: { $in: project.backers||[] }}).fetch()
    } catch (e) {} finally {
      backers = backers || []
    }

    var board = Boards.findOne({slug: slug});
    if (!board || !project) return;
    var user = Users.findOne({_id: project.ownerId});
    var assetOffers = Offers.find({slug: project.slug, offeree: project.ownerId, type: 'assets'}).fetch()
    $('meta[name=description]').remove();
    $('head').append( '<meta name="description" content="'+(project.descriptionText||project.logline||'Amazing campaign on O . S . H . (https://opensourcehollywood.org)')+'">' );
    document.title = project.title ? [project.title, 'on O . S . H . (opensourcehollywood.org).'].join(' ') : 'Campaign Details';
    return {
        uid: project._id,
        assetOffers: assetOffers,
        backers: backers,
        perCent: function() {
          if (project.funded && project.budget) {
            var v = (project.funded/project.budget * 100 > 100 ? 100 : project.funded/project.budget * 100).toFixed(2);
            return v + ' %';
          };

          return 'not available';
        },
        purchases: function() {
          var r =  Receipts.find({slug: project.slug}).fetch()
          return r
        },
        isOwner: function () {
          if (!Meteor.user()) return false;
          return (project.ownerId === Meteor.user()._id)&&!project.archived;
        },
        isOwnerNoMatterWhat: function () {
          if (!Meteor.user()) return false;
          return (project.ownerId === Meteor.user()._id);
        },
        isArchived: function() {
          return project.archived||false
        },
        isMember: function() {
          if (!Meteor.user()) return false;
          if (project.ownerId === Meteor.user()._id) return true;
          var falsy = false;
          project.usersApproved.forEach(function(u) {
            if (u.id === Meteor.user()._id) return falsy = true;
          });
          return falsy;
        },
        numComments: function() {
          return Comments.find({projectId: slug}).count();
        },
        projectComments: function () {
          return Comments.find({projectId: slug});
        },
        submittedAgo: moment(project.createTimeActual, moment.ISO_8601).fromNow(),
        processedGenres: function() {
          if (project.genres.length > 0) {
            return project.genres.join(', ');
          } else {
            return 'no genres specified';
          }
        },
        needs: project.needs||[],
        videoURL: project.videoURL,
        _bid: board._id,
        _slug: board.slug,
        isLive: project.isLive,
        project: project,
        ownerName: project.ownerName,
        logline: project.logline,
        ownerAvatar: project.ownerAvatar,
        ownerId: project.ownerId,
        details: project.details,
        funded: project.funded,
        count: project.count,
        createdAt: project.createdAt,
        title: project.title,
        gifts: project.gifts||[],
        budget: function() {
          if (project.budget) {
            return '$ ' + project.budget
          }
          return 'none specified';
        },
        duration: project.duration,
        applied: project.applied
    }
  }
});

Router.route('/message/project/:slug/:uid', {
  name: 'ProjectMessage',
  template: 'projectMessage',
  layoutTemplate: 'StaticLayout',
  onBeforeAction: function() {
    $('meta[name=description]').remove();
    $('head').append( '<meta name="description" content="Open Source Hollywood member negotiations channel.">' );
    document.title = 'Smart Contract Negotiations';
    this.next();
  },
  waitOn: function() {
    if (!Meteor.user()) {
      Router.go('Home');
      window.location.assign('/');
      return
    }
    return [
      Meteor.subscribe('getProject', this.params.slug), 
      Meteor.subscribe('offerById', this.params.uid),
      Meteor.subscribe('getUsers'),
      Meteor.subscribe('getMe'),
      Meteor.subscribe('offers'),
      Meteor.subscribe('getReceipts'),
      Meteor.subscribe('getProjectMessages')
    ];
  },
  data: function() {
    var slug = this.params.slug;
    var project = Projects.findOne({slug: this.params.slug});
    var user = Users.findOne({_id: this.params.uid});
    if (!user) user = Users.findOne({_id: slug});
    var offer = Offers.findOne({_id: this.params.uid, parties: Meteor.user()._id})

    if (user&&project) {

      var receipts = Receipts.find({user: user._id, slug: project.slug}).fetch();
      var messages = ProjectMessages.find({user: this.params.uid, project: project._id, archived: {$ne: true}}).fetch();

      var query = {
        slug: project.slug,
        pending: {$ne:false},
        offeror: user._id
      }

      var offers = Offers.find(query).fetch();
      // console.log(offers)
      return {
        isAssets: false,
        project: project,
        user: user,
        offers: offers,
        receipts: receipts,
        messages: messages
      }
    };

    if (offer&&project) {
      var userId = Meteor.user()._id === project.ownerId ? offer.offeror : offer.offeree
      var user = Users.findOne({_id: userId})
      // console.log('FUCK YEAAAAAH')
      return {
        isAssets: true,
        offer: offer,
        project: project,
        user: user
      }
    };

    if (user&&offer) {
      return {
        isAssets: true,
        offer: offer,
        user: user
      }
    };

    return {}
  }
})

Router.route('/transaction/:uid', {
  name: 'ProjectOffer',
  template: 'projectMessage',
  layoutTemplate: 'StaticLayout',
  onBeforeAction: function() {
    $('meta[name=description]').remove();
    $('head').append( '<meta name="description" content="Open Source Hollywood member negotiations channel.">' );
    document.title = 'Smart Contract Negotiations';
    this.next();
  },
  waitOn: function() {
    if (!Meteor.user()) {
      Router.go('Home');
      window.location.assign('/');
      return
    }
    return [
      Meteor.subscribe('offers'),
      Meteor.subscribe('getMe'),
      Meteor.subscribe('projectsList'), 
      Meteor.subscribe('getReceipts'),
      Meteor.subscribe('getProjectMessages')
    ];
  },
  data: function() {
    console.log({_id: this.params.uid, parties: Meteor.user()._id})
    var receipt = Receipts.findOne({_id: this.params.uid, parties: Meteor.user()._id})
    if (!receipt) return;
    console.log('eval receipt')
    if (!!receipt.refund||!!receipt.revoked) {
      console.log('return receipt')
      return receipt
    };
    var offer = Offers.findOne({_id: receipt.offer, parties: Meteor.user()._id})
    if (!offer) return;
    var project = Projects.findOne({slug: receipt.slug})
    if (!project) return;
    console.log(new Array(1000).join('@'))
    console.log({_id: receipt.offer, parties: Meteor.user()._id})
    console.log(offer)
    var userId = Meteor.user()._id === project.ownerId ? offer.offeror : offer.offeree
    var user = Users.findOne({_id: userId})
    // console.log('FUCK YEAAAAAH')
    var messages = ProjectMessages.find({user: this.params.uid, project: project._id, archived: {$ne: true}}).fetch();
    return {
      isAssets: offer.type==='asset' ? true : false,
      project: project,
      user: user,
      offers: [offer],
      receipts: [receipt],
      messages: messages
    }
  }
})

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