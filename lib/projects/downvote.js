/** user removes upvote */
module.exports = function (slug) {
    check(slug, String);
    var query = {slug: slug};
    var thisUser = Meteor.user()._id;
    if (!thisUser) {
        // Make sure logged out public can't downvote it
        throw new Meteor.Error("not-authorized");
    }
    else {
        if (!(Projects.findOne({slug: slug, downvotedUsers: thisUser}))) {
            Projects.update(query, { $inc: { count: -1 }});
            Projects.update(query, { $push: { downvotedUsers: thisUser }});

            if (Projects.findOne({slug: slug, upvotedUsers: thisUser})) {
                Projects.update(query, { $pull: { upvotedUsers: thisUser }});
            };
        }
    }
}