Template.applicantsHelper.helpers({
  currentSlug: function() {
    return currentSlug;
  },
  thisString: function() {
    return JSON.stringify(this)
  },
  foobar: function() {
    // console.log(new Array(100).join('# '))
    // console.log(this)
  },
  typeofRequest: function() {
    // console.log(this)
    // if (this.audition&&this.audition!=='N/A') return 'Request Audition';
    return 'Negotiate';
  },
  poke: function() {
    return this.poke;
  }
});