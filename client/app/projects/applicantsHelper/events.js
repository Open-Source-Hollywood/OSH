Template.applicantsHelper.events({
  'click .initiateNegotiate': function(e) {
    try {
      var val = JSON.parse($(e.target).attr('val'))
      Meteor.call('pokeApplicant', val);
    } catch(e) {
      vex.dialog.alert('There was an error, please try again later.');
    }
  }
});
