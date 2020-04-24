Template.boardChangePermissionPopup.events({
    'click .js-select': function(event, t) {
        var $this = $(event.currentTarget),
            permission = $this.attr('name');

        Boards.update(this._id, {
            $set: {
                permission: permission
            }
        });
        Popup.close();
    }
});
