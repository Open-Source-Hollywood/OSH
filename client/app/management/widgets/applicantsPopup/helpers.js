Template.applicantsPopup.helpers({
    applicants: function() {
        var usersApplied = Projects.findOne({slug: this.board.slug}).usersApplied;
        usersApplied = usersApplied || [];
        var appliedIds = usersApplied.map(function(i){return i.id;});
        var appliedContribution = usersApplied.map(function(i){return i.contribution;});
        var usersArray = Projects.findOne({slug: this.board.slug}).usersApplied;
        var o = [];
        var ids = [];
        usersArray.forEach(function(i) {
            var _o = {};
            _o.id = i.id;
            ids.push(i.id);
            _o.contribution = i.contribution;
            o.push(_o);
        });
        var users = Users.find({'_id': {$in:appliedIds}}).fetch();
        users.forEach(function(i) {
            for (var j = 0; j < usersArray.length; j++) {
                var currUser = usersArray[j];
                if (currUser.id === i._id) {
                    currUser.name = i.firstName + ' ' + i.lastName;
                    currUser.thumbnailUrl = i.avatar;
                };
            };
        });
        return usersArray;
    },
    areApplicants: function() {
        return Projects.findOne({slug: this.board.slug}).usersApplied.length > 0;
    } 
})
