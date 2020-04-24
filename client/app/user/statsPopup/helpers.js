var currentBoard = function() {
    return Boards.findOne(Router.current().params.boardId);
};

Template.statsPopup.onRendered(function() {
    // get tasks total v tasks completed
    var board = currentBoard();
    var tasksTotal = Cards.find({boardId: board._id}).fetch();
    var tasksTotalLength = tasksTotal.length;
    var tasksFinished = 0;
    var personalTasksTotal = 0, personalTasksFinished = 0, personalTasksRemaining = 0;
    var myId = Meteor.user()._id;
    tasksTotal.forEach(function(t) {
        if (t.archived) tasksFinished += 1;
        t.members = t.members || [];
        var truthy = true;
        for (var i = 0; i < t.members.length; i++) {
            if (myId === t.members[i]) {
                personalTasksTotal += 1;
                if (t.archived) {
                    personalTasksFinished += 1;
                };
                truthy = false;
                break;
            };
        };
        if (truthy && myId === t.userId) {
            personalTasksTotal += 1;
            if (t.archived) {
                personalTasksFinished += 1;
            };
        };
    });
    personalTasksRemaining = personalTasksTotal - personalTasksFinished;
    var tasksRemaining = tasksTotal.length - tasksFinished;

    // get personal total v personal completed
    var polarData = [
        {
            value: tasksTotal.length,
            color:"#F7464A",
            highlight: "#FF5A5E",
            label: "total tasks"
        },
        {
            value: tasksFinished,
            color: "#46BFBD",
            highlight: "#5AD3D1",
            label: "total finished"
        },
        {
            value: tasksRemaining,
            color: "#FDB45C",
            highlight: "#FFC870",
            label: "total remaining"
        },
        {
            value: personalTasksTotal,
            color: "#949FB1",
            highlight: "#A8B3C5",
            label: "yours total"
        },
        {
            value: personalTasksFinished,
            color: "#4D5360",
            highlight: "#616774",
            label: "yours finished"
        },
        {
            value: personalTasksRemaining,
            color: "#FFCE56",
            highlight: "#FF9063",
            label: "yours remaining"
        }
    ];


    var ctx = document.getElementById("canvas").getContext("2d");
    return new Chart(ctx).PolarArea(polarData, {
        responsive:true
    });
});