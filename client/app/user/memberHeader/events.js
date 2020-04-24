function goDiscovery() {
  try{
    var cb = document.getElementById('discoverybtn'); 
      cb.dispatchEvent(new MouseEvent('click', {
        view: window
      }));
  } catch(e){ window.location.assign('/discover');}
};

Template.memberHeader.events({
    'click .js-open-header-member-menu': Popup.open('memberMenu'),
    'click #stats': Popup.open('stats'),
    'click #cal': Popup.open('cal'),
    'click #tasks': Popup.open('tasks'),
    'click #asss': Popup.open('asss'),
    'click #mine': Popup.open('mine'),
    'click #exit': function() {
        goDiscovery()
    }
});