Template.formLabel.events({
    'click .js-palette-color': function(event, tpl) {
        var $this = $(event.currentTarget);

        // hide selected ll colors
        $('.js-palette-select').addClass('hide');

        // show select color
        $this.find('.js-palette-select').removeClass('hide');
    }
});