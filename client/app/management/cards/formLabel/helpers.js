var labelColors = ['green', 'yellow', 'orange', 'red', 'purple', 'blue', 'sky',
'lime', 'pink', 'black'];

Template.formLabel.helpers({
    labels: function() {
        return _.map(labelColors, function(color) {
            return { color: color, name: '' };
        });
    }
});

Template.formLabel.rendered = function() {
    this.find('.js-autofocus').focus();
};