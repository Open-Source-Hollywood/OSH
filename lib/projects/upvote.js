/** user can upvote project */
module.exports = function (slug) {
    check(slug, String);
    var query = {slug: slug};
    var thisUser = Meteor.user()._id;
    if (!thisUser) {
      // Make sure logged out public can't upvote it
      throw new Meteor.Error("not-authorized");
    }
    else {
      if (!(Projects.findOne({slug: slug, upvotedUsers: thisUser}))) {
        Projects.update(query, { $inc: { count: 1 }});
        Projects.update(query, { $push: { upvotedUsers: thisUser }});

        if (Projects.findOne({slug: slug, downvotedUsers: thisUser})) {
          Projects.update(query, { $pull: { downvotedUsers: thisUser }});
        };
      }
    }
}