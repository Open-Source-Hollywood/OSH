module.exports = function(slug) {
     check(slug, String)
     if (Meteor.isServer) {
          var project = Projects.findOne({slug: slug})
          // TODO, update influence scores
          var board = Boards.findOne({slug: slug})
          Projects.update({slug: slug}, { $set: { archived: true } })
          Boards.update({slug: slug}, { $set: { archived: true } })
          Cards.update({boardId: board._id}, { $set: { archived: true } })
          Receipts.update({
               projectId: project._id
          }, {
               $set: {
               projFinished: true
          }})
     }
     if (Meteor.isClient) {
          vex.dialog.confirm({
               message: 'This campaign is history.', 
               callback: function() {
                    Router.go('Home')
               }
          })
     }
}