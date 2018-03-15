// Meteor.startup(function(){
//   SyncedCron.options = {
//     log: true,
//     collectionName: 'Projects',
//     utc: true
//   }

//   SyncedCron.add({
//     name: 'projectsHousekeeping',
//     schedule: function(parser) {
//       return parser.text('every 1 mins');//every weekday
//     },
//     job: function() {
//       Meteor.call('projectsHousekeeping');
//     }
//   });

//   SyncedCron.start();
// });