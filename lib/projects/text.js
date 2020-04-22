module.exports = function(options) {
    check(options, Object);
    Projects.update({slug: options.slug}, {$addToSet: { updates: options.update }});
}