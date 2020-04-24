Template.projectView.helpers({
  iApplied: function() {
    var myId = Meteor.user()._id
    var arr = (this.project['roleApplicants']||[]).concat(this.project['crewApplicants']||[])
    for (var i = arr.length - 1; i >= 0; i--) {
      var r = arr[i]
      if (r.user.id===myId) return true;
    };
    return false
  },
  thingsIApplied: function() {
    var myId = Meteor.user()._id
    var arr = (this.project['roleApplicants']||[]).concat(this.project['crewApplicants']||[])
    var agg = {
      cast: 0, crew: 0
    }
    for (var i = arr.length - 1; i >= 0; i--) {
      var r = arr[i]
      if (r.user.id===myId) {
        if (r.ctx==='cast'||r.ctx==='crew') {
          agg[r.ctx] += 1
        };
      }
    };
    return agg
  },
  numCast: function() {
    return this.project.cast.length
  },
  numCrew: function() {
    return this.project.crew.length
  },
  numGifts: function(){
    return this.project.gifts.length
  },
  numNeeds: function(){
    return this.project.gifts.length
  },
  hasGifts: function() {
    return this.project.gifts&&this.project.gifts.length||false
  },
  hasNeeds: function() {
    return this.project.needs&&this.project.needs.length||false
  },
  thumbsupactive: function() {
    // if me in upvote 'active' : null
    if (this.project.upvotedUsers.indexOf(Meteor.user()._id)>-1) return 'active';
  },
  numBackers: function() {
    return this.backers&&this.backers.length||0;
  },
  hasEquity: function() {
    if (this.project.equityInfo&&
      this.project.equityInfo.agreement1&&
      this.project.equityInfo.agreement2&&
      this.project.equityInfo.agreement3&&
      this.project.equityInfo.agreement4) 
      return true;
    return false;
  },
  soldShares: function() {
    return this.project.totalShares - this.project.availableShares;
  },
  privateShares: function() {
    // how many total private shares?
    var percent = (this.project.totalShares || 0) / 100;
    return (100 - percent) * 100;
  },
  availableShares: function() {
    // how many available private shares?
    var percent = (this.project.totalShares || 0) / 100;
    var rem = (100 - percent) * 100;
    // list of private share holders
    var assigned = this.project.usersApproved.map(function(i) {
      return i&&i.equity||0;
    }).reduce(function(a, b) {
      return a + b;
    }, 0);
    return rem - assigned;
  },
  numUpdates: function() {
    var updates = this.project.updates||[];
    return updates.length;
  },
  numLikes: function() {
    return this.project.upvotedUsers.length||0;
  },
  projectBudgetIfExists: function() {
    if (this.project.budget) {
      return Number.isInteger(parseInt(this.project.budget)) ? this.project.budget : 0
    } else {
      return Number.isInteger(parseInt(this.project.funded)) ? this.project.funded : 0
    }
  },
  projectFundedIfExists: function() {
    if (this.project.budget) {
      var funds = Number.isInteger(parseInt(this.project.funded)) ? this.project.funded : 0
      return '$'+funds+' raised';
    } else {
      return 'funds raised';
    }
  },
  showNeeded: function() {
    if (this.project.budget) return 'needed';
  },
  fundedNumber: function() {
    return Number.isInteger(parseInt(this.project.funded)) ? this.project.funded : 0
  },
  formattedUpdateDate: function() {
    return moment(this.date).format('MM-DD-YYYY');
  },
  castLN: function() {
    return this.project.cast.length
  },
  crewLN: function() {
    return this.project.crew.length
  },
  needLN: function() {
    return this.project.needs.length
  },
  anyRoles: function() {
    return Meteor.user()&&(this.project.needs.length>0||this.project.cast.length>0||this.project.crew.length>0);
  },
  anyRolesNoAuth: function() {
    return (this.project.needs.length>0||this.project.cast.length>0||this.project.crew.length>0);
  },
  anyShares: function() {
    return this.project.availableShares || 0;
  },
  mpps: function() {
    return this.project.mpps || 1;
  },
  formattedDescription: function() {
    var that =  this;
    setTimeout(function() {
      $('#formatted_desc').html(currentProject&&currentProject.description||'');
    }, 800);
  },
  shareData: function() {
    ShareIt.configure({
        sites: {
            'facebook': {
                'appId': '1790348544595983'
            }
        }
    });
    me = this.me;
    currentSlug = this.project.slug || '';
    currentTitle = this.project.title || '';
    currentProject = this.project;
    var backupURL = 'https://opensourcehollywood.org/projects/'+this.project.slug+'/'+this.project.ownerId;
    return {
      title: this.project.title+'" on Open Source Hollywood! <opensourcehollywood.org>',
      author: this.project.ownerName,
      excerpt: this.project.logline||this.project.descriptionText,
      summary: this.project.logline||this.project.descriptionText,
      description: this.project.logline||this.project.descriptionText,
      thumbnail: this.project.banner,
      image: this.project.banner,
      video: this.project.videoExplainer,
      url: this.project.urlLink || backupURL
    }
  },
  subtitle: function() {
    var numGifts = 0;
    this.project.gifts&&this.project.gifts.forEach&&this.project.gifts.forEach(function(g) {
      if (g.quantity>0) numGifts+=1;
    });
    var teamPositions = 0;
    this.project.crew&&this.project.crew.forEach&&this.project.crew.forEach(function(c) {
      if (c.status&&c.status.indexOf&&c.status.indexOf('needed')>-1) teamPositions+=1;
    });
    var castPositions = 0;
    this.project.cast&&this.project.cast.forEach&&this.project.cast.forEach(function(c) {
      if (c.status&&c.status.indexOf&&c.status.indexOf('needed')>-1) castPositions+=1;
    });
    var msg='donate to campaign below';
    if (numGifts) {
      msg+=' or select from available gifts for purchase';
    };
    if (teamPositions) {
      msg+=', there are crew positions available for you to apply';
    };
    if (teamPositions&&castPositions) {
      msg+=', and roles are also available for you to apply';
    };
    if (!teamPositions&&castPositions) {
      msg+=', there are roles on this campaign available for you to apply';
    };
    var _msg = msg[0].toUpperCase() + msg.substr(1,msg.length-1) + '.';
    return _msg;
  },
  currentSlug: function() {
    return currentSlug;
  },
  producerReady: function() {
    if (!Meteor.user()) return false;
    return me&&me.iam&&me.iam.length||me&&me.primaryRole;
  },
  usersApplied: function() {
    return (this.project.roleApplicants&&this.project.roleApplicants.length||0)+(this.project.crewApplicants&&this.project.crewApplicants.length||0);
  },
  equityDistributed: function() {
    return this.project.equityAllocated||0;
  },
  isAllowed: function() {
    if (!Meteor.user()) return false;
    var projectOwnerId = this.project.ownerId;
    var acceptedUsers = this.project.usersApproved;
    var myId = Meteor.user()&&Meteor.user()._id||'myId';
    if (myId === projectOwnerId) return true;
    return acceptedUsers&&acceptedUsers.indexOf(myId)>-1;
  },
  website: function() {
    return this.project.website || 'not specified';
  },
  title: function() {
    return this.project.title;
  },
  author: function() {
    return 'a campaign by ' + this.project.ownerName;
  },
  projectRemovedNotBoard: function() {
    if (this.isLive) {
      var falsy = project.ownerId === Meteor.user()._id ? true : false;
      if (falsy === false) {
        project.usersApproved.forEach(function(u) {
          if (u.id === Meteor.user()._id) return falsy = true;
        });
      } 
      return ! falsy;
    } else {
      if (this.archived) return ! false;
      return ! true;
    }
  }
});

Template.projectView.onRendered(function() {
  if ($(window).width()<580) {
    setTimeout(function() {
      $($( ".tabs-select" )[1]).prepend('<i id="crazed_foo" class="fa fa-chevron-down fa-2x" style="position:absolute;pointer-events:none;"></i>');
      $('#genreclick2').click();
    }, 610);
  }
  
  setTimeout(function() {
      $('.fb-share').html('<li class="fa fa-facebook"></li>');
      $('.tw-share').html('<li class="fa fa-twitter"></li>');
      $('.pinterest-share').html('<li class="fa fa-pinterest"></li>');
      $('.googleplus-share').html('<li class="fa fa-google-plus"></li>');
      $('#genreclick1').click();
  }, 144);
});
