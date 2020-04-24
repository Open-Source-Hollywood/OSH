Template.splashPage.onRendered(function() {
  $(document).ready(function() {
    if (localStorage.getItem('doShowLock')==='true'||localStorage.getItem('doShowLock')===true) {
      setTimeout(function() {
        localStorage.setItem('doShowLock', false);
        lock.show();
      }, 1597);
    };
    $(window).resize(function() {
      $('.holder').css('height', '');
    });
  });
});

Template.splashPage.helpers({
  projects: function() {
    return Projects.find({
        archived: false
    }, {limit: 16}).fetch().map(function(i) {
      return {
        slug: i.slug,
        title: i.title,
        ownerId: i.ownerId,
        banner: i.banner,
        purpose: i.purpose,
        genre: i.genre, 
        funded: i.funded||0,
        category: i.category,
        logline: i.logline,
        ownerName: i.ownerName,
        cast: i.cast,
        crew: i.crew
      }
    });
  },
  ifProjs: function() {
    return Projects.find({
        archived: false
    }).count();
  },
  hotLN: function() {
    return Projects.find({
        archived: false
    }).count() > 20;
  },
  blogs: function() {
    // get blogs
    return Blogs.find({}, { sort: { created: -1 }, limit: 16 });
  }
})