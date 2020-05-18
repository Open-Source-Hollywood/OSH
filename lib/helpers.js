var AWS = require('aws-sdk');
var Secrets = require('../secrets')
// use stripe.prod for prod
var StripePublicKey = Secrets.stripe.test.public
var StripeServerKey = Secrets.stripe.test.server

var AWSCreds = Secrets.aws

var S3 = new AWS.S3(AWSCreds.s3);
var SES = new AWS.SES(AWSCreds.ses);

var FirebaseKey = Secrets.google.firebase
var TwilioFrom = Secrets.twilio.number
var proxy = Secrets.proxy

var uuid = require('uuid');
var fs = require('fs');
var base64Img = require('base64-img');
var request = require( 'request' );


exports.BASE_URL = 'https://app.opensourcehollywood.org/'

var DEBUG = exports.DEBUG = function DEBUG(char, num) {
  console.log(new Array(num).join(char))
}

var emailToHTML = exports.emailToHTML = function emailToHTML(title, message, link, linkTitle) {
    var html = '';
    html += '<div style="max-width:550px; min-width:320px;  background-color: white; border: 1px solid #DDDDDD; margin-right: auto; margin-left: auto">';
    html += '<div style="margin-left:30px;margin-right:30px">';
    html += '<p>&nbsp;</p>';
    html += '<p><a href="https://opensourcehollywood.org" style="text-decoration:none;font-family:Verdana, Geneva, sans-serif;font-weight: bold; color: #3D3D3D;font-size: 15px">opensourcehollywood.org</a></p>';
    html += '<hr style="margin-top:10px;margin-bottom:65px;border:none;border-bottom:1px solid red"/>';
    html += '<h1 style="font-family: Tahoma, Geneva, sans-serif; font-weight: normal; color: #2A2A2A; text-align: center; margin-bottom: 65px;font-size: 20px; letter-spacing: 6px;font-weight: normal; border: 2px solid black; padding: 15px"><a href="https://opensourcehollywood.org">'
    html += title;
    html += '</a></h1>';
    html += '<h3 style="font-family:Palatino Linotype, Book Antiqua, Palatino, serif;font-style:italic;font-weight:500">Please <a href="https://opensourcehollywood.org"><span style="border-bottom: 1px solid red">check this out</span></a>:</h3>';
    html += '<p style="font-family:Palatino Linotype, Book Antiqua, Palatino, serif;font-size: 15px; margin-left: auto; margin-right: auto; text-align: justify;color: #666;line-height:1.5;margin-bottom:75px">';
    html += message;
    html += '</p>';
    if (link) {
        html += '<table style="width:100%">';
        html += '<th>';
        html += '<td style="width:25%"></td>';
        html += '<td style="background-color:black;with:50%;text-align:center;padding:15px"><a href="';
        html += link;
        html += '" style="margin-left: auto; margin-right: auto;text-decoration:none;color: white;text-align:center;font-family:Courier New, Courier, monospace;font-weight:600;letter-spacing:2px;padding:15px">';
        html += linkTitle;
        html += '</a></td>';
        html += '<td style="width:25%"></td>';
        html += '</th>';
        html += '</table>';
    }
    html += '<hr style="margin-top:10px;margin-top:75px"/>';
    html += '<p style="text-align:center;margin-bottom:15px"><small style="text-align:center;font-family:Courier New, Courier, monospace;font-size:10px;color#666">CC BY-OSH 1.0 <a href="https://opensourcehollywood.org/" style="color:#666">O . S . H .</a> | Made with <span style="color:red">&hearts;</span> in Los Angeles</small></p>';
    html += '<p>&nbsp;</p>';
    html += '</div>';
    html += '</div>';
    return html;
}

var addPointsToUser = exports.addPointsToUser = function addPointsToUser(points, userId) {
    try {
        userId = userId || Meteor.user()._id
        user = Meteor.users.findOne({_id: userId})
        score = user.influenceScore || 100
        points = points || 5
        while (points > 10) {
            points = Math.floor(points / 10)
        }
        if (points < 3) points = 4
        if (score < 100) {
            score = score * points
            if (score < 100) score = 100
        } else if (score < 1000) {
            score = score * (points/2)
        } else if (score < 10000) {
            score = score * (points/4)
        } else {
            _s = score + ''
            score = score + (score * (points / _s.length - 3))
        }

        Meteor.users.update({_id: userId}, {$set: {influenceScore: score}});
    } catch(e) {}
}

var markOffersPendingOff = exports.markOffersPendingOff = function markOffersPendingOff(offers) {

    var offerids = offers.map(function(o) { 
        if (o._id) {
            return o._id 
        };
        if (o.accept) {
            if (o.accept.details) {
                return o.accept.details._id
            };
        };
        if (o.decline) {
            if (o.decline.details) {
                return o.decline.details._id
            };
        };
        var keys = Object.keys(o)
        return o[keys[0]]._id
    })

    Offers.remove({_id: { $in: offerids }})

    // Offers.update({
    //   _id: {
    //     $in: offerids
    //   }
    // }, {$set: {pending: false}})
}

var deleteRejectedOffers = exports.deleteRejectedOffers = function deleteRejectedOffers(offers) {
    var offerids = offers.map(function(o) { 
        if (o._id) {
            return o._id 
        };
        var keys = Object.keys(o)
        return o[keys[0]]._id
    })

    Offers.remove({_id: { $in: offerids }})
}

var  projectGiftsToProducts = exports. projectGiftsToProducts = function projectGiftsToProducts(project) {
    
    var stripe = require("stripe")(StripeServerKey);
    var gifts = []
    var project = typeof project === 'string' ? Projects.findOne({_id:project}) : project

    function formatAndSaveProjectProduct(o) {
        o.owner = Meteor.user()._id
        o.productType = 'gift'
        o.projectSlug = project.slug

        var product = Products.insert(o)

        return o._id
    }

    function finalProjectGiftHandler() {
        // var _gifts = gifts.map(formatAndSaveProjectProduct)
        // Projects.update({_id: project._id}, {$set:{gifts:_gifts}})
        Projects.update({ _id: project._id }, { $set:{ gifts: gifts }})
        addPointsToUser(233)
    }

    if (!project.gifts||!project.gifts.length) return

    project.gifts.forEach(function(obj) {
        if (typeof obj === 'string') return

        if (obj.product) {
            gifts.push(obj)
            if (gifts.length===project.gifts.length) {
                return finalProjectGiftHandler()
            };
        };

        stripe.products.create({
            name: obj.name,
            type: 'service',
            metadata: {
                user: Meteor.user()._id,
                project: project._id
            }
        }, Meteor.bindEnvironment(function(err, product) {
            if (product) {
                obj.product = product
            }

            gifts.push(obj)
            if (gifts.length===project.gifts.length) {
                return finalProjectGiftHandler()
            };
        }));
    });
}

var userGiftsToProducts = exports.userGiftsToProducts = function userGiftsToProducts() {
    var stripe = require("stripe")(StripeServerKey)
    var user = Meteor.user()
    var gifts = []
    var assets = []

    function formatAndSaveUserProduct(o, isGift) {
        if (isGift) {
            o.productType = 'gift'
        } else {
            o.productType = 'asset'
        }

        o.owner = Meteor.user()._id
        var product = Products.insert(o)
        return o._id
    }

    function finalUserGiftsHandler() {
        // var _gifts = gifts.map(function(g) { return formatAndSaveUserProduct(g, true) })
        // var _assets = assets.map(formatAndSaveUserProduct)
        // Users.update({_id: user._id}, {$set:{gifts: _gifts, assets: _assets}})

        Users.update({_id: user._id}, {$set:{gifts: gifts, assets: assets}})
    }

    function assetsUsersHandler() {
        if (!user.assets.length) {
            return finalUserGiftsHandler()
        }
      
        user.assets.forEach(function(obj) {

            if (obj.product) {
                assets.push(obj)
                if (assets.length === user.assets.length) {
                    return finalUserGiftsHandler()
                };
                return
            };

            stripe.products.create({
                name: obj.name,
                type: 'service',
                metadata: {
                    user: user._id,
                    type: 'asset'
                }
            }, Meteor.bindEnvironment(function(err, product) {
                if (product) {
                obj.product = product
            }
                assets.push(obj)
                if (assets.length === user.assets.length) {
                    return finalUserGiftsHandler()
                }
            }));
        });
    }
 

    if (!user.gifts.length) {
        return assetsUsersHandler()
    } else {
        user.gifts.forEach(function(obj) {

            if (typeof obj === 'string') return

            if (obj.product) {
                gifts.push(obj)
                if (gifts.length === user.gifts.length) {
                    return assetsUsersHandler()
                };
                return
            };

            stripe.products.create({
                name: obj.name,
                type: 'service',
                metadata: {
                    user: user._id,
                    type: 'gift'
                }
            }, Meteor.bindEnvironment(function(err, product) {
                if (product) {
                    obj.product = product
                }

                gifts.push(obj)
                if (gifts.length === user.gifts.length) {
                    return assetsUsersHandler()
                };

            }))
        })
    }
}

var rejectedOffers = exports.rejectedOffers = function rejectedOffers(offers) {
  var stripe = require("stripe")(StripeServerKey)
  var offerids = offers.map(function(o) { 
    if (o._id) {
        return o._id 
    };
    var keys = Object.keys(o)
    return o[keys[0]]._id
  })

  Offers.update({
    _id: {
      $in: offerids
    }
  }, {$set: {pending: false, rejected: true}})
}

var approveUserToProject = exports.approveUserToProject = function approveUserToProject(options) {
    if (Meteor.isClient) return;

    /**
    @function filterOffers
      - handles offers with object { decision: offer }
    */
    function filterOffers(o, forApprove) {
        // add approved offers to list of approved
        var keys = Object.keys(o)
        var decision = keys[0]
        var offer = o[decision]
        // accept is set in projectMessage.js
        if ((forApprove&&decision==='accept')||(!forApprove&&decision!=='accept')) {
            // if donation offer, add to amountApplied
            return offer
        } 
    }

    // DEBUG differences, if any, for accept to acquire user data
    var applicant = options.user
    if (!applicant) {
        // console.log(JSON.stringify(options, null, 4))
        // console.log('no applicant')
        try {
            if (options.offers[0].accept) {
                applicant = options.offers[0].accept.details.offer.user
            } else {
                applicant = options.offers[0].accept.details.offer.user
            }
        } catch(e) {}

        if (!applicant) return;
    }


    var applicantId = applicant._id||applicant.id
    addPointsToUser(610, applicantId)
    addPointsToUser(144)
    var applicantName = applicant.firstName||'' + ' ' + applicant.lastName||''
    if (!applicantName.trim()) applicantName = 'applicant'

    var project = Projects.findOne({_id: options.project._id});

    // is the user the project author or applicant ???
    var isAuthor = project.ownerId===Meteor.user()._id ? true : false
    var negotiations = project.negotiations || [];
    var agreementsFinal = project.agreementsFinal || [];
    var usersApproved = project.usersApproved || [];
    var usersApplied = project.usersApplied || [];
    var crewApplicants = project.crewApplicants || [];
    var castApplicants = project.roleApplicants || [];
    var equityAllocated = project.equityAllocated || 0;
    var funded = project.funded || 0;
    var message = applicantName + ' was approved for a role in the campaign named ' + project.title + '. ';

    // list of approved roles
    var offers = [], declinedOffers = [], userUID = applicantId, slugID = project.slug;
    var priceToPay = 0
    var amountReceivable = 0
    var equityOut = 0
    var amountFunded = 0

    if (isAuthor) {
        // console.log(new Array(100).join('0-'))
        // console.log('isAuthor')
        offers = options.offers.filter(function(o) {
            return filterOffers(o, true)
        }).map(function(o) {
            return o.accept
        });

        // console.log('offers length =', offers.length)

        if (!offers.length) return false;
            // price to pay / equity to distribute
            offers.forEach(function(offer) {
        var _offer = null

        if (offer.offer) {
        _offer = offer.offer
        } else if (offer.details&&offer.details.offer) {
        _offer = offer.details.offer
        }
        if (_offer.type==='sourced'&&_offer.pay>0) {
        amountFunded += _offer.pay
        } else if (_offer.pay>0) {
        priceToPay += _offer.pay||0
        }
        equityOut += _offer.equity||0
        Offers.remove({_id: _offer._id})
        // console.log(new Array(1000).join('k'))
        // console.log(JSON.stringify(offer))
        Receipts.update({ offer: offer.details._id }, {$set: {
        pending: false,
        accepted: true,
        refund: offer.receipts||null
        }}, { multi: true })
        })

        // refund declined offers if they have receipt
        declinedOffers = options.offers.filter(function(o) {
            return filterOffers(o, false)
        }).map(function(o) {
            return o.decline
        });

        // each declined function remove offer and refund where appropriate
        declinedOffers.forEach(function(o) {
            if (o&&o.receipt) {
                var receipt = o.receipt
                declinedUserRefund(receipt.id, project, o.pay, [], function(err, receipts) {
                  if (!err) {
                    Offers.remove({_id: o._id})
                    Receipts.update({ offer: o._id }, {$set: {
                      pending: false,
                      rejected: true,
                      refund: receipts
                    }}, { multi: true })
                    rejectedOffers(declinedOffers)
                  };
                })
            }
        })
    } else {
        offers = options.offers
    }

    if (priceToPay&&priceToPay>0) {
        message += project.ownerName + ' agrees to pay ' + applicantName + ' ' + priceToPay + ' USD for their role. '
    }

    if (equityOut&&equityOut>0) {
        message += project.ownerName + ' agrees to pay ' + applicantName + ' ' + equityOut + ' shares in the ownership of the campaign. '
    }

    if (amountReceivable>0) {
        message += 'Applicant agrees to pay ' + amountReceivable + ' USD towards costs for their role.'
    }

    if (amountFunded>0) {
        message += applicantName + ' is recognized to have donated $' + amountFunded + ' towards production costs for this agreement. '
    };

    // create notification object
    createNotification({
        user: applicantId,
        message: message,
        title: options.project.title,
        slug: options.project.slug,
        purpose: 'approved'
    })

    createNotification({
        user:Meteor.user()._id,
        message: message,
        title: options.project.title,
        slug: options.project.slug,
        purpose: 'approved'
    })

    // add to finalAgreements
    agreementsFinal.push({
        uid: applicantId,
        roles: offers,
        message: message,
        priceToPay: priceToPay,
        amountReceivable: amountReceivable,
        equityOut: equityOut,
        amountFunded: amountFunded
    })

    // remove applicant from list of applicants
    for (var i = castApplicants.length - 1; i >= 0; i--) {
        var r = castApplicants[i]
        if (r.user.id===applicantId) castApplicants.splice(i, 1)
    }

    for (var i = crewApplicants.length - 1; i >= 0; i--) {
        var r = crewApplicants[i]
        if (r.user.id===applicantId) crewApplicants.splice(i, 1)
    }

    // update project
    if (usersApproved.indexOf(userUID)===-1) usersApproved.push(userUID)
    var updateObj = { 
        usersApplied: usersApplied, 
        usersApproved: usersApproved, 
        equityAllocated: equityAllocated + equityOut, 
        funded: funded + amountFunded,
        crewApplicants: crewApplicants,
        roleApplicants: castApplicants,
        agreementsFinal: agreementsFinal
    }

    Projects.update({_id: project._id}, { $set: updateObj })

    // update board
    var board = Boards.findOne({slug: project.slug})
    // if member not in board then add
    var boardMembers = board.members
    var notInBoard = true
    boardMembers.forEach(function(m) {
        if (m.userId===userUID) {
            notInBoard = false
            return
        }
    })

    if (notInBoard) {
        Boards.update({slug: project.slug}, { $push: { members: {
            "userId" : options.user._id,
            "isAdmin" : false
        }}})
    }

    // archive communications
    ProjectMessages.update({user: applicantId, project: project._id}, {$set: {archived:true}})

    // notify applicant of the decision
    var projectApplicant = Users.findOne({_id: applicantId})
    var notification_preferences = projectApplicant.notification_preferences || {}
    var email_preferences = notification_preferences.email || {}
    var phone_preferences = notification_preferences.phone || {}
    /**
    sendEmailNotification(email, html, text, subject)
    sendPhoneNotification(phone, body)
    */
    var textMessage = 'Congratulations! You were selected and approved to join the campaign titled: ' + project.title + '. You now have access to the project board where tasks will be assigned to you. To access the board, view the project page from the main screen or from your DASHBOARD.'
    if (email_preferences.email&&email_preferences.verification===true) {
        /** send email notification */
        var html = emailToHTML('YOU ARE ON A NEW CAMPAIGN!', textMessage)
        sendEmailNotification(email_preferences.email, html, textMessage, 'Approval Notice from O . S . H .')
    }

    if (phone_preferences.phone&&phone_preferences.verification===true) {
        /** send phone notification */
        sendPhoneNotification(phone_preferences.phone, textMessage)
    }

    // notify author of the decision
    var projectAuthor = Users.findOne({_id: project.ownerId})
    var notification_preferences = projectAuthor.notification_preferences || {}
    var email_preferences = notification_preferences.email || {}
    var phone_preferences = notification_preferences.phone || {}
    /**
    sendEmailNotification(email, html, text, subject)
    sendPhoneNotification(phone, body)
    */
    var textMessage = 'Congratulations! You have a new team member for the campaign titled: ' + project.title + '. This member has access to the project board where you can assign them tasks. To access the board, view the project page from the main screen or from your DASHBOARD.'
    if (email_preferences.email&&email_preferences.verification===true) {
        /** send email notification */
        var html = emailToHTML('YOUR TEAM IS +1!', textMessage)
        sendEmailNotification(email_preferences.email, html, textMessage, 'New Team Member from O . S . H .')
    }

    if (phone_preferences.phone&&phone_preferences.verification===true) {
        /** send phone notification */
        sendPhoneNotification(phone_preferences.phone, textMessage)
    }

    return true
}

var myId = exports.myId = function myId() {
    if (!Meteor.user()) return null;
    return Meteor.user()._id;
}

var myName = exports.myName = function myName() {
    if (!Meteor.user()) return 'anonymous patron';
    return Meteor.user().firstName + ' ' + Meteor.user().lastName;
}

var myCustomerId = exports.myCustomerId = function myCustomerId() {
    return Meteor.user().customer&&Meteor.user().customer.id||null
}

var myAvatar = exports.myAvatar = function myAvatar() {
    return Meteor.user()&&Meteor.user().avatar||'https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Gold_Star.svg/2000px-Gold_Star.svg.png'
}

var myEmail = exports.myEmail = function myEmail(phoneIfNotEmail) {
    if (Meteor.user().notification_preferences&&Meteor.user().notification_preferences.email&&Meteor.user().notification_preferences.email.verification) {
        return Meteor.user().notification_preferences.email.email
    };

    if (phoneIfNotEmail) {
        if (Meteor.user().notification_preferences&&Meteor.user().notification_preferences.phone&&Meteor.user().notification_preferences.phone.verification) {
            return Meteor.user().notification_preferences.phone.phone
        };
    };

    return null
}

var miniMe = exports.miniMe = function miniMe() {
    return {
        id: Meteor.user()&&Meteor.user()._id||'anon',
        name: myName(),
        avatar: Meteor.user()&&Meteor.user().avatar||'/img/star.png'
    }
}

var notifyByEmailAndPhone = exports.notifyByEmailAndPhone = function notifyByEmailAndPhone(options) {
    // user, title, message, subject
    var recipient = Users.findOne({_id: options.user});

    if (!recipient) return;

    var notification_preferences = recipient.notification_preferences || {};
    var email_preferences = notification_preferences.email || {};
    var phone_preferences = notification_preferences.phone || {};
    /**
    sendEmailNotification(email, html, text, subject)
    sendPhoneNotification(phone, body)
    */
    var textMessage = options.message;
    if (email_preferences.email&&email_preferences.verification===true) {
        /** send email notification */
        var html = emailToHTML(options.title, textMessage);
        sendEmailNotification(email_preferences.email, html, textMessage, options.subject);
    }

    if (phone_preferences.phone&&phone_preferences.verification===true) {
        /** send phone notification */
        sendPhoneNotification(phone_preferences.phone, textMessage);
    }
}

var createNotification = exports.createNotification = function createNotification(options) {
    /**
    NEEDS:
    user, message, title, slug, purpose
    */
    var name = Meteor.user() ? myName() : 'anonymous patron';
    Notifications.insert({
        user: options.user,
        name: name,
        message: options.message,
        from: myName(),
        avatar: myAvatar(),
        title: options.title,
        slug: options.slug,
        offer: options.offer,
        purpose: options.purpose,
        created: new Date(),
        viewed: false
    });

    notifyByEmailAndPhone({
        user: options.user,
        message: options.message,
        title: options.title,
        subject: options.subject||options.title
    });
}

var createReceipt = exports.createReceipt = function createReceipt(options) {
    /**
    NEEDS:
    title, slug, amount, purpose, receipt
    */
    if (!Meteor.user()) return;
    var o = {
        user: options.user||myId(),
        avatar: myAvatar(),
        name: myName(),
        owner: options.owner,
        order: options.order,
        title: options.title,
        slug: options.slug,
        type: options.type,
        amount: options.amount,
        purpose: options.purpose,
        created: new Date(),
        receipt: options.receipt,
        pending: options.pending||false,
        link: options.link,
        linkTitle: options.linkTitle,
        offer: options.offer,
        parties: options.parties
    }
    if (options.order&&options.order.shares) {
        o.fulfilled = true
    };
    Receipts.insert(o);
}

var uploadToS3 = exports.uploadToS3 = function uploadToS3(options) {
    base64Img.img(
        options.data, 
        '', 
        options.name, 
        Meteor.bindEnvironment(function(err, buffer) {
        var uploadParams = {
            Bucket: Secrets.bucket,
            Key: options.name,
            Body: fs.createReadStream(buffer),
            ACL: 'public-read'
        };
        S3.upload(uploadParams, Meteor.bindEnvironment(function(err) {
            if (err) console.log(err);
            // set modified object to user
            fs.unlink(buffer);
            }, function() {
            console.log('failed to bind environment')
        }));
    }, function() {
        console.log('failed to bind environment')
    }));
}

var getMiniURL = exports.getMiniURL = function getMiniURL(url) {
    var requestParams = {
        uri:    'https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=' + FirebaseKey,
        method: 'POST',
        json: {
            longDynamicLink: url,
            suffix: {
                option: 'short'
            }
        }
    }
    var future = new (Npm.require('fibers/future'))();
    request( requestParams, Meteor.bindEnvironment(function ( err, response, body ) {
        if (err) return future.return(err.message);
        future.return(body);
    }));
    return future.wait();
}

var guid = exports.guid = function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

var sendEmailNotification = exports.sendEmailNotification = function sendEmailNotification(emails, html, text, subject) {
    if (typeof emails === 'string') emails = [ emails ];
    var params = {
        Destination: {
            ToAddresses: emails
        }, 
        Message: {
            Body: {
                Html: {
                    Charset: "UTF-8", 
                    Data: html
                }, 
                Text: {
                    Charset: "UTF-8", 
                    Data: text
                }
            }, 
            Subject: {
                Charset: "UTF-8", 
                Data: subject
            }
        }, 
        ReplyToAddresses: ["noreply@opensourcehollywood.org"],
        ReturnPath: "noreply@opensourcehollywood.org",
        Source: "noreply@opensourcehollywood.org"
    };
    SES.sendEmail(params, function(err, data) {
        if (err) {
            console.log(err, err.stack); // an error occurred
        } else {
            console.log(data);           // successful response
        };
        /*
        data = {
        MessageId: "EXAMPLE78603177f-7a5433e7-8edb-42ae-af10-f0181f34d6ee-000000"
        }
        */
    });
}

var sendPhoneNotification = exports.sendPhoneNotification = function sendPhoneNotification(phone, body) {
    var __opts = {
        to: phone,
        from: TwilioFrom,
        body: body,
    }
    var options = {
        method: 'post',
        body: __opts,
        json: true,
        url: Secrets.proxy
    }
    request(options, function(err, res, body) {});
}

var removeProjectMessages = exports.removeProjectMessages = function removeProjectMessages(user, slug) {
    ProjectMessages.remove({user: user, slug: slug})
}

var declinedUserRefund = exports.declinedUserRefund = function declinedUserRefund(tx, project, amount, receipts, cb, user) {
    var stripe = require("stripe")(
        StripeServerKey
    );
    stripe.refunds.create({
        charge: tx,
    }, Meteor.bindEnvironment(function(err, receipt) {
        if (err) return cb(err);
        // createReceipt({
        //     title: project.title,
        //     slug: project.slug,
        //     owner: project.ownerId,
        //     amount: amount,
        //     order: null,
        //     purpose: 'declined refund',
        //     receipt: receipt,
        //     refund: true,
        //     user: user
        // });
        try {
            receipts.push(receipt)
        } catch(e) {}
        cb(null, receipts)
    }));
}