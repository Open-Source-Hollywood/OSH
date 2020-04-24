  Template.sortBar.events({
    'click #hot': function() {
     document.getElementById('sortChoice').innerHTML = document.getElementById('hot').innerHTML;
   },
   'click #top': function() {
     document.getElementById('sortChoice').innerHTML = document.getElementById('top').innerHTML;
   },
   'click #newest': function() {
     document.getElementById('sortChoice').innerHTML = document.getElementById('newest').innerHTML;
   },
   'click #alphabetical': function() {
     document.getElementById('sortChoice').innerHTML = document.getElementById('alphabetical').innerHTML;
   },
   'click #film': function() {
     document.getElementById('sortChoice').innerHTML = document.getElementById('film').innerHTML;
   },
   'click #music': function() {
     document.getElementById('sortChoice').innerHTML = document.getElementById('music').innerHTML;
   },
   'click #books': function() {
     document.getElementById('sortChoice').innerHTML = document.getElementById('books').innerHTML;
   }
 });

  $('.dropdown-toggle').dropdown();

  $(".dropdown-menu a").click(function() {
    $(this).closest(".dropdown-menu").prev().dropdown("toggle");
  });
