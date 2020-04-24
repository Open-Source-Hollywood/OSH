Template.project.helpers({
  isOwner: function () {
    return this.ownerId === Meteor.user()._id;
  },
  submittedAgo: function() {
    return moment(this.createTimeActual, moment.ISO_8601).fromNow();
  },
  perCent: function() {
    return this.duration/30 * 100;
  },
  foo: function() {
    // console.log(this)
  }
});
