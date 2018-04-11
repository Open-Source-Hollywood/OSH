// Meteor.startup(function(){
//   SyncedCron.options = {
//     log: true,
//     collectionName: 'Housekeeping',
//     utc: true
//   }

//   SyncedCron.add({
//     name: 'projectsHousekeeping',
//     schedule: function(parser) {
//       return parser.text('every weekday');
//     },
//     job: function() {
//       Meteor.call('projectsHousekeeping');
//     }
//   });

//   SyncedCron.start();
// });