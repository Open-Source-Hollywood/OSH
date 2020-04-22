module.exports = function(slug, parent, text) {
    var user = Meteor.user()
    if (user) {
        if (Meteor.isServer) {
            check(slug, String)
            check(parent, Number)
            check(text, String)
            addPointsToUser(144)
            Comments.insert({
                projectId: slug,
                parent: parent,
                text: text,
                ownerId: user._id,
                ownerName: user.firstName + ' ' + user.lastName,
                ownerAvatar:user.avatar,
                createdAt: moment().format("MMMM D, YYYY"),
                createTimeActual: moment().format()
            })
        } else {
            $('#comment-box').val('')
        }
    } else {
        vex.dialog.alert('You must be signed in to do that.')
    }
}