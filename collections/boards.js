Boards = new Mongo.Collection('boards');

Boards.attachSchema(new SimpleSchema({
    title: {
        type: String
    },
    slug: {
        type: String
    },
    purpose: {
        type: String
    },
    archived: {
        type: Boolean
    },
    createdAt: {
        type: Date,
        denyUpdate: true
    },
    createdBy: {
        type: String
    },
    // XXX Inconsistent field naming
    modifiedAt: {
        type: Date,
        denyInsert: true,
        optional: true
    },
    // De-normalized label system
    'labels.$._id': {
        // We don't specify that this field must be unique in the board because
        // that will cause performance penalties and is not necessary because
        // this field is always set on the server.
        // XXX Actually if we create a new label, the `_id` is set on the client
        // without being overwritten by the server, could it be a problem?
        type: String
    },
    'labels.$.name': {
        type: String,
        optional: true
    },
    'labels.$.color': {
        type: String
    },
    // XXX We might want to maintain more informations under the member
    // sub-documents like an `isActive` boolean (so we can keep a trace of
    // former members) or de-normalized meta-data (the date the member joined
    // the board, the number of contributions, etc.).
    'members.$.userId': {
        type: String
    },
    'members.$.isAdmin': {
        type: Boolean
    },
    permission: {
        type: String,
        allowedValues: ['public', 'private']
    },
    'background.type': {
        type: String,
        allowedValues: ['color']
    },
    'background.color': {
        // It's important to be strict about what we accept here, because if
        // certain malicious data are inserted this could lead to XSS injections
        // since we display this variable in a <style> tag.
        type: String,
        regEx: /^#[0-9A-F]{6}$/
    }
}));

// ALLOWS
Boards.allow({
    insert: Meteor.userId,
    update: allowIsBoardAdmin,
    remove: allowIsBoardAdmin,
    fetch: ['members']
});

// We can't remove a member if it is the last administrator
Boards.deny({
    update: function(userId, doc, fieldNames, modifier) {
        if (! _.contains(fieldNames, 'members'))
            return false;

        // We only care in case of a $pull operation, ie remove a member
        if (! _.isObject(modifier.$pull && modifier.$pull.members))
            return false;

        // If there is more than one admin, it's ok to remove anyone
        var nbAdmins = _.filter(doc.members, function(member) {
            return member.isAdmin;
        }).length;
        if (nbAdmins > 1)
            return false;

        // If all the previous conditions where verified, we can't remove
        // a user if it's an admin
        var removedMemberId = modifier.$pull.members.userId;
        return !! _.findWhere(doc.members, {
            userId: removedMemberId,
            isAdmin: true
        });
    },
    fetch: ['members']
});

// HELPERS
Boards.helpers({
    isPublic: function() {
        return this.permission === 'public';
    },
    lists: function() {
        return Lists.find({ boardId: this._id, archived: false }, { sort: { sort: 1 }});
    },
    activities: function() {
        return Activities.find({ boardId: this._id }, { sort: { createdAt: -1 }});
    },
    absoluteUrl: function() {
        return Router.path("Board", { boardId: this._id, slug: this.slug });
    }
});

// We define a set of six default background colors that we took from the FlatUI
// palette: http://flatuicolors.com
// XXX Unfortunately since we need this list in both the board insert hook and
// in one of the client side helper we have to makes it global. Change this when
// the variable sharing model of meteor is improved.
DefaultBoardBackgroundColors = ["#16A085", "#C0392B", "#2980B9",
                                "#8E44AD", "#2C3E50", "#E67E22"];

// HOOKS
Boards.before.insert(function(userId, doc) {
    // Handle labels
    var defaultLabels = ['green', 'yellow', 'orange', 'red', 'purple', 'blue'];
    doc.labels = [];
    _.each(defaultLabels, function(val) {
        doc.labels.push({
            _id: Random.id(6),
            name: '',
            color: val
        });
    });

    // We randomly chose one of the default background colors for the board
    if (Meteor.isClient) {
        doc.background = {
            type: "color",
            color: Random.choice(DefaultBoardBackgroundColors)
        };
    }
});

Boards.before.update(function(userId, doc, fieldNames, modifier) {
    modifier.$set = modifier.$set || {};
    modifier.$set.modifiedAt = moment().format('MMMM D, YYYY');
});


isServer(function() {

    // Let MongoDB ensure that a member is not included twice in the same board
    Meteor.startup(function() {
        Boards._collection._ensureIndex({
            '_id': 1,
            'members.userId': 1
        }, { unique: true });
    });

    // Genesis: the first activity of the newly created board
    Boards.after.insert(function(userId, doc) {

        var project = Projects.findOne({slug: doc.slug})

        Activities.insert({
            type: 'board',
            activityTypeId: doc._id,
            activityType: "createBoard",
            boardId: doc._id,
            userId: userId
        });

        // fill in lists and cards relative to purpose
        /*
        list on before
        doc.title: title.value,
        boardId: this.board._id,
        doc.createdAt = new Date();
        doc.archived = false;
        var user = Users.findOne(userId);
        if (!doc.userId) doc.userId = userId;
        */

        /*
        card on before

        doc.createdAt = new Date();
        doc.dateLastActivity = new Date();

        // defaults
        doc.archived = false;

        // userId native set.
        if (!doc.userId) {
            doc.userId = userId;
        }
        */

        /*

            needs: [ { need: 'foo bla bla', tags: [Object] } ],

        */

        var needs = project.needs;
        var tagsHolder = [], needsTitleHolder = [];
        needs.forEach(function(n) {
            needsTitleHolder.push(n.need);
            n.tags.forEach(function(t) {
                t = t.toLowerCase();
                if (tagsHolder.indexOf(t) === -1) {
                    tagsHolder.push(t);
                };
            });
        });

        if (tagsHolder.length < 3 && needsTitleHolder.length < 3) {
            // generic board template
            var listPreplanId = Lists.insert({
                title: "Baseline",
                boardId: doc._id,
                createdAt: new Date,
                archived: false,
                userId: userId
            });
            Cards.insert({
                createdAt: new Date,
                dateLastActivity: new Date,
                archived: false,
                userId: userId,
                title: "build team",
                listId: listPreplanId,
                boardId: doc._id,
                sort:0
            });
            Cards.insert({
                createdAt: new Date,
                dateLastActivity: new Date,
                archived: false,
                userId: userId,
                title: "finalize member agreements and commitments",
                listId: listPreplanId,
                boardId: doc._id,
                sort:1
            });
            Cards.insert({
                createdAt: new Date,
                dateLastActivity: new Date,
                archived: false,
                userId: userId,
                title: "brainstorm/team meeting",
                listId: listPreplanId,
                boardId: doc._id,
                sort:2
            });
            switch (doc.purpose) {
                case "Motion Pictures/Theatrical": {

                    Cards.insert({
                        createdAt: new Date,
                        dateLastActivity: new Date,
                        archived: false,
                        userId: userId,
                        title: "script readthrough",
                        listId: listPreplanId,
                        boardId: doc._id,
                        sort:3
                    });

                    Cards.insert({
                        createdAt: new Date,
                        dateLastActivity: new Date,
                        archived: false,
                        userId: userId,
                        title: "framing, videography discussion",
                        listId: listPreplanId,
                        boardId: doc._id,
                        sort:4
                    });

                    Cards.insert({
                        createdAt: new Date,
                        dateLastActivity: new Date,
                        archived: false,
                        userId: userId,
                        title: "audio/score discussion",
                        listId: listPreplanId,
                        boardId: doc._id,
                        sort:5
                    });

                    Cards.insert({
                        createdAt: new Date,
                        dateLastActivity: new Date,
                        archived: false,
                        userId: userId,
                        title: "secure locations",
                        listId: listPreplanId,
                        boardId: doc._id,
                        sort:6
                    });

                    Cards.insert({
                        createdAt: new Date,
                        dateLastActivity: new Date,
                        archived: false,
                        userId: userId,
                        title: "secure props",
                        listId: listPreplanId,
                        boardId: doc._id,
                        sort:7
                    });

                    Cards.insert({
                        createdAt: new Date,
                        dateLastActivity: new Date,
                        archived: false,
                        userId: userId,
                        title: "discussion with support teams",
                        listId: listPreplanId,
                        boardId: doc._id,
                        sort:8
                    });


                    Cards.insert({
                        createdAt: new Date,
                        dateLastActivity: new Date,
                        archived: false,
                        userId: userId,
                        title: "finalize storyboarding",
                        listId: listPreplanId,
                        boardId: doc._id,
                        sort:9
                    });


                    Cards.insert({
                        createdAt: new Date,
                        dateLastActivity: new Date,
                        archived: false,
                        userId: userId,
                        title: "finalize scheduling",
                        listId: listPreplanId,
                        boardId: doc._id,
                        sort:10
                    });


                    Cards.insert({
                        createdAt: new Date,
                        dateLastActivity: new Date,
                        archived: false,
                        userId: userId,
                        title: "finalize legal documents, permits, and waivers",
                        listId: listPreplanId,
                        boardId: doc._id,
                        sort:11
                    });

                    Lists.insert({
                        title: "Video Assets",
                        boardId:doc._id,
                        createdAt: new Date,
                        archived: false,
                        userId: userId 
                    });

                    Lists.insert({
                        title: "Audio Assets",
                        boardId:doc._id,
                        createdAt: new Date,
                        archived: false,
                        userId: userId 
                    });

                    Lists.insert({
                        title: "SFX Assets",
                        boardId:doc._id,
                        createdAt: new Date,
                        archived: false,
                        userId: userId 
                    });

                    Lists.insert({
                        title: "Writing Assets",
                        boardId:doc._id,
                        createdAt: new Date,
                        archived: false,
                        userId: userId 
                    });

                    var listPostId = Lists.insert({
                        title: "Post",
                        boardId: doc._id,
                        createdAt: new Date,
                        archived: false,
                        userId: userId
                    });

                    Cards.insert({
                        createdAt: new Date,
                        dateLastActivity: new Date,
                        archived: false,
                        userId: userId,
                        title: "screenings",
                        listId: listPostId,
                        boardId: doc._id,
                        sort:0
                    });

                    Cards.insert({
                        createdAt: new Date,
                        dateLastActivity: new Date,
                        archived: false,
                        userId: userId,
                        title: "post edits",
                        listId: listPostId,
                        boardId: doc._id,
                        sort:1
                    });

                    Cards.insert({
                        createdAt: new Date,
                        dateLastActivity: new Date,
                        archived: false,
                        userId: userId,
                        title: "conference submissions",
                        listId: listPostId,
                        boardId: doc._id,
                        sort:2
                    });

                    break;
                }

                case "Writing/Novel": {
                    Lists.insert({
                        title: "Writing Assets",
                        boardId:doc._id,
                        createdAt: new Date,
                        archived: false,
                        userId: userId 
                    });

                    var listPostId = Lists.insert({
                        title: "Post",
                        boardId: doc._id,
                        createdAt: new Date,
                        archived: false,
                        userId: userId
                    });

                    Cards.insert({
                        createdAt: new Date,
                        dateLastActivity: new Date,
                        archived: false,
                        userId: userId,
                        title: "editing, polish, finish",
                        listId: listPostId,
                        boardId: doc._id,
                        sort:0
                    });

                    break;
                }

                case "Music/Score": {
                    Lists.insert({
                        title: "Audio Assets",
                        boardId:doc._id,
                        createdAt: new Date,
                        archived: false,
                        userId: userId 
                    });

                    var listPostId = Lists.insert({
                        title: "Post",
                        boardId: doc._id,
                        createdAt: new Date,
                        archived: false,
                        userId: userId
                    });

                    Cards.insert({
                        createdAt: new Date,
                        dateLastActivity: new Date,
                        archived: false,
                        userId: userId,
                        title: "final master",
                        listId: listPostId,
                        boardId: doc._id,
                        sort:0
                    });

                    break;
                }
            }
        } else if (tagsHolder.length < 3 && needsTitleHolder.length > 3) {
            // define cards by needs
            needsTitleHolder.forEach(function(n) {
                var _list = Lists.insert({
                    title: n,
                    boardId:doc._id,
                    createdAt: new Date,
                    archived: false,
                    userId: userId 
                });
                Cards.insert({
                    createdAt: new Date,
                    dateLastActivity: new Date,
                    archived: false,
                    userId: userId,
                    title: "Define task.",
                    listId: _list,
                    boardId: doc._id,
                    sort:0
                });
            });
        } else {
            // production, resource, location, finance, general labor, legal, marketing, distribution, other
            var productionNeeds = ['Interviews, casting, and auditions.', 'Compliance and paperwork.', 'Introductory team meeting.', 'Pre-production goals defined in a document and shared with the team.', 'Team evaluation.', 'Post-production goals defined in a document and shared with the team.'];
            var resourceNeeds = ['Schedule resource agreement.', 'Sign resource sharing agreement.', 'Define resource state, condition, and flaws.', 'Return resource and sign waiver.'];
            var locationNeeds = ['Location evaluations and decision.', 'Visit location and dry run.', 'Permits, waivers, and agreements.', 'Setup location.', 'Breakdown and cleanup.'];
            var financeNeeds = ['Write business plan.', 'Write marketing, sales, and distribution plan.','Meet investors and pitch.','Accounting and paperwork.'];
            var laborNeeds = ['Define labor tasks.', 'Arrange transportation, food, and materials.', 'Insurance, waivers, and compliance.'];
            var legalNeeds = ['Initial consultation.', 'Agreement and retainer.', 'Define issues.'];
            var marketingNeeds = ['Marketing media.', 'Marketing technologies.', 'Marketing subscriptions.', 'Payment and accounting.'];
            var distributionNeeds = ['Define markets.', 'Define target audience persona.', 'Analysis and evaluation.'];
            var genericNeeds = ['Define tasks.']
            var tagsMapped = {
                production: ['Production Goals', productionNeeds],
                resource: ['Resource Allocation', resourceNeeds],
                location: ['Locations, Venues, and Scenes', locationNeeds],
                finance: ['Financial Needs', financeNeeds],
                'general labor': ['Labor & General Work', laborNeeds],
                legal: ['Intellectual Property & Compliance', legalNeeds],
                marketing: ['Social Media, Marketing, and Technology', marketingNeeds],
                distribution: ['Sales, Distribution, and Markets', distributionNeeds]
            }
            // define cards by tags
            tagsHolder.forEach(function(t) {
                if (Object.keys(tagsMapped).indexOf(t) === -1) return;
                var _title = tagsMapped[t][0];
                var targetArr = tagsMapped[t][1];
                var _list = Lists.insert({
                    title: _title,
                    boardId:doc._id,
                    createdAt: new Date,
                    archived: false,
                    userId: userId 
                });
                targetArr.forEach(function(_t, idx) {
                    Cards.insert({
                        createdAt: new Date,
                        dateLastActivity: new Date,
                        archived: false,
                        userId: userId,
                        title: _t,
                        listId: _list,
                        boardId: doc._id,
                        sort:idx
                    });
                });
            });
        }
    });

    // If the user remove one label from a board, we cant to remove reference of
    // this label in any card of this board.
    Boards.after.update(function(userId, doc, fieldNames, modifier) {
        if (! _.contains(fieldNames, 'labels') ||
            ! modifier.$pull ||
            ! modifier.$pull.labels ||
            ! modifier.$pull.labels._id)
            return;

        var removedLabelId = modifier.$pull.labels._id;
        Cards.update(
            { boardId: doc._id },
            {
                $pull: {
                    labels: removedLabelId
                }
            },
            { multi: true }
        );
    });

    // Add a new activity if we add or remove a member to the board
    Boards.after.update(function(userId, doc, fieldNames, modifier) {
        if (! _.contains(fieldNames, 'members'))
            return;

        // Say hello to the new member
        if (modifier.$push && modifier.$push.members) {
            var memberId = modifier.$push.members.userId;
            Activities.insert({
                type: 'member',
                activityType: "addBoardMember",
                boardId: doc._id,
                userId: userId,
                memberId: memberId
            });
        }

        // Say goodbye to the former member
        if (modifier.$pull && modifier.$pull.members) {
            var memberId = modifier.$pull.members.userId;
            Activities.insert({
                type: 'member',
                activityType: "removeBoardMember",
                boardId: doc._id,
                userId: userId,
                memberId: memberId
            });
        }
    });
});
