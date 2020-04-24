var uuid = require('uuid');
var fs = require('fs');
var base64Img = require('base64-img');

var AWS = require('aws-sdk');
var Secrets = require('../utils').Secrets

var S3Creds = Secrets.aws.s3
var S3 = new AWS.S3(S3Creds);

var Helpers = require('../helpers')
var addPointsToUser = Helpers.addPointsToUser
var userGiftsToProducts = Helpers.userGiftsToProducts
var uploadToS3 = Helpers.uploadToS3
var guid = Helpers.guid


module.exports = function(options) {
    check(options, Object);
    console.log('editProfile')
    if (Meteor.isClient) {
        if (options.showDialog) vex.dialog.alert('Your profile was updated', function() {
    });
    } else {
        var ipAddr = this.connection&&this.connection.clientAddress||'0:0:0:1';
        var userAgent = this.connection&&this.connection.httpHeaders['user-agent']||'user-agent';
        for (var key in options) {
            if (key === 'avatar' && !Object.keys(options[key]).length) {
                delete options[key];
                continue;
            }
            if (key === 'avatar' && options[key].data) {
                var data = options[key].data;
                delete options[key];
                var _d = uuid();
                uploadToS3({
                    data: data,
                    name: _d,
                })
                options['avatar'] = Secrets.avatarURL + _d;
            }

            if (key==='_gifts'&&options[key].length) {
                options.gifts = [];
                options[key].forEach(function(obj) {
                    if (obj.data) {
                        var fn = guid() + new Date().getTime();
                        uploadToS3({
                            name: fn,
                            data: obj.data
                        });
                        obj.url = Secrets.avatarURL + fn;
                        delete obj['data'];
                        options.gifts.push(obj);
                    } else if (obj.url) {
                          options.gifts.push(obj);
                    }
                });

                delete options['_gifts'];
            }

            if (!options[key]) {
                delete options[key];
            }
        }

        if (Meteor.user().didSetProfile === true && Meteor.user().degenerateIAM === true) {
            if (options.iam && options.iam.length > 0) {
                options.degenerateIAM = false;
            } 
        };

        if (Meteor.user().didSetProfile === false) {
            if (options.primaryRole && options.iam && options.iam.length > 0) {
                options.didSetProfile = true;
                options.degenerateIAM = false;
            } else {
                options.didSetProfile = true;
                options.degenerateIAM = true;
            }
        };

        addPointsToUser(8)

        if (Object.keys(options).length > 0) {
            Meteor.users.update({_id: Meteor.user()._id}, {$set: options});
            userGiftsToProducts()
        };
    }
}