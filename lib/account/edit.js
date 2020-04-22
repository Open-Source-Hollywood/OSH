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
    // console.log('upgradeProfile')
    addPointsToUser(34)
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
                var datum = options[key].data;
                delete options[key];
                var d = new Date().getTime();
                var _d = uuid();
                var __d = d.toString().substr(0,8) + _d.substr(0,4);
                base64Img.img(datum, '', __d, Meteor.bindEnvironment(function(err, filepath) {
                    S3.upload({
                        Body: fs.createReadStream(filepath),
                        ACL: 'public-read',
                        Key: __d,
                    }, Meteor.bindEnvironment(function(err) {
                        if (err) console.log(err);
                        var __x = 'https://s3-us-west-2.amazonaws.com/producehour/headshots/' + __d;
                        Meteor.users.update({_id: Meteor.user()._id}, {$set: {'avatar': __x}});
                        fs.unlink(filepath);
                    }, function() {
                      // console.log('in upgradeProfile 1')
                      // console.log('failed to bind environment')
                    }));
                  }, function() {
                    // console.log('in upgradeProfile 2')
                    // console.log('failed to bind environment')
              }));
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
                        obj.url = 'https://s3-us-west-2.amazonaws.com/producehour/headshots/' + fn;
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

        if (Object.keys(options).length > 0) {
            Meteor.users.update({_id: Meteor.user()._id}, {$set: options});
            userGiftsToProducts()
        };
    }
}