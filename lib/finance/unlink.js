module.exports = function() {
    var user = Meteor.user();
    var bank = user.bank;
    Meteor.users.update({_id: Meteor.user()._id}, {$set: { bank: null, _bank: bank }});
}