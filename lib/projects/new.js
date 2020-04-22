var Secrets = require('../utils').Secrets
var StripePublicKey = Secrets.stripe.test.public
var StripeServerKey = Secrets.stripe.test.server
var Gkey = Secrets.google.key
var request = require( 'request' );
// live email handler is app.opensourcehollywood.org
// local email handler is localhost:4112
var BASE_URL = 'https://app.opensourcehollywood.org/'; 

var Helpers = require('../helpers')
var DEBUG = Helpers.DEBUG
var addPointsToUser = Helpers.addPointsToUser
var projectGiftsToProducts = Helpers.projectGiftsToProducts
var createNotification = Helpers.createNotification
var uploadToS3 = Helpers.uploadToS3
var getMiniURL = Helpers.getMiniURL
var guid = Helpers.guid


module.exports = function (options, cb) {
    check(options, Object);

    if (Meteor.isClient) return
    var shouldExit = false,
        ownerId = Meteor.user()._id,
        slug = ownerId.substr(ownerId.length - 2) + new Date().getTime(),
        _user = {
            userId: ownerId,
            isAdmin: true
        },
        permission = 'public',
        members = [_user],
        validOptions = true,
        future = new (Npm.require('fibers/future'))();
    // does project with the same name exist for this producer?
    // https://maps.googleapis.com/maps/api/geocode/json?components=postal_code=01210|country:PL&key=
    // https://maps.googleapis.com/maps/api/geocode/json?components=postal_code=91316|country:US&key=
    // var previousProjectExists = Projects.findOne({title: options.title, genre: options.genre, archived: {$ne: true}})
    // if (previousProjectExists) {
    //   validOptions = false
    //   future.throw(new Meteor.Error("Error: duplicate project", "Your project contains identical data to a previous one you made. Please distinguish them with a separate genre or title."))
    //   return
    // }

    // default to No Ghost Bears
    options.zip = options.zip ? encodeURI(options.zip) : '90014'
    options.address = options.address ? encodeURI(options.address) : encodeURI('305 E 8th St #3')
    options.country = options.country ? encodeURI(options.country) : 'US'

    var geocode_url = 'https://maps.googleapis.com/maps/api/geocode/json?'
    if (options.zip && options.address) geocode_url += ['address=', options.address, 'components=postal_code:', options.zip, '|country:', (options.country||'US')].join('')
    else if (options.zip) geocode_url += ['components=postal_code:', options.zip, '|country:', (options.country||'US')].join('')
    else if (options.address) geocode_url += ['address=', options.address].join('')
    else geocode_url += 'components=postal_code:90210|country:US'
    geocode_url += ('&key=' + Gkey)

    // console.log(geocode_url)

    var requestParams = {
        uri:    geocode_url,
        method: 'GET'
    };

    request( requestParams, Meteor.bindEnvironment(function ( err, response, geoOptions ) {
        // console.log(geoOptions)
        if (geoOptions&&geoOptions.status=='OK') {
            geoOptions = JSON.parse(geoOptions);
            /** are results valid ? */
            var results = geoOptions.results[0];
            var loc = results.geometry.location;

            options.formattedAddress = results.formatted_address;
            options.location = {
                type: "Point",
                coordinates: [loc.lng, loc.lat]
            }
        };
        shouldExit = true;
        options.ownerId = ownerId;
        options.ownerName = Meteor.user().firstName + ' ' + Meteor.user().lastName;
        options.ownerAvatar = Meteor.user().avatar;
        options.createdAt = moment().format('MMMM D, YYYY');
        options.created = new Date();
        options.isApproved = true;
        options.community = 'general'; // TODO: group projects by community
        options.group = 'general'; // TODO: community subgroup
        options.archived = false;
        options.count = 0;
        options.funded = options.funded || 0;
        options.applied = 0;
        options.approved = 0;
        options.updates = [];
        options.upvotedUsers = [];
        options.downvotedUsers = [];
        options.usersApplied = [];
        options.usersApproved = [];
        options.slug = slug;
        options.purpose = options.category||'new project';

        // upload avatar and gift files
        if (options._banner) {
            var fn = guid() + new Date().getTime();
            uploadToS3({
                name: fn,
                data: options._banner
            });
            options.banner = 'https://s3-us-west-2.amazonaws.com/producehour/headshots/' + fn;
            delete options['_banner'];
        };
        options.gifts = [];
        options._gifts.forEach(function(obj) {
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

        delete options['_gifts']

        // get minified URL for project
        // getMiniURL
        var url = 'https://csc5w.app.goo.gl?link=https://opensourcehollywood.org/projects/'+options.slug+'/'+options.ownerId;
        var miniURL = getMiniURL(url);
        if (miniURL.shortLink) {
            options.urlLink = miniURL.shortLink;
        } else {
            options.urlLink = url;
        }

        var board = Boards.insert({
            title: options.title,
            slug: slug,
            permission : permission,
            members: members,
            archived: false,
            createdAt: new Date(),
            createdBy: ownerId,
            purpose: options.purpose,
            needs: options.needs
        });

        options.bid = board;
        var project = Projects.insert(options);

        projectGiftsToProducts(project)

        var stripe = require("stripe")(StripeServerKey)

        stripe.products.create({
            name: 'campaign donation id:' + project,
            type: 'service',
            metadata: {
                user: Meteor.user()._id,
                type: 'donation',
                projectSlug: options.slug
            }
        }, Meteor.bindEnvironment(function(err, product) {
            if (err) return
            Projects.update({slug: options.slug}, {$set: { donate: product }});
        }));

        createNotification({
            user: options.ownerId,
            message: ['You created campaign "', options.title, '"'].join(''),
            title: options.title,
            slug: options.slug,
            purpose: 'new campaign'
        });
        var msg = 'Created! You have access to DETAILS and BOARD '

        addPointsToUser(1000)

        if(future)future.return(msg);   
        
    })); 

    if (future) return future.wait();
}