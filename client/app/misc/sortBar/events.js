Template.usortBar.events({
    'click #all': function() {
        Session.set('uorder', 'all');
        document.getElementById('sortChoice').innerHTML = document.getElementById('all').innerHTML;
    },
    'click #viewer': function() {
        Session.set('uorder', 'viewer');
        document.getElementById('sortChoice').innerHTML = document.getElementById('viewer').innerHTML;
    },
    'click #writer': function() {
        Session.set('uorder', 'writer');
        document.getElementById('sortChoice').innerHTML = document.getElementById('writer').innerHTML;
    },
    'click #actor': function() {
        Session.set('uorder', 'actor');
        document.getElementById('sortChoice').innerHTML = document.getElementById('actor').innerHTML;
    },
    'click #director': function() {
        Session.set('uorder', 'director');
        document.getElementById('sortChoice').innerHTML = document.getElementById('director').innerHTML;
    },
    'click #producer': function() {
        Session.set('uorder', 'producer');
        document.getElementById('sortChoice').innerHTML = document.getElementById('producer').innerHTML;
    },
    'click #cinematographer': function() {
        Session.set('uorder', 'cinematographer');
        document.getElementById('sortChoice').innerHTML = document.getElementById('cinematographer').innerHTML;
    }
});