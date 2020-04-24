Template.nav.events({
  'click .switchnavDashboard': function(e) {
    var switchNav = $(e.target).attr('val')
    setTimeout(function() {
      // localStorage.setItem($(e.target).attr('val'), 'switchnavDashboard')
      if (switchNav) {
          var o = {
            'projects': 'switch_campaigns',            
            'merchant': 'switch_merchant',
            'subscriptions': 'switch_subscriptions'
          }[switchNav]
          $('#preloader').show()
          simulateClick(document.getElementsByClassName(o)[0])
          setTimeout(function() {
            simulateClick(document.getElementsByClassName(o)[0])
            setTimeout(function() {
              simulateClick(document.getElementsByClassName(o)[0])
              $('#preloader').hide()
            }, 144)
          }, 337)
          // localStorage.removeItem('switchnavDashboard')
      };
    }, 987)
  },
  'click .switchnavSettings': function(e) {
    var switchNav = $(e.target).attr('val')
    setTimeout(function() {
      // localStorage.setItem($(e.target).attr('val'), 'switchnavSettings')
      if (switchNav) {
          var o = {
            'personal': 'switch_personal',
            'assets': 'switch_assets'
          }[switchNav]
          $('#preloader').show()
          simulateClick(document.getElementsByClassName(o)[0])
          setTimeout(function() {
            simulateClick(document.getElementsByClassName(o)[0])
            setTimeout(function() {
              simulateClick(document.getElementsByClassName(o)[0])
              $('#preloader').hide()
            }, 144)
          }, 337)
          // localStorage.removeItem('switchnavSettings')
      };
    }, 987)
  },
  'click .menu-item': function(e) {
    if ($(window).width()<=767) $('#navbutton').click();
    $('.menu-item').removeClass('bold')
    $('.menu-item').removeClass('c333')
    $('.menu-item').addClass('c999')
    var li = $(e.target).closest('li')
    $(li).addClass('bold')
    $(li).addClass('c333')
    $(li).removeClass('c999')
  },
  'click #logo': function() {
    window.location.assign('/');
  },
  'click #signout': function() {
    localStorage.clear();
    Session.set('order', 'hot');
    Session.set('needsResetOption', false);
    Session.set('locationFilter', null);
    Session.set('selectedCategory', null);
    Session.set('selectedGenre', null);
    Meteor.logout();
    Meteor.logoutOtherClients();
  },
  'click #profile': function() {
    document.title = 'Profile View';
  },
  'click #settings': function() {
    document.title = 'Settings Edit';
  },
  'click .login': function() {
    var url = window.location.href;
    if (url.indexOf('/projects')>-1||url.indexOf('/profile')>-1) {
      localStorage.setItem('doShowLock', true);
      goDiscovery();
    } else {
      if (!url||url.match(/\//g).length===3) return lock.show();
      if ((url.indexOf('/terms')===-1&&url.indexOf('/privacy')===-1&&url.indexOf('/contact')===-1)) {
        localStorage.setItem('doShowLock', true);
        setTimeout(function() {
          goDiscovery();
        }, 144);
        return;
      };
      if (url.match(/\//g).length<=4) lock.show();
    }
  },
  'click .ls0': function() {
    localStorage.removeItem('redirectURL');
  }

});
