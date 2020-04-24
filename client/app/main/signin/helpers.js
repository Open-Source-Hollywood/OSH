Template.signin.helpers({
  finishedLoading: function() {
    return Session.get('connectReady');
  }
});