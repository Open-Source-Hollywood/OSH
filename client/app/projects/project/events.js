Template.project.events({
  "click .edit": function () {
    var path = '/edit/projects/' + this.slug + '/edit';
    Router.go(path);
  },
  "click .delete": function () {
    if (bootbox.confirm("Are you sure you want to delete this?", function(r) {
      if (!r || r === false) return;
      Meteor.call("deleteProject", this._id);
    }));
  },
  "click .fa-chevron-up": function () {
    Meteor.call("upvoteProject", this._id);
  },
  "click .fa-chevron-down": function () {
    Meteor.call("downvoteProject", this._id);
  }
});