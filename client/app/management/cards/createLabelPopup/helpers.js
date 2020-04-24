var labelColors = ['green', 'yellow', 'orange', 'red', 'purple', 'blue', 'sky',
'lime', 'pink', 'black'];

Template.createLabelPopup.helpers({
    // This is the default color for a new label. We search the first color that
    // is not already used in the board (although it's not a problem if two
    // labels have the same color)
    defaultColor: function() {
        var usedColors = _.pluck(this.card.board().labels, 'color');
        var availableColors = _.difference(labelColors, usedColors);
        return availableColors.length > 1 ? availableColors[0] : 'green';
    }
});