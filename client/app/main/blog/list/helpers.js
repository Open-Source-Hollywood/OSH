Template.bloglist.helpers({
    foo: function() {
    console.log(this)

  },
  moment: function() {
    var d = this.created || new Date;
    return moment(d).format('MMMM Do, YYYY');
  }
})