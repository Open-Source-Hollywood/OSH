var Helpers = require('../helpers')
var uploadToS3 = Helpers.uploadToS3

module.exports = function(options) {
    check(options, Object);
    if (Meteor.isServer) {
        if (options._image) {
            var fn = guid() + new Date().getTime()
            uploadToS3({
                name: fn,
                data: options._image
            })
            options.image = 'https://s3-us-west-2.amazonaws.com/producehour/headshots/' + fn;
        } 
        options.banner = 'https://picsum.photos/1140/450?image=' + (Math.floor(Math.random() * 1084)+1)
        delete options['image']
        options.created = new Date()
        options.author = {
            name: 'Bob Rich',
            avatar: 'https://s3-us-west-2.amazonaws.com/producehour/bob.png',
            description: 'Bob is an author, independent filmmaker, and advocate for open sourcing the production process. He\'s generously sharing his keen insights, observations, and experiences with the world at large, and we are fortunate to have his creative writing featured on our service.',
            id: 'h6hMjCTqgvju6S6ES'
        }
        var blog = Blogs.insert(options);      
    }
    if (Meteor.isClient) {
        vex.dialog.alert('new blog created');
    }
}