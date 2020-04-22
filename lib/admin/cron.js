module.exports = function() {
    console.log(new Array(100).join('&'));
    var projects = Projects.find({}).fetch();
    // console.log(projects.length)
    // evaluate if donative offer expired

    // refund and remove donative offer 
}