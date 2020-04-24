Template.blog.onRendered(function() {
   setTimeout(function() {
      $('.fb-share').html('<li class="fa fa-facebook"></li>');
      $('.tw-share').html('<li class="fa fa-twitter"></li>');
      $('.pinterest-share').html('<li class="fa fa-pinterest"></li>');
      $('.googleplus-share').html('<li class="fa fa-google-plus"></li>');
   }, 133);


    var disqus_config = function () {
      this.page.url = window.location.href;  // Replace PAGE_URL with your page's canonical URL variable
      this.page.identifier = this.data._id; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
    };
    (function() { // DON'T EDIT BELOW THIS LINE
      var d = document, s = d.createElement('script');
      s.src = 'https://open-source-hollywood-1.disqus.com/embed.js';
      s.setAttribute('data-timestamp', +new Date());
      (d.head || d.body).appendChild(s);
    })();
 });



Template.blog.helpers({
  shareData: function() {
      ShareIt.configure({
          sites: {
              'facebook': {
                  'appId': '1790348544595983'
              }
          }
      });

      var backupURL = 'https://opensourcehollywood.org/blog/'+this._id;
      return {
        title: this.title,
        author: 'Open Source Hollywood',
        excerpt: this.teaser,
        summary: this.summary,
        description: this.plainText,
        thumbnail: this.image,
        image: this.image,
        url: backupURL
      }
  },
  moment: function() {
    var d = this.created || new Date;
    return moment(d).format('MMMM Do, YYYY');
  },
  _tags: function() {
    return this.tags.join(', ');
  },
  _htmlText: function() {
    var was = this;
    setTimeout(function() {
      $('#htmlText').html(was.htmlText);
    }, 1000);
  }
})